import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import axios from "axios";
import Head from "next/head";
import { useEffect, useState } from "react";
import CalendarItem from "../client/components/calendar/CalendarItem";
import { withAuth } from "../client/hocs/HOC";
import { TGoogleCalendarItem, TSessionProps } from "../types/types";
import Skeleton from "@material-ui/lab/Skeleton";
import AlertComponent from "../client/components/common/Alert";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    calendarGrid: {
      display: "grid",
      gridTemplateRows: "auto",
      gap: theme.spacing(2),
      marginTop: theme.spacing(5),
      gridTemplateColumns: "repeat(auto-fit, minmax(600px, auto))",
    },
    title: {
      margin: theme.spacing(2),
    },
  }),
);

function Home(props: TSessionProps) {
  const { session } = props;
  const classes = useStyles();
  const [fetchError, setFetchError] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [calendarItems, setCalendarItems] = useState<TGoogleCalendarItem[]>([]);

  useEffect(() => {
    async function fetchCalendars() {
      setIsFetching(true);
      try {
        const response = await axios.get("/api/listcalendar");
        const calendarItems: TGoogleCalendarItem[] =
          response.data.body["items"];
        setCalendarItems(calendarItems);
      } catch (err) {
        const { data } = err.response;
        setFetchError(data.body.message);
      } finally {
        setIsFetching(false);
      }
    }
    fetchCalendars();
  }, [JSON.stringify(session)]);

  return (
    <div>
      <Head>
        <title>GC2CSV</title>
      </Head>
      <div className={classes.title}>
        <Typography variant="h4" gutterBottom align="center">
          Your Calendars
        </Typography>
      </div>
      {fetchError && (
        <AlertComponent severity="error">{fetchError}</AlertComponent>
      )}
      <div className={classes.calendarGrid}>
        {isFetching &&
          [...Array(12).keys()].map((key) => (
            <Skeleton animation="wave" variant="rect">
              <CalendarItem
                calendarItem={{
                  summary:
                    "Lorem ipsum dolor sit amet consectetur adipisicing. Aperiam, nulla!",
                  kind: "lorem",
                  id: "ipsum dolor",
                  timezone: "lorem",
                  etag: "ipsum",
                  backgroundColor: "#fff",
                  foregroundColor: "#fff",
                }}
              />
            </Skeleton>
          ))}
        {!isFetching &&
          calendarItems.length > 0 &&
          calendarItems.map((calendarItem) => (
            <CalendarItem calendarItem={calendarItem} key={calendarItem.etag} />
          ))}
      </div>
    </div>
  );
}

export default withAuth(Home);
