import React from "react";
import Link from "next/link";
import { TGoogleCalendarItem } from "../../../types/types";
import {
  Button,
  Card,
  CardActions,
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
    },
  }),
);

function CalendarItem(props: TCalendarItemProps) {
  const classes = useStyles();
  const {
    calendarItem: { kind, etag, id, summary, timezone },
  } = props;

  return (
    <Card className={classes.root} component={Paper} elevation={5}>
      <CardContent>
        <Typography variant="body1">{summary}</Typography>
      </CardContent>
      <CardActions>
        <Link href={`/calendar/${encodeURIComponent(id)}`}>
          <Button size="small" variant="contained" color="secondary">
            View This Calendar
          </Button>
        </Link>
      </CardActions>
    </Card>
  );
}

export default CalendarItem;
