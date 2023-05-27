import React from "react";
import "./LoaderType1.css";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { useState } from "react";

export default function LoaderType1() {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* <Button onClick={handleToggle}>Show backdrop</Button> */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        // onClick={handleClose}
      >
        {/* <CircularProgress color="inherit" /> */}
        <div className="center-body">
          <div className="loader-square-3"></div>
        </div>
      </Backdrop>
    </>
  );
}
