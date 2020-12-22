import { withStyles, Theme, createStyles, TableRow } from "@material-ui/core";

const StyledTableRow = withStyles((theme: Theme) =>
  createStyles({
    root: {
      "&:nth-of-type(even)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }),
)(TableRow);

export default StyledTableRow;
