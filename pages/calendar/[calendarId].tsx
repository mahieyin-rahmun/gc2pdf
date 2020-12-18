import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import CalendarEventTable from "../../client/components/CalendarEventTable";
import { withAuth } from "../../client/hocs/HOC";
import { TGoogleCalendarEvent, TSessionProps } from "../../types/types";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import LuxonUtils from "@date-io/luxon";
import ReactToPrint from "react-to-print";
import { DateTime } from "luxon";

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

function CalendarEvents(props: TCalendarEventsProps) {
  const router = useRouter();
  const tableRef = useRef();
  const [calendarEvents, setCalendarEvents] = useState<{
    summary: string;
    items: TGoogleCalendarEvent[];
  }>();

  const [timeMin, setTimeMin] = useState<Date>(new Date());
  const [timeMax, setTimeMax] = useState<Date>(new Date());
  const [dateRangeError, setDateRangeError] = useState<string>("");
  const [fetchError, setFetchError] = useState<string>("");
  const [fetchingCalendarEvents, setFetchingCalendarEvents] = useState<boolean>(
    false,
  );

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

  const calendarId = router.query["calendarId"];

  const handleMinDateChange = ({ ts }: DateTime) => {
    setTimeMin(new Date(ts));
  };

  const handleMaxDateChange = ({ ts }: DateTime) => {
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

  return (
    <div>
      <pre>{calendarId}</pre>
      {dateRangeError.length > 0 && <h3>{dateRangeError}</h3>}
      {fetchError.length > 0 && <h3>{fetchError}</h3>}
      <label htmlFor="timeMin">Starting Date</label> <br />
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <DatePicker
          name="timeMin"
          value={timeMin}
          onChange={handleMinDateChange}
        />
      </MuiPickersUtilsProvider>
      <br />
      <label htmlFor="timeMax">Ending Date</label> <br />
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <DatePicker
          name="timeMax"
          value={timeMax}
          onChange={handleMaxDateChange}
        />
      </MuiPickersUtilsProvider>
      <hr />
      <button
        onClick={() => fetchGoogleCalendarEvents()}
        disabled={dateRangeError.length > 0 || fetchingCalendarEvents}
      >
        Fetch Calendar Events
      </button>
      <ReactToPrint
        trigger={() => <button>Generate PDF</button>}
        content={() => tableRef.current}
      />
      <hr />
      <CalendarEventTable
        ref={tableRef}
        calendarEvents={calendarEvents}
        fetchError={fetchError}
      />
    </div>
  );
}

export default withAuth(CalendarEvents);
