import { createStyles, makeStyles, Theme } from "@material-ui/core";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import CalendarItem from "../client/components/calendar/CalendarItem";
import { withAuth } from "../client/hocs/HOC";
import { TGoogleCalendarItem, TSessionProps } from "../types/types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    calendarGrid: {
      display: "grid",
      gridTemplateRows: "auto",
      gap: theme.spacing(2),
      marginTop: theme.spacing(5),
      gridTemplateColumns: "repeat(4, 1fr)",
    },
  }),
);

function Home(props: TSessionProps) {
  const { session } = props;
  const classes = useStyles();
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
    <div>
      <Head>
        <title>GC2CSV</title>
      </Head>
      <div className={classes.calendarGrid}>
        {fetchError && <h3>{fetchError}</h3>}
        {calendarItems.length > 0 &&
          calendarItems.map((calendarItem) => (
            <CalendarItem calendarItem={calendarItem} key={calendarItem.etag} />
          ))}
      </div>
    </div>
  );
}

export default withAuth(Home);
