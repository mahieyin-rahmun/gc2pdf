import { cloneDeep } from "lodash";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import CalendarEventTable from "../../client/components/calendar/CalendarEventTable";
import { withAuth } from "../../client/hocs/HOC";
import { TGoogleCalendarEvent, TSessionProps } from "../../types/types";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import LuxonUtils from "@date-io/luxon";
import ReactToPrint from "react-to-print";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Chip,
  createStyles,
  FormControlLabel,
  FormHelperText,
  makeStyles,
  TextField,
  Theme,
  Typography,
} from "@material-ui/core";
import Link from "next/link";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import KeyboardBackspaceRoundedIcon from "@material-ui/icons/KeyboardBackspaceRounded";
import TableHeading from "../../client/components/calendar/TableHeading";
import Skeleton from "@material-ui/lab/Skeleton";
import AlertComponent from "../../client/components/common/Alert";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";

type TCalendarEventsProps = TSessionProps & Record<string, any>;

function ISODateString(d: Date) {
  function pad(n: number) {
    return n < 10 ? "0" + n : n;
  }
  return (
    d.getUTCFullYear() +
    "-" +
    pad(d.getUTCMonth() + 1) +
    "-" +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    ":" +
    pad(d.getUTCMinutes()) +
    ":" +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      display: "grid",
      gap: theme.spacing(3),
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(3),
      gridTemplateRows: "0.5fr",
      gridTemplateColumns: "1fr 1fr 0.5fr",
    },
    input: {
      display: "grid",
      gridTemplateRows: "1fr",
      gridTemplateColumns: "0.4fr 1fr",
      alignItems: "center",
    },
    events: {
      display: "grid",
      gridTemplateRows: "0.1fr auto",
      marginTop: theme.spacing(2),
      alignItems: "center",
      justifyItems: "center",
    },
    eventOptions: {
      display: "grid",
      gridTemplateColumns: "1fr 0.5fr 1fr 1fr 1fr",
      gridTemplateRows: "auto",
      marginBottom: theme.spacing(3),
      gap: theme.spacing(3),
      alignItems: "center",
    },
    customTitle: {
      gridColumn: "4 / -1",
    },
    accordion: {
      width: "100%",
      marginBottom: theme.spacing(5),
    },
  }),
);

function CalendarEvents(props: TCalendarEventsProps) {
  const router = useRouter();
  const classes = useStyles();
  const tableRef = useRef();
  const [calendarEvents, setCalendarEvents] =
    useState<{
      summary: string;
      items: TGoogleCalendarEvent[];
    }>();
  const [filteredCalendarEvents, setFilteredCalendarEvents] =
    useState<{
      summary: string;
      items: TGoogleCalendarEvent[];
    }>();

  // filter states
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [excludeAttendeeError, setExcludeAttendeeError] = useState<string>("");
  const [excludeAttendee, setExcludeAttendee] = useState<string>("");
  const [excludedAttendees, setExcludedAttendees] = useState<Set<string>>(
    new Set(),
  );
  const [existingAttendees, setExistingAttendees] = useState<Set<string>>(
    new Set(),
  );

  // form states
  const [timeMin, setTimeMin] = useState<Date>(new Date());
  const [timeMax, setTimeMax] = useState<Date>(new Date());
  const [showCalendarName, setShowCalendarName] = useState<boolean>(true);
  const [customCalendarName, setCustomCalendarName] = useState<string>("");
  const [dateRangeError, setDateRangeError] = useState<string>("");
  const [fetchError, setFetchError] = useState<string>("");
  const [fetchingCalendarEvents, setFetchingCalendarEvents] =
    useState<boolean>(false);

  useEffect(() => {
    const currentDate = timeMax;
    setTimeMin(
      new Date(
        currentDate.getUTCFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - 7,
      ),
    );
  }, []);

  useEffect(() => {
    if (timeMin >= timeMax) {
      setDateRangeError("Starting date cannot exceed ending date");
    } else {
      setDateRangeError("");
    }
  }, [timeMin, timeMax]);

  useEffect(() => {
    if (calendarEvents?.summary) {
      setCustomCalendarName(calendarEvents.summary);
    }

    if (calendarEvents?.items.length > 0) {
      let listOfAttendees = new Set<string>();
      calendarEvents.items.forEach((calendarEvent) => {
        const { attendees } = calendarEvent;

        if (!attendees) {
          return;
        }

        const emails = attendees.map((attendee) => attendee.email);
        emails.forEach((email) => listOfAttendees.add(email));
      });
      setExistingAttendees(listOfAttendees);
    }
  }, [JSON.stringify(calendarEvents)]);

  // filter effect
  useEffect(() => {
    if (!calendarEvents) {
      return;
    }

    let filtered = cloneDeep(calendarEvents);
    let filteredEventsArray = filtered?.items;

    if (calendarEvents && titleFilter.length > 0) {
      filtered.items = filteredEventsArray.filter(
        ({ summary }) => summary.search(titleFilter) !== -1,
      );
    }

    if (calendarEvents && excludedAttendees.size > 0) {
      excludedAttendees.forEach((excludedEmail) => {
        filtered.items.forEach((event, eventIndex) => {
          event.attendees?.forEach((attendee, attendeeIndex) => {
            if (attendee.email === excludedEmail) {
              filtered.items[eventIndex].attendees.splice(attendeeIndex, 1);
            }
          });
        });
      });
    }

    setFilteredCalendarEvents(filtered);
  }, [
    titleFilter,
    JSON.stringify(Array.from(excludedAttendees)),
    JSON.stringify(calendarEvents),
  ]);

  const calendarId = router.query["calendarId"];

  const handleMinDateChange = ({ ts }: MaterialUiPickersDate) => {
    setTimeMin(new Date(ts));
  };

  const handleMaxDateChange = ({ ts }: MaterialUiPickersDate) => {
    setTimeMax(new Date(ts));
  };

  const fetchGoogleCalendarEvents = async () => {
    let startingDate = ISODateString(timeMin);
    let endingDate = ISODateString(timeMax);
    setFetchError("");
    setFetchingCalendarEvents(true);

    try {
      const response = await axios.get("/api/listevents", {
        params: { calendarId, timeMin: startingDate, timeMax: endingDate },
      });
      const { summary, items } = response.data.body;
      setCalendarEvents({
        summary,
        items,
      });
    } catch (err) {
      const { data } = err.response;
      setFetchError(data.body.message);
    } finally {
      setFetchingCalendarEvents(false);
    }
  };

  const handleTitleFilterChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setTitleFilter(event.target.value);
  };

  const handleExcludeAttendeeChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setExcludeAttendee(event.target.value);
  };

  const handleAddedToExcludedAttendeesList = (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === "Enter") {
      const email = excludeAttendee;

      if (email.length === 0) {
        setExcludeAttendeeError("No email typed");
        return;
      }

      let emailAmongExistingAttendees = existingAttendees.has(email);

      if (!emailAmongExistingAttendees) {
        setExcludeAttendeeError("Unknown email. Ignoring this filter");
        return;
      }

      setExcludedAttendees((previousExcludedAttendees) => {
        const newExcludedSet = new Set<string>();

        for (let previousExcludedAttendee of previousExcludedAttendees) {
          newExcludedSet.add(previousExcludedAttendee);
        }

        newExcludedSet.add(email);

        return newExcludedSet;
      });

      setExcludeAttendee("");
      setExcludeAttendeeError("");
    }
  };

  const handleExcludedAttendeeDelete = (excludedAttendeeEmail: string) => {
    setExcludedAttendees((previousExcludedAttendees) => {
      const excludedAttendeesArray = Array.from(previousExcludedAttendees);
      const filtered = excludedAttendeesArray.filter(
        (email) => email !== excludedAttendeeEmail,
      );
      const newExcludedAttendeesSet = new Set<string>();
      filtered.forEach((email) => newExcludedAttendeesSet.add(email));
      return newExcludedAttendeesSet;
    });
  };

  return (
    <div>
      <Link href="/">
        <Button startIcon={<KeyboardBackspaceRoundedIcon />}>Go Back</Button>
      </Link>
      {dateRangeError.length > 0 && (
        <AlertComponent severity="error">{dateRangeError}</AlertComponent>
      )}
      {fetchError.length > 0 && (
        <AlertComponent severity="error">{fetchError}</AlertComponent>
      )}
      <div className={classes.form}>
        <div className={classes.input}>
          <label htmlFor="timeMin">Starting Date: </label>
          <MuiPickersUtilsProvider utils={LuxonUtils}>
            <DatePicker
              variant="inline"
              color="secondary"
              name="timeMin"
              value={timeMin}
              onChange={handleMinDateChange}
            />
          </MuiPickersUtilsProvider>
        </div>
        <div className={classes.input}>
          <label htmlFor="timeMax">Ending Date: </label>
          <MuiPickersUtilsProvider utils={LuxonUtils}>
            <DatePicker
              variant="inline"
              color="secondary"
              name="timeMax"
              value={timeMax}
              onChange={handleMaxDateChange}
            />
          </MuiPickersUtilsProvider>
        </div>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => fetchGoogleCalendarEvents()}
          disabled={dateRangeError.length > 0 || fetchingCalendarEvents}
        >
          Fetch Calendar Events
        </Button>
      </div>
      {fetchingCalendarEvents &&
        [...Array(10).keys()].map((key) => (
          <Skeleton variant="text" width="100%">
            <TableHeading key={key} />
          </Skeleton>
        ))}
      {!fetchingCalendarEvents && calendarEvents && (
        <div className={classes.events}>
          <div className={classes.eventOptions}>
            <ReactToPrint
              trigger={() => <Button variant="outlined">Generate PDF</Button>}
              content={() => tableRef.current}
            />
            <Typography variant="body2" gutterBottom>
              Export Options:
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showCalendarName}
                  onChange={(_) =>
                    setShowCalendarName((showCalendarName) => !showCalendarName)
                  }
                  name="checkedA"
                />
              }
              label="Show Calendar Label"
            />
            {showCalendarName && (
              <div className={classes.customTitle}>
                <TextField
                  label="Custom Calendar Name (used in export)"
                  variant="outlined"
                  value={customCalendarName}
                  onChange={(event) =>
                    setCustomCalendarName(event.target.value)
                  }
                  fullWidth
                  style={{ width: "100%" }}
                />
              </div>
            )}
          </div>
          <Accordion className={classes.accordion}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.accordion}>
              <div style={{ width: "95%" }}>
                <Box mb={2}>
                  <TextField
                    name="titleFilter"
                    label="Title/Summary Filter"
                    variant="outlined"
                    fullWidth
                    onChange={handleTitleFilterChange}
                  />
                </Box>
                <TextField
                  error={!!excludeAttendeeError}
                  name="attendeesFilter"
                  label="Exclude one or multiple attendees' email from the PDF (type email and press Enter)"
                  variant="outlined"
                  fullWidth
                  value={excludeAttendee}
                  onKeyPress={handleAddedToExcludedAttendeesList}
                  onChange={handleExcludeAttendeeChange}
                />
                <FormHelperText error={!!excludeAttendeeError}>
                  {excludeAttendeeError}
                </FormHelperText>
                <Box display="flex" mt={2} mb={2}>
                  {excludedAttendees.size > 0 &&
                    Array.from(excludedAttendees).map((excludedAttendee) => (
                      <Chip
                        label={excludedAttendee}
                        key={JSON.stringify(excludeAttendee)}
                        onDelete={() =>
                          handleExcludedAttendeeDelete(excludedAttendee)
                        }
                        color="secondary"
                        style={{ marginRight: "4px", marginLeft: "4px" }}
                      />
                    ))}
                </Box>
              </div>
            </AccordionDetails>
          </Accordion>

          <CalendarEventTable
            ref={tableRef}
            calendarEvents={filteredCalendarEvents || calendarEvents}
            fetchError={fetchError}
            showCalendarName={showCalendarName}
            customCalendarName={customCalendarName}
          />
        </div>
      )}
    </div>
  );
}

export default withAuth(CalendarEvents);
