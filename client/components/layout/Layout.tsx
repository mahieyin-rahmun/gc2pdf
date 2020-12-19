import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Container, createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layout: {
      display: "grid",
      gridTemplateRows: "100px 1fr 80px",
      height: "100vh",
      overflow: "auto",
    },
  }),
);

const Layout: React.FC<{}> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.layout}>
      <Header />
      <Container>{children}</Container>
      <Footer />
    </div>
  );
};

export default Layout;
