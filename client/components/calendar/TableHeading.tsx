import { TableHead, TableRow } from "@material-ui/core";
import React from "react";
import StyledTableCell from "./StyledTableCell";

function TableHeading() {
  return (
    <TableHead>
      <TableRow>
        <StyledTableCell>Title/Summary</StyledTableCell>
        <StyledTableCell align="left">Date and Day</StyledTableCell>
        <StyledTableCell align="center">Start Time</StyledTableCell>
        <StyledTableCell align="center">End Time</StyledTableCell>
        <StyledTableCell align="center">Google Meet Link</StyledTableCell>
        <StyledTableCell align="left">Attendees</StyledTableCell>
      </TableRow>
    </TableHead>
  );
}

export default TableHeading;
