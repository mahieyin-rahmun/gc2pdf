import { TableCell, TableRow, Typography, Link } from "@material-ui/core";
import React from "react";
import { DateTimeObject, TGoogleCalendarEvent } from "../../../types/types";
import Attendees from "./Attendees";
import StyledTableRow from "./StyledTableRow";

type TCalendarEventProps = {
  calendarEvent: TGoogleCalendarEvent;
};

const parseDateTimeOrNotApplicable = (
  dateTime: DateTimeObject,
  format: Intl.DateTimeFormat,
) => {
  return dateTime.dateTime
    ? format.format(new Date(dateTime.dateTime).getTime())
    : dateTime.date
    ? format.format(new Date(dateTime.date).getTime())
    : "N/A";
};

const dateFormat = Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  weekday: "short",
  month: "short",
  year: "numeric",
});

const timeFormat = Intl.DateTimeFormat("en-US", {
  hour12: true,
  hour: "2-digit",
  minute: "2-digit",
});

function CalendarEvent(props: TCalendarEventProps) {
  const {
    calendarEvent: { attendees, summary, start, end, hangoutLink },
  } = props;

  const date = parseDateTimeOrNotApplicable(start, dateFormat);
  const startTime = parseDateTimeOrNotApplicable(start, timeFormat);
  const endTime = parseDateTimeOrNotApplicable(end, timeFormat);

  return (
    <StyledTableRow>
      <TableCell width="150px">{summary}</TableCell>
      <TableCell align="left">{date}</TableCell>
      <TableCell align="center">{startTime}</TableCell>
      <TableCell align="center">{endTime}</TableCell>
      <TableCell align="center">
        {hangoutLink ? <Link href={hangoutLink}>{hangoutLink}</Link> : "N/A"}
      </TableCell>
      <TableCell>
        {attendees && attendees.length && attendees.length > 0 ? (
          attendees.map((attendants) => {
            if (attendants.self) {
              return null;
            }

            return (
              <Attendees
                email={attendants.email}
                responseStatus={attendants.responseStatus}
                key={JSON.stringify(attendants.email)}
              />
            );
          })
        ) : (
          <Typography gutterBottom variant="body1" align="left">
            No attendees found
          </Typography>
        )}
      </TableCell>
    </StyledTableRow>
  );
}

export default CalendarEvent;
