import {
  Button,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { signIn } from "next-auth/client";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    accessDenied: {
      display: "grid",
      gridTemplateColumns: "1fr",
      justifyItems: "center",
      margin: theme.spacing(10, 0, 10, 0),
    },
  }),
);

function AccessDenied() {
  const classes = useStyles();

  return (
    <div className={classes.accessDenied}>
      <Typography align="center" variant="h4" gutterBottom>
        You don't seem to be logged in
      </Typography>
      <Button
        variant="outlined"
        color="secondary"
        size="large"
        onClick={() => signIn("google")}
      >
        Sign In To Your Google Account
      </Button>
    </div>
  );
}

export default AccessDenied;
