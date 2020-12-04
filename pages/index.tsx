import Head from "next/head";
import { useEffect, useState } from "react";
import { withAuth } from "../hocs/HOC";
import { TSessionProps } from "../types/types";

function Home(props: TSessionProps) {
  const { session } = props;
  const [calendars, setCalendars] = useState();

  useEffect(() => {
    async function fetchCalendars() {
      const response = await fetch("/api/listcalendar");
      if (response.ok) {
        setCalendars(await response.json());
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
        <pre>{calendars && JSON.stringify(calendars, null, 2)}</pre>
      </div>
    </>
  );
}

export default withAuth(Home);
