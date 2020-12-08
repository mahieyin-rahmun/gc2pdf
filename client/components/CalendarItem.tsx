import React from "react";
import Link from "next/link";
import { TGoogleCalendarItem } from "../../types/types";

type TCalendarItemProps = {
  calendarItem: TGoogleCalendarItem;
};

function CalendarItem(props: TCalendarItemProps) {
  const {
    calendarItem: { kind, etag, id, summary, timezone },
  } = props;

  return (
    <div>
      <hr />
      <Link href={`/calendar/${encodeURIComponent(id)}`}>
        <h2>Calendar ID: {id}</h2>
      </Link>
      <h4>Summary: {summary}</h4>
      <p>
        Kind: {kind}, E-tag: {etag}
      </p>
      <hr />
    </div>
  );
}

export default CalendarItem;
