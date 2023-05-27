import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useState } from "react";
import { useEffect } from "react";
import { forwardRef } from "react";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars({ message, category, time }) {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    handleClick();
  }, [message, time]);

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      {message != null && message != undefined && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={category.toLowerCase()}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      )}

      {/* Testing Purpose */}
      {false && (
        <>
          <Alert severity="error">{message}</Alert>
          <Button variant="outlined" onClick={handleClick}>
            Open success snackbar
          </Button>

          <Alert severity="warning">{message}</Alert>
          <Alert severity="info">{message}</Alert>
          <Alert severity="success">{message}</Alert>
        </>
      )}
      {/* Testing Purpose */}
    </Stack>
  );
}
