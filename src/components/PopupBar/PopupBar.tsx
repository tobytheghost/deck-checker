import React, { useState } from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

type PopupBarTypes = {
  status: string;
  message: string;
};

const PopupBar = ({ status, message }: PopupBarTypes) => {
  const [snackbarOpen, setSnackbarOpen] = useState(true);

  const Alert = (props: any) => (
    <MuiAlert elevation={6} variant="filled" {...props} />
  );

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={4000}
      onClose={handleSnackbarClose}
    >
      <Alert onClose={handleSnackbarClose} severity={status}>
        <div>{message}</div>
      </Alert>
    </Snackbar>
  );
};

export default PopupBar;
