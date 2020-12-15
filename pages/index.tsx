import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import CalendarItem from "../client/components/CalendarItem";
import { withAuth } from "../client/hocs/HOC";
import { TGoogleCalendarItem, TSessionProps } from "../types/types";

function Home(props: TSessionProps) {
  const { session } = props;
  const [fetchError, setFetchError] = useState<string>("");
  const [calendarItems, setCalendarItems] = useState<TGoogleCalendarItem[]>([]);

  useEffect(() => {
    async function fetchCalendars() {
      try {
        const response = await axios.get("/api/listcalendar");
        const calendarItems: TGoogleCalendarItem[] =
          response.data.body["items"];
        setCalendarItems(calendarItems);
      } catch (err) {
        const { data } = err.response;
        setFetchError(data.body.message);
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
        {fetchError && <h3>{fetchError}</h3>}
        {calendarItems.length > 0 &&
          calendarItems.map((calendarItem) => (
            <CalendarItem calendarItem={calendarItem} key={calendarItem.etag} />
          ))}
      </div>
    </>
  );
}

export default withAuth(Home);
