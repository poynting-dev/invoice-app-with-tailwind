import React, { useEffect, useState } from "react";
import {
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

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [tooltipStatus, setTooltipStatus] = useState(0);

  const { currentUser } = useAuth();

  useEffect(() => {
    const DBRef = collection(db, "invoices");
    const queryInvoices = query(
      DBRef,
      where("userName", "==", currentUser.email)
    );
    onSnapshot(queryInvoices, (snapshot) => {
      snapshot.docs.map((doc) => {
        const invoiceRef = collection(
          db,
          "invoices/5eEacX2iOIJAzpJYBRtv/invoicesList"
        );
        const queryInvoicesList = query(invoiceRef);
        onSnapshot(queryInvoicesList, (snapshot) => {
          const invoices = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setInvoices(invoices);
          console.log(invoices);
        });

        // console.log("Posts:" + JSON.stringify(invoices));
      });
    });

    // db.collection("invoices")
    //   .doc("5eEacX2iOIJAzpJYBRtv")
    //   .collection("invoicesList")
    //   .doc("Dqsdrmo8T0qevnGoTIFK")
    //   .get()
    //   .then(function (doc) {
    //     if (doc.exists) {
    //       // console.log(doc.data());
    //       let getData = doc.data();
    //       console.log(getData);
    //     } else {
    //       // doc.data() will be undefined in this case
    //       console.log("No such document!");
    //     }
    //   })
    //   .catch(function (error) {
    //     console.log("Error getting document:", error);
    //   });

    // const queryInvoices1 = query(invoiceRef1);
    // onSnapshot(queryInvoices1, (snapshot) => {
    //   const invoices = snapshot.docs.map((doc) => ({
    //     id: doc.id,
    //     ...doc.data(),
    //   }));
    //   // setInvoices(invoices);
    //   console.log(invoices);
    //   // console.log("Posts:" + JSON.stringify(invoices));
    // });
  }, []);

  const moveData = () => {
    console.log(invoices);
    var newTableRef = db
      .collection("invoices")
      .doc("5eEacX2iOIJAzpJYBRtv")
      .collection("invoicesList");

    var batch = db.batch();

    invoices.forEach((doc) => {
      batch.set(newTableRef.doc(), doc);
    });
    // Commit the batch
    const result = batch.commit();
    console.log(result);

    console.log(currentUser);
  };

  return (
    <div className="font-sans p-5 pt-0 h-full bg-gray-100">
      <div className="md:flex md:justify-between">
        <ComposeButton />
        <h1 className="text-3xl mb-2 items-end flex place-content-center">
          Your orders
        </h1>
      </div>

      <div className="rounded-lg shadow hidden md:block">
        <table className="w-full  relative">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                No.
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Total (excl. GST)
              </th>
              <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                GST. Incl.
              </th>
              <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                Date
              </th>
              <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                Total
              </th>
              <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 ">
            {invoices.length === 0 ? (
              <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                No Invoices
              </td>
            ) : (
              invoices.map(
                ({
                  id,
                  invoiceNo,
                  GSTTotal,
                  TotalWithGST,
                  dueDate,
                  invoiceDate,
                }) => (
                  <tr className="bg-white " key={id}>
                    <td
                      className="p-3 text-sm text-gray-700 whitespace-nowrap"
                      onMouseEnter={() => setTooltipStatus(id)}
                      onMouseLeave={() => setTooltipStatus(0)}
                    >
                      <a
                        href={`/view/${id}`}
                        className="font-bold text-blue-500 hover:underline"
                      >
                        {invoiceNo ? invoiceNo : "No ID Exist"}
                      </a>

                      {/*Code Block for indigo tooltip starts*/}
                      <div className="relative my-28 md:my-0 ">
                        {tooltipStatus == id && (
                          <div
                            role="tooltip"
                            className="z-20 -mt-20 w-78 absolute transition duration-150 ease-in-out left-0 ml-24 shadow-lg bg-indigo-700 p-4 rounded"
                          >
                            <svg
                              className="absolute left-0 -ml-2 bottom-0 top-0 h-full"
                              width="9px"
                              height="16px"
                              viewBox="0 0 9 16"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                              xmlnsXlink="http://www.w3.org/1999/xlink"
                            >
                              <g
                                id="Page-1"
                                stroke="none"
                                strokeWidth={1}
                                fill="none"
                                fillRule="evenodd"
                              >
                                <g
                                  id="Tooltips-"
                                  transform="translate(-874.000000, -1029.000000)"
                                  fill="#4c51bf"
                                >
                                  <g
                                    id="Group-3-Copy-16"
                                    transform="translate(850.000000, 975.000000)"
                                  >
                                    <g
                                      id="Group-2"
                                      transform="translate(24.000000, 0.000000)"
                                    >
                                      <polygon
                                        id="Triangle"
                                        transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
                                        points="4.5 57.5 12.5 66.5 -3.5 66.5"
                                      />
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </svg>
                            <p className="text-sm font-bold text-white pb-1">
                              Keep track of follow ups
                            </p>
                            <p className="text-xs leading-4 text-white pb-3">
                              Reach out to more prospects at the right moment.
                            </p>
                            <div className="flex justify-between">
                              <div className="flex items-center">
                                <span className="text-xs font-bold text-white">
                                  Step 1 of 4
                                </span>
                              </div>
                              <div className="flex items-center">
                                <button className="bg-white transition duration-150 ease-in-out focus:outline-none hover:bg-gray-200 rounded text-indigo-700 px-5 py-1 text-xs">
                                  Next
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/*Code Block for indigo tooltip ends*/}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {TotalWithGST}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {GSTTotal}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {invoiceDate}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {dueDate}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <span className="p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
                        Delivered
                      </span>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {invoices.length === 0 ? (
        <div className="p-3 text-sm text-gray-700 whitespace-nowrap ">
          <div class="border border-blue-300 shadow rounded-md p-4 mx-auto">
            <div class="animate-pulse flex space-x-4">
              <div class="rounded-full bg-slate-700 h-10 w-10"></div>
              <div class="flex-1 space-y-6 py-1">
                <div class="h-2 bg-slate-700 rounded"></div>
                <div class="space-y-3">
                  <div class="grid grid-cols-3 gap-4">
                    <div class="h-2 bg-slate-700 rounded col-span-2"></div>
                    <div class="h-2 bg-slate-700 rounded col-span-1"></div>
                  </div>
                  <div class="h-2 bg-slate-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        invoices.map(
          ({ id, invoiceNo, GSTTotal, TotalWithGST, dueDate, invoiceDate }) => (
            <div
              className="grid grid-cols-1 mb-8 md:hidden group rounded-lg ring-slate-900/5 shadow-lg hover:bg-sky-500 hover:ring-sky-500 transition hover:duration-300"
              key={id}
            >
              <div className="space-y-3 p-4 rounded-lg shadow">
                <div className="flex items-center space-x-2 text-sm">
                  <div>
                    <a
                      href={`/view/${id}`}
                      className="font-bold text-blue-500 hover:underline group-hover:text-white"
                    >
                      {invoiceNo ? invoiceNo : "No ID Exist"}
                    </a>
                  </div>
                  <div className="text-sm font-semibold ">{invoiceDate}</div>
                  <div>
                    <span className="group-hover:text-white p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
                      Delivered
                    </span>
                  </div>
                </div>
                <div className="group-hover:text-white text-sm text-gray-700">
                  Kring New Fit office chair, mesh + PU, black
                </div>
                <div className="group-hover:text-white text-sm font-medium text-black">
                  Total Amount: ₹{Number(TotalWithGST) + Number(GSTTotal)}
                </div>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
}

const ComposeButton = () => {
  return (
    <a
      href="/compose"
      class="relative inline-flex items-center justify-start py-3 pl-4 pr-12 mb-2 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group"
    >
      <span class="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
      <span class="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
        <svg
          class="w-5 h-5 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          ></path>
        </svg>
      </span>
      <span class="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
        <svg
          class="w-5 h-5 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          ></path>
        </svg>
      </span>
      <span class="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
        Compose New Invoice
      </span>
    </a>
  );
};
