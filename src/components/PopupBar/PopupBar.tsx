import React from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

type PopupBarTypes = {
  handlePopupClose: () => void;
  status: string;
  message: string;
  open: boolean;
};

const PopupBar = ({
  handlePopupClose,
  status,
  message,
  open,
}: PopupBarTypes) => {
  const Alert = (props: any) => (
    <MuiAlert elevation={6} variant="filled" {...props} />
  );

  // console.log("open", open);
  // console.log("status", status);
  // console.log("message", message);

  return (
    <Snackbar open={open} autoHideDuration={4000} onClose={handlePopupClose}>
      <Alert onClose={handlePopupClose} severity={status}>
        <div>{message}</div>
      </Alert>
    </Snackbar>
  );
};

export default PopupBar;
