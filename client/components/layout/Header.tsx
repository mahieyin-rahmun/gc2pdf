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
import Link from "next/link";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing(2, 2, 2, 2),
    },
    title: {
      fontFamily: "Yusei Magic",
      "&:hover": {
        cursor: "pointer",
      },
    },
    navText: {
      fontFamily: "Yusei Magic",
    },
    loggedIn: {
      display: "grid",
      gap: theme.spacing(2),
      gridTemplateColumns: "0.1fr 1fr 0.5fr",
      alignItems: "center",
      justifyItems: "start",
    },
  }),
);

function Header(props) {
  const classes = useStyles();
  const [session, loading] = useSession();

  return (
    <div>
      <div className={classes.header}>
        <Link href="/">
          <Typography variant="h4" gutterBottom className={classes.title}>
            GC2PDF
          </Typography>
        </Link>
        <Typography variant="button" gutterBottom className={classes.navText}>
          Generate PDFs from your Google Calendar events
        </Typography>
        {!loading && session && (
          <div className={classes.loggedIn}>
            <Avatar src={session.user.image}></Avatar>
            <Typography className={classes.navText} variant="caption">
              {session.user.name}
            </Typography>
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
      <hr />
    </div>
  );
}

export default Header;
