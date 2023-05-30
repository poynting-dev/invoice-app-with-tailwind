import ExcelJS from "exceljs";
import React, { useEffect, useState } from "react";
import {
  Timestamp,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { ToolTip } from "./ToolTip";
import { useAuth } from "../../contexts/AuthContext";
import { store } from "../../state/store";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators } from "../../state/index";

// ---------
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { mapDispatchToProps } from "../../state/action-creators";
import { Link } from "react-router-dom";

import { DataGrid } from "@mui/x-data-grid";
import { createFakeServer } from "@mui/x-data-grid-generator";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import LoaderType1 from "../LoaderType1";
import convertDateToString from "../convertDateToString";
import CustomizedSnackbars from "../CustomizedSnackbars";
import { useRef } from "react";
import { useMemo } from "react";
import { Button } from "react-bootstrap";

const ExportDataToExcel = ({ invoices }) => {
  const handleExport = async () => {
    // Fetch data from Firebase
    // const snapshot = await firebase
    //   .database()
    //   .ref("/path/to/data")
    //   .once("value");
    // const data = snapshot.val();

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Data");
    worksheet.columns = [
      { header: "Invoice No.", key: "id", width: 10 },
      {
        header: "Payment Status",
        key: "payment-status",
        width: 26,
      },
      {
        header: "Total (excl. GST)",
        key: "totalExclGST",
        width: 20,
      },
      {
        header: "GST applied",
        key: "gstCost",
        width: 20,
      },
      {
        header: "Total (incl. GST)",
        key: "totalInclGST",
        width: 20,
      },
      {
        header: "Invoice Date",
        key: "invoiceDate",
        width: 28,
      },
      {
        header: "Due Date",
        key: "dueDate",
        width: 28,
      },
    ];

    // Get the first row of the worksheet
    const firstRow = worksheet.getRow(1);

    // Set the font style to bold for the first 7 columns
    firstRow.eachCell({ includeEmpty: true }, (cell) => {
      if (cell.col <= 7) {
        const font = cell.font || {};
        font.bold = true;
        cell.font = font;
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFC000" },
        };
      }
    });

    worksheet.getColumn(1).font = { bold: true };

    // Populate worksheet with data
    // const headerRow = worksheet.addRow([
    //   "Invoice No.",
    //   "Payment Status",
    //   "Total (excl. GST)",
    //   "GST applied.",
    //   "Total (incl. GST)",
    //   "Invoice Date",
    //   "Due Date",
    // ]);
    invoices.map(
      ({ id, invoiceNo, GSTTotal, TotalWithGST, dueDate, invoiceDate }) => {
        const values = [
          invoiceNo,
          "Payment Pending",
          TotalWithGST,
          GSTTotal,
          (parseFloat(TotalWithGST) + parseFloat(GSTTotal)).toFixed(2),
          convertDateToString(invoiceDate),
          convertDateToString(dueDate),
        ];

        worksheet.addRow(values);
      }
    );

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();

    // Create a Blob with the buffer data
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a temporary download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.xlsx";
    link.click();

    // Clean up temporary resources
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <button onClick={handleExport}>Export to Excel</button>
    </div>
  );
};

export default ExportDataToExcel;
