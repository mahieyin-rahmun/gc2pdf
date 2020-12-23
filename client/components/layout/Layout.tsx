import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Container, createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    layout: {
      height: "100vh",
      display: "grid",
      gap: "10px",
      gridTemplateColumns: "1fr",
      gridTemplateRows: "100px 1fr 100px",
      gridTemplateAreas: `"header" "main" "footer"`,
    },
  }),
);

const Layout: React.FC<{}> = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.layout}>
      <Header style={{ gridArea: "header" }} />
      <Container style={{ gridArea: "main" }}>{children}</Container>
      <Footer style={{ gridArea: "footer" }} />
    </div>
  );
};

export default Layout;
