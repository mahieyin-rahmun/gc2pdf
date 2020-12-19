import {
  Avatar,
  Button,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import { signOut, useSession } from "next-auth/client";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "2px solid #3d3e40",
      borderRadius: "20px",
      padding: theme.spacing(2, 2, 2, 2),
    },
    headerText: {
      fontFamily: "Yusei Magic",
    },
    loggedIn: {
      display: "grid",
      gap: theme.spacing(2),
      gridTemplateColumns: "0.1fr 0.4fr 0.5fr",
      alignItems: "center",
    },
  }),
);

function Header(props) {
  const classes = useStyles();
  const [session, loading] = useSession();

  return (
    <div className={classes.header}>
      <Typography variant="h4" gutterBottom className={classes.headerText}>
        GC2PDF
      </Typography>
      <Typography variant="button" gutterBottom className={classes.headerText}>
        Generate PDFs from your Google Calendar events
      </Typography>
      {!loading && session && (
        <div className={classes.loggedIn}>
          <Avatar src={session.user.image}></Avatar>
          <Typography variant="caption">{session.user.name}</Typography>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        </div>
      )}
    </div>
  );
}

export default Header;
