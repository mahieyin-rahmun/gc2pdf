import {
  Paper,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  withStyles,
  WithStyles,
  createStyles,
} from "@material-ui/core";
import React, { PureComponent } from "react";
import { TGoogleCalendarEvent } from "../../../types/types";
import CalendarEvent from "./CalendarEvent";

const styles = createStyles({
  table: {
    minWidth: 450,
  },
});

type TCalendarEventTableProps = {
  ref: React.MutableRefObject<any>;
  calendarEvents: {
    summary: string;
    items: TGoogleCalendarEvent[];
  };
  fetchError: string;
} & WithStyles<typeof styles>;

class CalendarEventTable extends PureComponent<TCalendarEventTableProps, {}> {
  render() {
    const { classes, calendarEvents, fetchError } = this.props;

    return (
      <div>
        <TableContainer component={Paper}>
          <Table
            className={classes.table}
            size="small"
            aria-label="simple table"
          >
            <TableHead>
              <TableRow>
                <TableCell>Title/Summary</TableCell>
                <TableCell align="left">Date and Day</TableCell>
                <TableCell align="left">Start Time</TableCell>
                <TableCell align="left">End Time</TableCell>
                <TableCell align="left">Google Meet Link</TableCell>
                <TableCell align="left">Attendees</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {calendarEvents &&
                fetchError.length === 0 &&
                calendarEvents.items &&
                calendarEvents.items.length > 0 &&
                calendarEvents.items.map((calendarEvent) => (
                  <CalendarEvent
                    calendarEvent={calendarEvent}
                    key={calendarEvent.id}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
}

export default withStyles(styles)(CalendarEventTable);
