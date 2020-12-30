import React from "react";
import { makeStyles, Theme, createStyles, Typography } from "@material-ui/core";
import { getResponseStatusIcon } from "./Attendees";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    legend: {
      display: "grid",
      gridTemplateColumns: "repeat(9, auto)",
      gridTemplateRows: "1fr",
      gap: "10px",
      alignItems: "center",
      justifyContent: "center ",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
  }),
);

function Legend() {
  const classes = useStyles();

  return (
    <div className={classes.legend}>
      {getResponseStatusIcon({ responseStatus: "accepted" })}
      <Typography variant="caption">Accepted</Typography>
      {getResponseStatusIcon({ responseStatus: "declined" })}
      <Typography variant="caption">Declined</Typography>
      {getResponseStatusIcon({ responseStatus: "tentative" })}
      <Typography variant="caption">Maybe</Typography>
      {getResponseStatusIcon({ responseStatus: "needsAction" })}
      <Typography variant="caption">Hasn't responded yet</Typography>
    </div>
  );
}

export default Legend;
