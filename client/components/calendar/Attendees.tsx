import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import { Attendees as TAttendees } from "../../../types/types";

import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HelpIcon from "@material-ui/icons/Help";
import CancelIcon from "@material-ui/icons/Cancel";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";

type TAttendeesProps = Pick<TAttendees, "email" | "responseStatus">;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    iconDiv: {
      maxWidth: theme.spacing(1),
      maxHeight: theme.spacing(1),
      marginRight: theme.spacing(3),
    },
    responseStatus: {
      display: "flex",
    },
  }),
);

export const getResponseStatusIcon = ({
  responseStatus,
}: Pick<TAttendees, "responseStatus">) => {
  switch (responseStatus) {
    case "accepted":
      return <CheckCircleIcon color="action" style={{ color: "green" }} />;
    case "declined":
      return <CancelIcon color="action" style={{ color: "red" }} />;
    case "needsAction":
      return <HourglassEmptyIcon color="inherit" />;
    case "tentative":
      return <HelpIcon color="primary" />;
  }
};

function Attendees(props: TAttendeesProps) {
  const classes = useStyles();

  return (
    <div className={classes.responseStatus}>
      <div className={classes.iconDiv}>
        {getResponseStatusIcon({ responseStatus: props.responseStatus })}
      </div>
      <Typography gutterBottom variant="body1">
        {props.email}
      </Typography>
    </div>
  );
}

export default Attendees;
