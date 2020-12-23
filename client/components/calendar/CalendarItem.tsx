import React from "react";
import Link from "next/link";
import { TGoogleCalendarItem } from "../../../types/types";
import {
  Card,
  CardContent,
  createStyles,
  makeStyles,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";

type TCalendarItemProps = {
  calendarItem: TGoogleCalendarItem;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 275,
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "column",
      alignItems: "start",
      "&:hover": {
        cursor: "pointer",
      },
    },
  }),
);

function CalendarItem(props: TCalendarItemProps) {
  const classes = useStyles();
  const {
    calendarItem: { kind, etag, id, summary, timezone, backgroundColor },
  } = props;

  return (
    <Link href={`/calendar/${encodeURIComponent(id)}`}>
      <Card
        className={classes.root}
        style={{
          background: `linear-gradient(150deg, #fff, ${backgroundColor})`,
        }}
        component={Paper}
        elevation={5}
      >
        <CardContent>
          <Typography variant="body1">{summary}</Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

export default CalendarItem;
