import React from "react";
import { TGoogleCalendarEvent } from "../../types/types";

type TCalendarEventProps = {
  calendarEvent: TGoogleCalendarEvent;
};

function CalendarEvent(props: TCalendarEventProps) {
  const {
    calendarEvent: { attendees, summary, start, end, hangoutLink },
  } = props;

  return (
    <div>
      <hr />
      <h2>Title: {summary}</h2>
      <h4>Start Time: {start?.dateTime}</h4>
      <h4>End Time: {end?.dateTime}</h4>
      <h5>Google Meet Link: {hangoutLink}</h5>
      <pre>
        Attendees:{" "}
        {attendees && attendees.length && attendees.length > 0
          ? JSON.stringify(attendees, null, 2)
          : "No attendees found"}
      </pre>
    </div>
  );
}

export default CalendarEvent;
