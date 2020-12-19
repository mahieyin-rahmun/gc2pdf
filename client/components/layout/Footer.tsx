import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    footer: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  }),
);

function Footer() {
  const classes = useStyles();

  return (
    <div className={classes.footer}>
      <Typography variant="caption" align="center">
        &copy; Mahieyin Rahmun 2020
      </Typography>
    </div>
  );
}

export default Footer;
