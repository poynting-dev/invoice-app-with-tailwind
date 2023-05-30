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
import ExportDataToExcel from "./ExportDataToExcel";

const PAGE_SIZE = 5;

const SERVER_OPTIONS = {
  useCursorPagination: true,
};

// const { columns, initialState, useQuery } = createFakeServer(
//   {},
//   SERVER_OPTIONS
// );

function InvoiceList() {
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
    console.log(anchorEl);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  // ---------------Material UI Pagination
  const columns = [
    {
      field: "invoiceNo",
      headerName: "Invoice No",
      minWidth: 100,
      maxWidth: 100,
      renderCell: (params) => {
        const linkValue = params.row.id;
        return (
          <Typography
            aria-owns={open ? "mouse-over-popover" : undefined}
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            // onMouseEnter={() => {
            //   setTooltipStatus(linkValue), console.log(linkValue);
            // }}
            // onMouseLeave={() => setTooltipStatus(0)}
          >
            <Link
              to={`/view/${linkValue}`}
              className="font-bold text-blue-500 hover:underline group-hover:text-white"
              // onMouseEnter={() => {
              //   setTooltipStatus(linkValue), console.log(linkValue);
              // }}
              // onMouseLeave={() => setTooltipStatus(0)}
            >
              {params.row.invoiceNo}
            </Link>
            {/*Code Block for indigo tooltip starts*/}

            {/* <Popover
              id="mouse-over-popover"
              sx={{
                pointerEvents: "none",
              }}
              open={open}
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              onClose={handlePopoverClose}
              anchorPosition={anchorEl}
              disableRestoreFocus
            >
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
            </Popover> */}
            {/*Code Block for indigo tooltip ends*/}
          </Typography>
        );
      },
      flex: 1,
    },
    {
      field: "Status",
      headerName: "Status",
      minWidth: 135,
      flex: 1,
      renderCell: (params) => {
        const linkValue = params.row.id;
        return (
          <div>
            <span className="group-hover:text-white p-1.5 text-xs font-medium uppercase tracking-wider text-yellow-800 bg-yellow-200 rounded-lg bg-opacity-50">
              Payment Pending
            </span>

            {/* <span className="group-hover:text-white p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
              Delivered
            </span> */}
          </div>
        );
      },
    },
    {
      field: "TotalWithGST",
      headerName: "Total (excl. GST)",
      minWidth: 125,
      flex: 1,
    },
    {
      field: "GSTTotal",
      headerName: "GST. Incl.	",
      minWidth: 125,
      flex: 1,
    },
    {
      field: "Total (incl. GST)",
      headerName: "Total (incl. GST)",
      minWidth: 125,
      renderCell: (params) => (
        <span>
          Rs. {Number(params.row.TotalWithGST) + Number(params.row.GSTTotal)}
        </span>
      ),
      flex: 1,
    },
    {
      field: "invoiceDate",
      headerName: "Invoice Date",
      minWidth: 250,
      flex: 1,
      renderCell: (params) => convertDateToString(params.row.invoiceDate),
    },
    {
      field: "dueDate",
      headerName: "Due Date",
      minWidth: 250,
      flex: 1,
      renderCell: (params) => convertDateToString(params.row.dueDate),
    },
  ];
  const mapPageToNextCursor = useRef({});

  const [page, setPage] = useState(0);

  const queryOptions = useMemo(
    () => ({
      cursor: mapPageToNextCursor.current[page - 1],
      pageSize: PAGE_SIZE,
    }),
    [page]
  );

  // const { isLoading, data, pageInfo } = useQuery(queryOptions);

  // const handlePageChange = (newPage) => {
  //   // We have the cursor, we can allow the page transition.
  //   if (newPage === 0 || mapPageToNextCursor.current[newPage - 1]) {
  //     setPage(newPage);
  //   }
  // };

  // useEffect(() => {
  //   if (!isLoading && pageInfo?.nextCursor) {
  //     // We add nextCursor when available
  //     mapPageToNextCursor.current[page] = pageInfo?.nextCursor;
  //   }
  // }, [page, isLoading, pageInfo?.nextCursor]);

  // // Some API clients return undefined while loading
  // // Following lines are here to prevent `rowCountState` from being undefined during the loading
  // const [rowCountState, setRowCountState] = useState(
  //   pageInfo?.totalRowCount || 0
  // );

  // useEffect(() => {
  //   setRowCountState((prevRowCountState) =>
  //     pageInfo?.totalRowCount !== undefined
  //       ? pageInfo?.totalRowCount
  //       : prevRowCountState
  //   );
  // }, [pageInfo?.totalRowCount, setRowCountState]);
  // ---------------Material UI Pagination

  const dispatch = useDispatch();
  const [invoices, setInvoices] = useState([]);
  const [tooltipStatus, setTooltipStatus] = useState(0);

  const { currentUser } = useAuth();
  // const [userUniqueID, setID] = useState("");

  function createUserCollection(email) {
    const invoicesRef = db.collection("invoices");
    const query = invoicesRef.where("emailAddress", "==", email).limit(1);
    query.get().then((snapshot) => {
      if (snapshot.docs.length > 0) {
      } else {
        // Create a new invoice document
        const newInvoice = {
          emailAddress: email,
          userName: email,
          // invoicesList: [],
        };
        invoicesRef.add(newInvoice);
      }
    });
  }

  const userUniqueID = useSelector((state) => state.userUniqueID);
  // const [userUniqueID, setUserUniqueID] = useState(store.getState.userUniqueID);

  useEffect(() => {
    // fetchUserUniqueID(currentUser.email);
    if (!userUniqueID) {
      setLoaderStatus(1);
      store.dispatch(actionCreators.fetchUserUniqueID(currentUser.email));
      setLoaderStatus(0);
      console.log("userUniqueID: " + userUniqueID);
    }
    // setUniqueUserID("qYAhBXVsV3yQCWShsUHd");
    // store.dispatch(actionCreators.fetchUserUniqueID(currentUser.email));
    // actionCreators.mapDispatchToProps.setUniqueUserID("qYAhBXVsV3yQCWShsUHd");
    // if (userUniqueID == null) {
    //   dispatch(actionCreators.setUniqueUserID("55"));
    //   console.log("called");
    // }
    // console.log(actionCreators.setUniqueUserID("55"));

    // store.dispatch(setUniqueUserID("qYAhBXVsV3yQCWShsUHd"));
  }, [userUniqueID]);

  useEffect(() => {
    setLoaderStatus(1);
    createUserCollection(currentUser.email);

    // db.collection("invoices")
    //   .where("userName", "==", currentUser.email)
    //   .get()
    //   .then(function (querySnapshot) {
    //     querySnapshot.forEach(function (doc) {
    //       setID(doc.id);
    //     });
    //   })
    //   .catch(function (error) {
    //     console.log("Error getting documents: ", error);
    //   })
    //   .then(() => {
    //     console.log(userUniqueID);
    //   });

    const DBRef = collection(db, "invoices");
    const queryInvoices = query(
      DBRef,
      where("userName", "==", currentUser.email)
    );
    onSnapshot(queryInvoices, (snapshot) => {
      // --------------

      const now = new Date();
      const istTime = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      const istDate = new Date(istTime);
      const istTimestamp = Timestamp.fromDate(istDate);
      console.log("Time:-" + istTimestamp.toDate().toDateString());
      // var invoicesRef = db
      //   .collection("invoices")
      //   .doc("5eEacX2iOIJAzpJYBRtv")
      //   .collection("invoicesList");

      // invoicesRef.onSnapshot(function (snapshot) {
      //   snapshot.forEach(function (doc) {
      //     // console.log(doc.id);
      //     // console.log(doc.data());
      //     var tmp = [{ ...doc.data(), id: doc.id }];
      //     console.log(tmp);
      //     setInvoices((prevInvoices) => [...prevInvoices, tmp]);
      //   });
      // });

      //-----------------

      snapshot.docs.map((doc) => {
        const invoiceRef = collection(
          db,
          `invoices/${userUniqueID}/invoicesList`
        );

        const queryInvoicesList = query(
          invoiceRef,
          orderBy("invoiceDate", "desc") // sort by invoiceDate in descending order
        );

        onSnapshot(queryInvoicesList, (snapshot) => {
          const invoices = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          setInvoices(invoices);
          console.log(invoices);
          setToastMessageInfo({
            message: "Data has been fetched successfully.",
            category: "SUCCESS",
            time: new Date().getUTCSeconds(),
          });
          setLoaderStatus(0);
        });

        // console.log("Posts:" + JSON.stringify(invoices));
      });
    });

    // db.collection("invoices")
    //   .doc("5eEacX2iOIJAzpJYBRtv")
    //   .collection("invoicesList")
    //   .doc("BZTpJkoBIn99WlqKWLgj")
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
  }, [userUniqueID]);

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

  // useEffect(() => {
  //   setRowCountState((prevRowCountState) =>
  //     rowCount !== undefined ? rowCount : prevRowCountState
  //   );
  // }, [rowCount, setRowCountState]);
  const [showLoader, setLoaderStatus] = useState(0);

  const [toastMessage, setToastMessageInfo] = useState(null);

  return (
    <div className="font-sans p-5 pt-0 h-full bg-gray-100">
      <CustomizedSnackbars {...toastMessage} />
      {showLoader ? <LoaderType1 /> : ""}
      <div className="md:flex md:justify-between">
        <ComposeButton />
        <Button>
          <ExportDataToExcel invoices={invoices} />
        </Button>
        <h1 className="text-3xl mb-2 items-end flex place-content-center">
          Your orders
        </h1>
      </div>

      {/* <InvoiceTableWithoutPagination /> */}

      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={invoices}
          columns={columns}
          // initialState={initialState}
          pagination
          pageSize={PAGE_SIZE}
          // rowsPerPageOptions={[PAGE_SIZE]}
          // rowCount={rowCountState}
          // paginationMode="server"
          // onPageChange={handlePageChange}
          // page={page}
          // loading={isLoading}
        />
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  userUniqueID: state.userUniqueID,
});

export default connect(mapStateToProps, mapDispatchToProps)(InvoiceList);

const ComposeButton = () => {
  return (
    <Link
      to="/compose"
      className="relative inline-flex items-center justify-start py-3 pl-4 pr-12 mb-2 overflow-hidden font-semibold text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 group"
    >
      <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
      <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
        <svg
          className="w-5 h-5 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          ></path>
        </svg>
      </span>
      <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
        <svg
          className="w-5 h-5 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          ></path>
        </svg>
      </span>
      <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white">
        Compose New Invoice
      </span>
    </Link>
  );
};

// const InvoiceTableWithoutPagination = ({ invoices }) => {
//   return (
//     <div className="rounded-lg shadow hidden md:block">
//       <table className="w-full  relative">
//         <thead className="bg-gray-50 border-b-2 border-gray-200">
//           <tr>
//             <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
//               No.
//             </th>
//             <th className="p-3 text-sm font-semibold tracking-wide text-left">
//               Total (excl. GST)
//             </th>
//             <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
//               GST. Incl.
//             </th>
//             <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
//               Date
//             </th>
//             <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
//               Total
//             </th>
//             <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
//               Status
//             </th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-gray-100 ">
//           {invoices.length === 0 ? (
//             <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
//               No Invoices
//             </td>
//           ) : (
//             invoices.map(
//               ({
//                 id,
//                 invoiceNo,
//                 GSTTotal,
//                 TotalWithGST,
//                 dueDate,
//                 invoiceDate,
//               }) => (
//                 <tr className="bg-white " key={id}>
//                   <td
//                     className="p-3 text-sm text-gray-700 whitespace-nowrap"
//                     onMouseEnter={() => setTooltipStatus(id)}
//                     onMouseLeave={() => setTooltipStatus(0)}
//                   >
//                     <Link
//                       to={`/view/${id}`}
//                       className="font-bold text-blue-500 hover:underline"
//                     >
//                       {invoiceNo ? invoiceNo : "No ID Exist"}
//                     </Link>

//                     {/*Code Block for indigo tooltip starts*/}
//                     <div className="relative my-28 md:my-0 ">
//                       {tooltipStatus == id && (
//                         <div
//                           role="tooltip"
//                           className="z-20 -mt-20 w-78 absolute transition duration-150 ease-in-out left-0 ml-24 shadow-lg bg-indigo-700 p-4 rounded"
//                         >
//                           <svg
//                             className="absolute left-0 -ml-2 bottom-0 top-0 h-full"
//                             width="9px"
//                             height="16px"
//                             viewBox="0 0 9 16"
//                             version="1.1"
//                             xmlns="http://www.w3.org/2000/svg"
//                             xmlnsXlink="http://www.w3.org/1999/xlink"
//                           >
//                             <g
//                               id="Page-1"
//                               stroke="none"
//                               strokeWidth={1}
//                               fill="none"
//                               fillRule="evenodd"
//                             >
//                               <g
//                                 id="Tooltips-"
//                                 transform="translate(-874.000000, -1029.000000)"
//                                 fill="#4c51bf"
//                               >
//                                 <g
//                                   id="Group-3-Copy-16"
//                                   transform="translate(850.000000, 975.000000)"
//                                 >
//                                   <g
//                                     id="Group-2"
//                                     transform="translate(24.000000, 0.000000)"
//                                   >
//                                     <polygon
//                                       id="Triangle"
//                                       transform="translate(4.500000, 62.000000) rotate(-90.000000) translate(-4.500000, -62.000000) "
//                                       points="4.5 57.5 12.5 66.5 -3.5 66.5"
//                                     />
//                                   </g>
//                                 </g>
//                               </g>
//                             </g>
//                           </svg>
//                           <p className="text-sm font-bold text-white pb-1">
//                             Keep track of follow ups
//                           </p>
//                           <p className="text-xs leading-4 text-white pb-3">
//                             Reach out to more prospects at the right moment.
//                           </p>
//                           <div className="flex justify-between">
//                             <div className="flex items-center">
//                               <span className="text-xs font-bold text-white">
//                                 Step 1 of 4
//                               </span>
//                             </div>
//                             <div className="flex items-center">
//                               <button className="bg-white transition duration-150 ease-in-out focus:outline-none hover:bg-gray-200 rounded text-indigo-700 px-5 py-1 text-xs">
//                                 Next
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </div>
//                     {/*Code Block for indigo tooltip ends*/}
//                   </td>
//                   <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
//                     {TotalWithGST}
//                   </td>
//                   <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
//                     {GSTTotal}
//                   </td>
//                   <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
//                     {invoiceDate}
//                   </td>
//                   <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
//                     {dueDate}
//                   </td>
//                   <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
//                     <span className="p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
//                       Delivered
//                     </span>
//                   </td>
//                 </tr>
//               )
//             )
//           )}
//         </tbody>
//       </table>

//       {invoices.length === 0 ? (
//         <div className="p-3 text-sm text-gray-700 whitespace-nowrap ">
//           <div className="border border-blue-300 shadow rounded-md p-4 mx-auto">
//             <div className="animate-pulse flex space-x-4">
//               <div className="rounded-full bg-slate-700 h-10 w-10"></div>
//               <div className="flex-1 space-y-6 py-1">
//                 <div className="h-2 bg-slate-700 rounded"></div>
//                 <div className="space-y-3">
//                   <div className="grid grid-cols-3 gap-4">
//                     <div className="h-2 bg-slate-700 rounded col-span-2"></div>
//                     <div className="h-2 bg-slate-700 rounded col-span-1"></div>
//                   </div>
//                   <div className="h-2 bg-slate-700 rounded"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         invoices.map(
//           ({ id, invoiceNo, GSTTotal, TotalWithGST, dueDate, invoiceDate }) => (
//             <div
//               className="grid grid-cols-1 mb-8 md:hidden group rounded-lg ring-slate-900/5 shadow-lg hover:bg-sky-500 hover:ring-sky-500 transition hover:duration-300"
//               key={id}
//             >
//               <div className="space-y-3 p-4 rounded-lg shadow">
//                 <div className="flex items-center space-x-2 text-sm">
//                   <div>
//                     <Link
//                       to={`/view/${id}`}
//                       className="font-bold text-blue-500 hover:underline group-hover:text-white"
//                     >
//                       {invoiceNo ? invoiceNo : "No ID Exist"}
//                     </Link>
//                   </div>
//                   <div className="text-sm font-semibold ">
//                     {/* {invoiceDate.toDate().toDateString()} */}
//                   </div>
//                   <div>
//                     <span className="group-hover:text-white p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
//                       Delivered
//                     </span>
//                   </div>
//                 </div>
//                 <div className="group-hover:text-white text-sm text-gray-700">
//                   Kring New Fit office chair, mesh + PU, black
//                 </div>
//                 <div className="group-hover:text-white text-sm font-medium text-black">
//                   Total Amount: Rs. {Number(TotalWithGST) + Number(GSTTotal)}
//                 </div>
//               </div>
//             </div>
//           )
//         )
//       )}
//     </div>
//   );
// };
