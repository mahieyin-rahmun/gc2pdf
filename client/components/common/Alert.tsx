import React from "react";
import { Alert, AlertTitle, AlertProps } from "@material-ui/lab";

type TAlertProps = Pick<AlertProps, "severity">;

const AlertComponent: React.FC<TAlertProps> = (props) => {
  const { severity, children } = props;

  return (
    <Alert severity={severity || "info"}>
      <AlertTitle>{severity || "info".toUpperCase()}</AlertTitle>
      <strong>{children}</strong>
    </Alert>
  );
};

export default AlertComponent;
