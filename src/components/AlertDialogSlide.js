import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { forwardRef } from "react";
import { useState } from "react";
import { useEffect } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({
  isDialogOpen,
  dialogBox,
  setDialogBox,
}) {
  const [open, setOpen] = useState(isDialogOpen);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  const handleClose = (action) => {
    //action - yes or no
    setDialogBox({ isDialogOpen: false, action: action });
    // setOpen(false);
    console.log(JSON.stringify(action));
  };

  // useEffect(() => {
  //   setOpen(isDialogOpen);
  // }, [dialogBox]);

  return (
    <div>
      {/* <Button variant="outlined" onClick={handleClickOpen}>
        Slide in alert dialog
      </Button> */}
      <Dialog
        open={isDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Save Invoice?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            The "Save Invoice" dialog box enables users to store and preserve
            their invoice data in the web app.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="warning" onClick={() => handleClose("NO")}>
            No, I want to change details
          </Button>
          <Button color="success" onClick={() => handleClose("YES")}>
            Save it
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
