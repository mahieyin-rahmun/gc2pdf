import Head from "next/head";
import { useEffect, useState } from "react";
import { withAuth } from "../client/hocs/HOC";
import { TGoogleCalendarItem, TSessionProps } from "../types/types";

function Home(props: TSessionProps) {
  const { session } = props;
  const [calendarItems, setCalendarItems] = useState<TGoogleCalendarItem[]>([]);

  useEffect(() => {
    async function fetchCalendars() {
      const response = await fetch("/api/listcalendar");
      if (response.ok) {
        const calendarItems: TGoogleCalendarItem[] = (await response.json())[
          "items"
        ];
        setCalendarItems(calendarItems);
      }
    }

    fetchCalendars();
  }, [JSON.stringify(session)]);

  return (
    <>
      <Head>
        <title>GC2CSV</title>
      </Head>
      <div>
        <p>Welcome, {session.user.email}</p>
        <pre>
          {calendarItems.length > 0 && JSON.stringify(calendarItems, null, 2)}
        </pre>
      </div>
    </>
  );
}

export default withAuth(Home);
