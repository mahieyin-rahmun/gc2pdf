import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  withStyles,
  WithStyles,
  createStyles,
  Typography,
} from "@material-ui/core";
import React, { PureComponent } from "react";
import { TGoogleCalendarEvent } from "../../../types/types";
import CalendarEvent from "./CalendarEvent";
import Legend from "./Legend";
import TableHeading from "./TableHeading";

const styles = createStyles({
  table: {
    minWidth: "100%",
  },
  notFound: {
    marginTop: "16px",
  },
});

type TCalendarEventTableProps = {
  ref: React.MutableRefObject<any>;
  calendarEvents: {
    summary: string;
    items: TGoogleCalendarEvent[];
  };
  fetchError: string;
  showCalendarName: boolean;
  customCalendarName: string;
} & WithStyles<typeof styles>;

class CalendarEventTable extends PureComponent<TCalendarEventTableProps, {}> {
  render() {
    const {
      classes,
      calendarEvents,
      fetchError,
      showCalendarName,
      customCalendarName,
    } = this.props;

    return (
      <div>
        {calendarEvents &&
        fetchError.length === 0 &&
        calendarEvents.items &&
        calendarEvents.items.length > 0 ? (
          <TableContainer component={Paper}>
            {showCalendarName && (
              <Typography variant="h4" align="center" gutterBottom>
                {customCalendarName || calendarEvents.summary}
              </Typography>
            )}
            <Table
              className={classes.table}
              size="small"
              aria-label="simple table"
            >
              <TableHeading />
              <TableBody>
                {calendarEvents.items.map((calendarEvent) => (
                  <CalendarEvent
                    calendarEvent={calendarEvent}
                    key={calendarEvent.id}
                  />
                ))}
              </TableBody>
            </Table>
            <Legend />
          </TableContainer>
        ) : (
          <div className={classes.notFound}>
            <Typography variant="h4" gutterBottom>
              No events found for this date range/calendar ID.
            </Typography>
          </div>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(CalendarEventTable);
