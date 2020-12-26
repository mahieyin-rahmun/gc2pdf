import React from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HelpIcon from "@material-ui/icons/Help";
import CancelIcon from "@material-ui/icons/Cancel";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import { makeStyles, Theme, createStyles, Typography } from "@material-ui/core";

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
      <CheckCircleIcon color="action" style={{ color: "green" }} />
      <Typography variant="caption">Accepted</Typography>
      <CancelIcon color="action" style={{ color: "red" }} />
      <Typography variant="caption">Declined</Typography>
      <HelpIcon color="action" />
      <Typography variant="caption">Maybe</Typography>
      <HourglassEmptyIcon color="primary" />
      <Typography variant="caption">Hasn't responded yet</Typography>
    </div>
  );
}

export default Legend;
