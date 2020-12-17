import { Typography } from "@material-ui/core";
import React from "react";
import { Attendees as TAttendees } from "../../types/types";

type TAttendeesProps = Pick<TAttendees, "email" | "responseStatus">;

function Attendees(props: TAttendeesProps) {
  return (
    <div>
      <Typography gutterBottom variant="body1">
        {props.email}
      </Typography>
      <Typography gutterBottom variant="caption">
        {props.responseStatus}
      </Typography>
    </div>
  );
}

export default Attendees;
