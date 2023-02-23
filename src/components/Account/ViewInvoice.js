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

export default function ViewInvoice() {
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

  useEffect(() => {
    if (!userUniqueID) {
      store.dispatch(actionCreators.fetchUserUniqueID(currentUser.email));
      console.log("userUniqueID: " + userUniqueID);
    }

    if (userUniqueID) {
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
            setFormData({ formData, ...getData });
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
    pri.document.write(content.innerHTML);
    pri.document.close();
    pri.focus();
    pri.print();
  };

  return (
    <div className="container mb-20 w-full md:w-76 lg:w-4/5 xl:w-76 2xl:w-76">
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
        </div>
      </div>
      <PDFExport ref={pdfExportComponent}>
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
                          <a href="mailto:john@example.com">john@example.com</a>
                        </div>
                      </div>
                      <div className="col invoice-details">
                        <h1 className="invoice-id">
                          INVOICE {formData.invoiceNo}
                        </h1>
                        <div className="date">
                          Date of Invoice: {formData.invoiceDate}
                        </div>
                        <div className="date">Due Date: {formData.dueDate}</div>
                      </div>
                    </div>
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th className="text-left">DESCRIPTION</th>
                          <th className="text-right">RATE</th>
                          <th className="text-right">QUANTITY</th>
                          <th className="text-right">TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.items.map(
                          ({ id, name, qty, total, gst, rate }) => (
                            <tr key={id}>
                              <td className="no">{id}</td>
                              <td className="text-left">
                                <h3>{name}</h3>
                              </td>
                              <td className="unit">{rate}</td>
                              <td className="qty">{qty}</td>
                              <td className="total">Rs. {total}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="2"></td>
                          <td colSpan="2">SUBTOTAL</td>
                          <td>{formData.TotalWithGST}</td>
                        </tr>
                        <tr>
                          <td colSpan="2"></td>
                          <td colSpan="2">TAX (GST)</td>
                          <td>Rs. {formData.GSTTotal}</td>
                        </tr>
                        <tr>
                          <td colSpan="2"></td>
                          <td colSpan="2">GRAND TOTAL</td>
                          <td>
                            Rs.
                            {Number(formData.TotalWithGST) +
                              Number(formData.GSTTotal)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                    <div className="thanks">Thank you!</div>
                    <div className="notices">
                      <div>NOTICE:</div>
                      <div className="notice">
                        A finance charge of 1.5% will be made on unpaid balances
                        after 30 days.
                      </div>
                    </div>
                  </main>
                  <footer>
                    Invoice was created on a computer and is valid without the
                    signature and seal.
                  </footer>
                </div>
                {/* <!--DO NOT DELETE THIS div. IT is responsible for showing footer always at the bottom--> */}
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </PDFExport>
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
