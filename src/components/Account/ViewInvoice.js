import React, { useState, useRef, useEffect } from "react";
import firebase from "firebase/compat/app";
import { addDoc, collection, Timestamp, FieldValue } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase";
import { useParams } from "react-router-dom";
import { Document, Page } from "react-pdf";

import "./ViewInvoice.css";

// import { useAuth, AuthProvider } from "../contexts/AuthContext";
import { getAuth, updateProfile } from "firebase/auth";

import "@progress/kendo-theme-material/dist/all.css";

import {
  Chart,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
  ChartSeriesLabels,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
} from "@progress/kendo-react-charts";
import "hammerjs";

import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { useAuth } from "../../contexts/AuthContext";
import { useSelector } from "react-redux";
import { store } from "../../state/store";
import { actionCreators } from "../../state";
import convertDateToString from "../convertDateToString";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import emailjs from "emailjs-com";
import { Backdrop, CircularProgress, Skeleton } from "@mui/material";
import CustomizedSnackbars from "../CustomizedSnackbars";
import LoaderType1 from "../LoaderType1";

export default function ViewInvoice() {
  function sendEmail(e) {
    // e.preventDefault();
    const {
      GSTTotal,
      dueDate,
      items,
      from,
      TotalWithGST,
      invoiceDate,
      invoiceNo,
      billing,
    } = formData;

    console.log(
      GSTTotal,
      " ",
      dueDate,
      " ",
      items,
      " ",
      from,
      " ",
      TotalWithGST,
      " ",
      invoiceDate,
      " ",
      invoiceNo,
      " ",
      billing
    );

    // const dataArray = ["Item 1", "Item 2", "Item 3"];

    function generateEmailContent(items) {
      let content = `<table border="1" style="font-size: 12pt;" summary="Invoice Table" width="100%" cellspacing="0" cellpadding="0">
      <thead>
          <tr style="background-color: rgb(222, 234, 246);">
              <td valign="bottom" width="8.24742268041237%" style="text-align: center;">
                  <p><span ><strong>Item#&nbsp;</strong></span></p>
              </td>
              <td valign="bottom" width="39.175257731958766%" style="width: 27.2072%; text-align: center;">
                  <p><span ><strong>Description&nbsp;</strong></span></p>
              </td>
              <td valign="bottom" width="15.463917525773196%" style="width: 17.7872%; text-align: center;">
                  <p><span ><strong>Rate&nbsp;</strong></span></p>
              </td>
              <td valign="bottom" width="6.185567010309279%" style="width: 13.6768%; text-align: center;">
                  <p><strong><span >Qty.&nbsp;</span></strong></p>
              </td>
              <td valign="bottom" width="15.463917525773196%" style="width: 14.8517%; text-align: center;">
                  <p><span className="fr-unprocessed text-12 text-base" ><strong>GST (%)</strong></span></p>
              </td>
              <td valign="bottom" width="15.463917525773196%" style="width: 26.7455%; text-align: center;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong><strong>Total&nbsp;</strong></strong></strong></span></span></p>
              </td>
          </tr>
      </thead>
      <tbody>
      ${items
        .map(
          (item, index) => `<tr>
        <td valign="top" width="6.185567010309279%">
            <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>${index}&nbsp;</strong></strong></span></span></p>
        </td>
        <td valign="top" width="8.24742268041237%" style="width: 27.2072%;">
            <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>${item.name}&nbsp;</strong></strong></span></span></p>
        </td>
        <td valign="top" width="39.175257731958766%" style="width: 17.7872%;">
            <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>${item.rate}&nbsp;</strong></strong></span></span></p>
        </td>
        <td valign="top" width="15.463917525773196%" style="width: 13.6768%;">
            <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>${item.qty}&nbsp;</strong></strong></span></span></p>
        </td>
        <td valign="top" width="15.463917525773196%" style="width: 14.8517%;">
            <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>${item.gst}&nbsp;</strong></strong></span></span></p>
        </td>
        <td valign="top" width="15.463917525773196%" style="width: 26.7455%;">
            <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>${item.total}&nbsp;</strong></strong></span></span></p>
        </td>
    </tr>`
        )
        .join("")}
           <td valign="top" width="6.185567010309279%">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="8.24742268041237%" style="width: 27.2072%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="39.175257731958766%" style="width: 17.7872%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="15.463917525773196%" style="width: 13.6768%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="15.463917525773196%" style="width: 14.8517%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="15.463917525773196%" style="width: 26.7455%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
          </tr>
          <tr>
              <td valign="top" width="6.185567010309279%">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="8.24742268041237%" style="width: 27.2072%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="39.175257731958766%" style="width: 17.7872%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="15.463917525773196%" style="width: 13.6768%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="15.463917525773196%" style="width: 14.8517%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>Total Discount&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="15.463917525773196%" style="width: 26.7455%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>0&nbsp;</strong></strong></span></span></p>
              </td>
          </tr>
          <tr>
              <td valign="top" width="6.185567010309279%">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="8.24742268041237%" style="width: 27.2072%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="39.175257731958766%" style="width: 17.7872%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="15.463917525773196%" style="width: 13.6768%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="15.463917525773196%" style="width: 14.8517%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>Subtotal&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="15.463917525773196%" style="width: 26.7455%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>${TotalWithGST}</strong></strong></span></span></p>
              </td>
          </tr>
          <tr>
              <td valign="top" width="6.185567010309279%">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="8.24742268041237%" style="width: 27.2072%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="39.175257731958766%" style="width: 17.7872%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="15.463917525773196%" style="width: 13.6768%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="15.463917525773196%" style="width: 14.8517%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>Sales Tax&nbsp;</strong></strong></span></span></p>
              </td>
              <td valign="top" width="15.463917525773196%" style="width: 26.7455%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>${GSTTotal}</strong></strong></span></span></p>
              </td>
          </tr>
          <tr style="background-color: rgba(156,194,229,255);">
              <td valign="top" width="6.185567010309279%">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong><strong>&nbsp;</strong></strong></strong></span></span></p>
              </td>
              <td valign="top" width="8.24742268041237%" style="width: 27.2072%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong><strong>&nbsp;</strong></strong></strong></span></span></p>
              </td>
              <td valign="top" width="39.175257731958766%" style="width: 17.7872%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong><strong>&nbsp;</strong></strong></strong></span></span></p>
              </td>
              <td valign="top" width="15.463917525773196%" style="width: 13.6768%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong><strong>&nbsp;</strong></strong></strong></span></span></p>
              </td>
              <td valign="top" width="15.463917525773196%" style="width: 14.8517%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong><strong>Total&nbsp;</strong></strong></strong></span></span></p>
              </td>
              <td valign="top" width="15.463917525773196%" style="width: 26.7455%;">
                  <p><span ><span className="fr-unprocessed text-12 text-base" ><strong><strong>${parseFloat(
                    parseFloat(TotalWithGST) + parseFloat(GSTTotal)
                  ).toFixed(
                    2
                  )}</strong></strong></span></span></p></td></tr></tbody></table>
`;
      return content;
    }

    emailjs
      .send({
        invoiceHeadingNo: invoiceNo.toString(),
        InvoiceDate: invoiceDate.toString(),
        invoiceNumber: invoiceNo,
        message: generateEmailContent(items),
        GSTTotal: GSTTotal,
        dueDate: dueDate,
        items: items,
        from: from,
        TotalWithGST: TotalWithGST,
        billName: billing.name,
        billAddress: billing.address,
        billExtra: billing.extra,
        fromName: from.name,
        fromAddress: from.address,
        fromExtra: from.extra,
      })

      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  }

  function SendPDFButton() {
    return (
      <button onClick={(formdata) => sendEmail(formData)}>Send PDF</button>
    );
  }

  // ------------------------------------------
  const ddData = [
    { text: "A4", value: "size-a4" },
    { text: "Letter", value: "size-letter" },
    { text: "Executive", value: "size-executive" },
  ];

  const [layoutSelection, setLayoutSelection] = useState({
    text: "A4",
    value: "size-a4",
  });

  const updatePageLayout = (event) => {
    setLayoutSelection(event.target.value);
  };

  const pdfExportComponent = useRef(null);

  const handleExportWithComponent = (event) => {
    pdfExportComponent.current.save();
  };
  // ---------------------------------------------
  let { id } = useParams();
  const { currentUser } = useAuth();
  const userUniqueID = useSelector((state) => state.userUniqueID);

  const [formData, setFormData] = useState({
    GSTTotal: "",
    TotalWithGST: "",
    billing: "",
    address: "",
    dueDate: "",
    from: "",
    invoiceDate: "",
    invoiceNo: "",
    items: [],
  });

  const [toastMessage, setToastMessageInfo] = useState(null);

  const [openLoader, setOpenLoader] = useState(false);
  const handleCloseLoader = () => {
    setOpenLoader(false);
  };
  const handleOpenLoader = () => {
    setOpenLoader(true);
  };

  useEffect(() => {
    if (!userUniqueID) {
      handleOpenLoader();
      store.dispatch(actionCreators.fetchUserUniqueID(currentUser.email));
      console.log("userUniqueID: " + userUniqueID);
    }

    if (userUniqueID) {
      handleOpenLoader();
      const invoicesRef = db.collection("invoices");
      const invoiceRef = invoicesRef.doc(userUniqueID);
      const dataRef = invoiceRef.collection("invoicesList");
      dataRef
        .doc(id)
        .get()
        .then(function (doc) {
          if (doc.exists) {
            console.log(doc.data());
            let getData = doc.data();
            let data = getData.invoiceDate;
            getData.invoiceDate = convertDateToString(data);
            data = getData.dueDate;
            getData.dueDate = convertDateToString(data);
            console.log(getData);
            setFormData({
              formData,
              ...getData,
            });
            setToastMessageInfo({
              message: "Data has been fetched successfully.",
              category: "SUCCESS",
              time: new Date().getUTCSeconds(),
            });
            handleCloseLoader();
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch(function (error) {
          console.log("Error getting document:", error);
        });
    }
    ///getting current user collection Id from FIrestore
    // db.collection("invoices")
    //   .where("userName", "==", currentUser.email)
    //   .get()
    //   .then(function (querySnapshot) {
    //     querySnapshot.forEach(function (doc) {
    //       console.log("Document data:", doc.id);
    //       setCurrentUserId(doc.id);
    //       // ---------------
    //       // setProfile({
    //       //   ...profile,
    //       //   emailAddress: currentUser.email,
    //       //   sellerName: currentUser.displayName,
    //       //   ...doc.data(),
    //       // });
    //       const invoicesRef = db.collection("invoices");
    //       const invoiceRef = invoicesRef.doc(doc.id);
    //       const dataRef = invoiceRef.collection("invoicesList");
    //       dataRef
    //         .doc(id)
    //         .get()
    //         .then(function (doc) {
    //           if (doc.exists) {
    //             // console.log(doc.data());
    //             let getData = doc.data();
    //             // console.log(getData);
    //             setFormData({ formData, ...getData });
    //           } else {
    //             // doc.data() will be undefined in this case
    //             console.log("No such document!");
    //           }
    //         })
    //         .catch(function (error) {
    //           console.log("Error getting document:", error);
    //         });
    //     });
    //   })
    //   .catch(function (error) {
    //     console.log("Error getting documents: ", error);
    //   });
    /////////----------------------------
  }, [userUniqueID]);

  const fetchedImgSrc = formData.image;

  const printInv = () => {
    var content = document.getElementsByClassName("invoiceDiv");
    var pri = document.getElementById("invoiceDiv").contentWindow;
    pri.document.open();
    pri.document.write(
      '<html><head><style>@media print { .page { size: 1100px 710px; } }</style></head><body><div className="page">'
    );
    pri.document.write(content.innerHTML);
    pri.document.write("</div></body></html>");
    pri.document.close();
    pri.focus();
    pri.print();
  };

  return (
    <div className="container mb-20 w-full md:w-76 lg:w-4/5 xl:w-76 2xl:w-76">
      <CustomizedSnackbars {...toastMessage} />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div id="example">
        <div className="box wide hidden-on-narrow">
          <div className="box-col">
            <h4>Select a Page Size</h4>
            <DropDownList
              data={ddData}
              textField="text"
              dataItemKey="value"
              value={layoutSelection}
              onChange={updatePageLayout}
            />
          </div>
        </div>

        <div className="toolbar hidden-print">
          <button type="button" className="btn btn-dark" onClick={printInv}>
            <i className="fa fa-print"></i> Print
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleExportWithComponent}
          >
            <i className="fa fa-file-pdf-o"></i> Export as PDF
          </button>
          <hr />
          <SendPDFButton />
        </div>
      </div>
      {openLoader ? (
        <LoaderSkeleton />
      ) : (
        <PDFExport ref={pdfExportComponent} paperSize="A2">
          <div className="card invoiceDiv">
            <div className="card-body">
              <div id="invoice">
                <div className="invoice overflow-auto">
                  <div style={{ minWidth: "min-content" }}>
                    <header>
                      <div className="row">
                        <div className="col">
                          <a href="#">
                            <img
                              src="assets/images/logo-icon.png"
                              width="80"
                              alt=""
                            />
                          </a>
                        </div>
                        <div className="col company-details">
                          <h2 className="name">
                            <a target="_blank">{formData.from.name}</a>
                          </h2>
                          <div>
                            {formData.from.address + " " + formData.from.extra}
                          </div>
                          <div>(123) 456-789</div>
                          <div>company@example.com</div>
                        </div>
                      </div>
                    </header>
                    <main>
                      <div className="row contacts">
                        <div className="col invoice-to">
                          <div className="text-gray-light">INVOICE TO:</div>
                          <h2 className="to">{formData.billing.name}</h2>
                          <div className="address">
                            {formData.billing.address +
                              " " +
                              formData.billing.extra}
                          </div>
                          <div className="email">
                            <a href="mailto:john@example.com">
                              john@example.com
                            </a>
                          </div>
                        </div>
                        <div className="col invoice-details">
                          <h1 className="invoice-id">
                            INVOICE {formData.invoiceNo}
                          </h1>
                          <div className="date">
                            <strong>Date of Invoice:</strong>
                            {formData.invoiceDate}
                          </div>
                          <div className="date">
                            <strong>Due Date: </strong>
                            {formData.dueDate}
                          </div>
                        </div>
                      </div>
                      <table>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th className="text-left">DESCRIPTION</th>
                            <th className="text-right">RATE</th>
                            <th className="text-right">QUANTITY</th>
                            <th className="text-right">GST(%)</th>
                            <th className="text-right">TOTAL</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.items.map(
                            ({ id, name, qty, total, gst, rate }) => (
                              <tr key={id}>
                                <td className="no">{id + 1}</td>
                                <td className="text-left">
                                  <h3>{name}</h3>
                                </td>
                                <td className="unit">{rate}</td>
                                <td className="qty">{qty}</td>
                                <td className="qty">
                                  {parseFloat(gst).toFixed(1)}%
                                </td>
                                <td className="total">Rs. {total}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan="3"></td>
                            <td colSpan="2">SUBTOTAL</td>
                            <td> Rs. {formData.TotalWithGST}</td>
                          </tr>
                          <tr>
                            <td colSpan="3"></td>
                            <td colSpan="2">TAX (GST)</td>
                            <td>Rs. {formData.GSTTotal}</td>
                          </tr>
                          <tr>
                            <td colSpan="3"></td>
                            <td colSpan="2">GRAND TOTAL</td>
                            <td>
                              Rs.{" "}
                              {Number(formData.TotalWithGST) +
                                Number(formData.GSTTotal)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                      <div className="thanks">Thank you!</div>
                      <div className="text-right">
                        <div className="text-center signature inline-block whitespace-no-wrap">
                          {/* <img
                          data-savepage-src="../../../app-assets/images/pages/signature-scan.png"
                          src="data:image/png;base64,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"
                          alt="signature"
                          className="height-100"
                        /> */}
                          <div>
                            <div className="border bottom-2 border-gray-900 h-16"></div>
                            <p className="text-lg font-bold">
                              Authorized Signatory
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="notices">
                        <div>NOTICE:</div>
                        <div className="notice">
                          A finance charge of 1.5% will be made on unpaid
                          balances after 30 days.
                        </div>
                      </div>
                    </main>
                    <footer>
                      Invoice was created on a computer and is not valid without
                      the signature and seal.
                    </footer>
                  </div>
                  {/* <!--DO NOT DELETE THIS div. IT is responsible for showing footer always at the bottom--> */}
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </PDFExport>
      )}
    </div>
    // <div id="js-print-template" x-ref="printTemplate" className="">
    //   <div className="mb-8 flex justify-between">
    //     <div>
    //       <h2 className="text-3xl font-bold mb-6 pb-2 tracking-wider uppercase">
    //         Invoice
    //       </h2>

    //       <div className="mb-1 flex items-center">
    //         <label className="w-32 text-gray-800 block font-bold text-xs uppercase tracking-wide">
    //           Invoice No.
    //         </label>
    //         <span className="mr-4 inline-block">:</span>
    //         <div x-text="invoiceNumber"></div>
    //       </div>

    //       <div className="mb-1 flex items-center">
    //         <label className="w-32 text-gray-800 block font-bold text-xs uppercase tracking-wide">
    //           Invoice Date
    //         </label>
    //         <span className="mr-4 inline-block">:</span>
    //         <div x-text="invoiceDate"></div>
    //       </div>

    //       <div className="mb-1 flex items-center">
    //         <label className="w-32 text-gray-800 block font-bold text-xs uppercase tracking-wide">
    //           Due date
    //         </label>
    //         <span className="mr-4 inline-block">:</span>
    //         <div x-text="invoiceDueDate"></div>
    //       </div>
    //     </div>
    //     <div className="pr-5">
    //       <div className="w-32 h-32 mb-1 overflow-hidden">
    //         <img id="image2" className="object-cover w-20 h-20" />
    //       </div>
    //     </div>
    //   </div>

    //   <div className="flex justify-between mb-10">
    //     <div className="w-1/2">
    //       <label className="text-gray-800 block mb-2 font-bold text-xs uppercase tracking-wide">
    //         Bill/Ship To:
    //       </label>
    //       <div>
    //         <div x-text="billing.name"></div>
    //         <div x-text="billing.address"></div>
    //         <div x-text="billing.extra"></div>
    //       </div>
    //     </div>
    //     <div className="w-1/2">
    //       <label className="text-gray-800 block mb-2 font-bold text-xs uppercase tracking-wide">
    //         From:
    //       </label>
    //       <div>
    //         <div x-text="from.name"></div>
    //         <div x-text="from.address"></div>
    //         <div x-text="from.extra"></div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="flex flex-wrap -mx-1 border-b py-2 items-start">
    //     <div className="flex-1 px-1">
    //       <p className="text-gray-600 uppercase tracking-wide text-xs font-bold">
    //         Description
    //       </p>
    //     </div>

    //     <div className="px-1 w-32 text-right">
    //       <p className="text-gray-600 uppercase tracking-wide text-xs font-bold">
    //         Units
    //       </p>
    //     </div>

    //     <div className="px-1 w-32 text-right">
    //       <p className="leading-none">
    //         <span className="block uppercase tracking-wide text-xs font-bold text-gray-600">
    //           Unit Price
    //         </span>
    //         <span className="font-medium text-xs text-gray-500">
    //           (Incl. GST)
    //         </span>
    //       </p>
    //     </div>

    //     <div className="px-1 w-32 text-right">
    //       <p className="leading-none">
    //         <span className="block uppercase tracking-wide text-xs font-bold text-gray-600">
    //           Amount
    //         </span>
    //         <span className="font-medium text-xs text-gray-500">
    //           (Incl. GST)
    //         </span>
    //       </p>
    //     </div>
    //   </div>
    //   <template
    //     x-for="invoice in items"
    //     // :key="invoice.id"
    //   >
    //     <div className="flex flex-wrap -mx-1 py-2 border-b">
    //       <div className="flex-1 px-1">
    //         <p className="text-gray-800" x-text="invoice.name"></p>
    //       </div>

    //       <div className="px-1 w-32 text-right">
    //         <p className="text-gray-800" x-text="invoice.qty"></p>
    //       </div>

    //       <div className="px-1 w-32 text-right">
    //         <p
    //           className="text-gray-800"
    //           x-text="numberFormat(invoice.rate)"
    //         ></p>
    //       </div>

    //       <div className="px-1 w-32 text-right">
    //         <p
    //           className="text-gray-800"
    //           x-text="numberFormat(invoice.total)"
    //         ></p>
    //       </div>
    //     </div>
    //   </template>

    //   <div className="py-2 ml-auto mt-20" style={{ width: "320px" }}>
    //     <div className="flex justify-between mb-3">
    //       <div className="text-gray-800 text-right flex-1">Total incl. GST</div>
    //       <div className="text-right w-40">
    //         <div className="text-gray-800 font-medium" x-html="netTotal"></div>
    //       </div>
    //     </div>
    //     <div className="flex justify-between mb-4">
    //       <div className="text-sm text-gray-600 text-right flex-1">
    //         GST(18%) incl. in Total
    //       </div>
    //       <div className="text-right w-40">
    //         <div className="text-sm text-gray-600" x-html="totalGST"></div>
    //       </div>
    //     </div>

    //     <div className="py-2 border-t border-b">
    //       <div className="flex justify-between">
    //         <div className="text-xl text-gray-600 text-right flex-1">
    //           Amount due
    //         </div>
    //         <div className="text-right w-40">
    //           <div
    //             className="text-xl text-gray-800 font-bold"
    //             x-html="netTotal"
    //           ></div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

function LoaderSkeleton() {
  return (
    <div className="card invoiceDiv">
      <div className="card-body">
        <div id="invoice">
          <div className="invoice overflow-auto">
            <div style={{ minWidth: "600px" }}>
              <header>
                <div className="row">
                  <div className="col">
                    <a href="#">
                      <img
                        src="assets/images/logo-icon.png"
                        width="80"
                        alt=""
                      />
                    </a>
                  </div>
                  <div className="col company-details">
                    <h2 className="name">
                      <a target="_blank">
                        <Skeleton animation="wave" />
                      </a>
                    </h2>
                    <div>
                      <Skeleton animation="wave" />
                    </div>
                    <div>
                      <Skeleton animation="wave" />
                    </div>
                    <div>
                      <Skeleton animation="wave" />
                    </div>
                  </div>
                </div>
              </header>
              <main>
                <div className="row contacts">
                  <div className="col invoice-to">
                    <div className="text-gray-light">
                      <Skeleton animation="wave" />
                    </div>
                    <h2 className="to">
                      <Skeleton animation="wave" />
                    </h2>
                    <div className="address">
                      <Skeleton animation="wave" />
                    </div>
                    <div className="email">
                      <a>
                        <Skeleton animation="wave" />
                      </a>
                    </div>
                  </div>
                  <div className="col invoice-details">
                    <h1 className="invoice-id">
                      <Skeleton animation="wave" />
                    </h1>
                    <div className="date">
                      <strong>
                        <Skeleton animation="wave" />
                      </strong>
                      <Skeleton animation="wave" />
                    </div>
                    <div className="date">
                      <strong>
                        <Skeleton animation="wave" />{" "}
                      </strong>
                      <Skeleton animation="wave" />
                    </div>
                  </div>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>
                        <Skeleton animation="wave" />
                      </th>
                      <th className="text-left">
                        <Skeleton animation="wave" />
                      </th>
                      <th className="text-right">
                        <Skeleton animation="wave" />
                      </th>
                      <th className="text-right">
                        <Skeleton animation="wave" />
                      </th>
                      <th className="text-right">
                        <Skeleton animation="wave" />
                      </th>
                      <th className="text-right">
                        <Skeleton animation="wave" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="no">
                        <Skeleton animation="wave" />
                      </td>
                      <td className="text-left">
                        <h3>
                          <Skeleton animation="wave" />
                        </h3>
                      </td>
                      <td className="unit">
                        <Skeleton animation="wave" />
                      </td>
                      <td className="qty">
                        <Skeleton animation="wave" />
                      </td>
                      <td className="qty">
                        <Skeleton animation="wave" />
                      </td>
                      <td className="total">
                        <Skeleton animation="wave" />
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="3"></td>
                      <td colSpan="2">
                        <Skeleton animation="wave" />
                      </td>
                      <td>
                        <Skeleton animation="wave" />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3"></td>
                      <td colSpan="2">
                        <Skeleton animation="wave" />
                      </td>
                      <td>
                        <Skeleton animation="wave" />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3"></td>
                      <td colSpan="2">
                        <Skeleton animation="wave" />
                      </td>
                      <td>
                        <Skeleton animation="wave" />
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <div className="thanks">
                  <Skeleton animation="wave" />
                </div>
                <div className="text-right">
                  <div className="text-center signature inline-block whitespace-no-wrap">
                    <div>
                      <div className="border bottom-2 border-gray-900 h-16"></div>
                      <p className="text-lg font-bold">
                        <Skeleton animation="wave" width={210} height={90} />
                      </p>
                    </div>
                  </div>
                </div>
                <div className="notices">
                  <div>
                    <Skeleton animation="wave" />
                  </div>
                  <div className="notice">
                    <Skeleton animation="wave" />
                  </div>
                </div>
              </main>
              <footer>
                <Skeleton animation="wave" />
              </footer>
            </div>
            {/* <!--DO NOT DELETE THIS div. IT is responsible for showing footer always at the bottom--> */}
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
