import { TableCell, TableRow, Typography } from "@material-ui/core";
import { useSession } from "next-auth/client";
import React from "react";
import { TGoogleCalendarEvent } from "../../types/types";
import Attendees from "./Attendees";

type TCalendarEventProps = {
  calendarEvent: TGoogleCalendarEvent;
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

  if (!attendees || !summary || !start || !end || !hangoutLink) {
    return null;
  }

  const date = dateFormat.format(new Date(start.dateTime).getTime());
  const startTime = timeFormat.format(new Date(start.dateTime).getTime());
  const endTime = timeFormat.format(new Date(end.dateTime).getTime());

  return (
    <TableRow>
      <TableCell width="150px">{summary}</TableCell>
      <TableCell align="left">{date}</TableCell>
      <TableCell align="left">{startTime}</TableCell>
      <TableCell align="left">{endTime}</TableCell>
      <TableCell align="left">{hangoutLink}</TableCell>
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
          <Typography gutterBottom variant="body1">
            No attendees found
          </Typography>
        )}
      </TableCell>
    </TableRow>
  );
}

export default CalendarEvent;
