import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "./firebase";

import Profile from "./components/Account/Profile";
import "alpinejs";

import "daisyui";
import {
  DueDate,
  InvoiceDate,
} from "./components/Account/Invoice_HomePage/DateComponent";
import { AddressComponent } from "./components/Account/Invoice_HomePage/AddressComponent";
import { InvoiceTableHeading } from "./components/Account/Invoice_HomePage/TableComponent";
import { NavBar } from "./components/Account/NavBar";
import SideBar from "./components/Account/SideBar";

var options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export default function Dashboard() {
  const [userUniqueID, setUserUniqueID] = useState("");
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = currentUser.displayName;

  async function handleLogout() {
    setError("");

    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toLocaleDateString("en-IN", options)
  );

  const [dueDate, setDueDate] = useState(
    new Date().toLocaleDateString("en-IN", options)
  );

  const [billing, setBilling] = useState({ name: "", address: "", extra: "" });
  const [from, setFrom] = useState({ name: "", address: "", extra: "" });

  const [singleItem, setSingleItem] = useState({
    id: null,
    name: "",
    qty: 0,
    rate: 0,
    total: 0,
    gst: 18,
  });

  const [id, setID] = useState(0);

  const [TotalWithGST, setTotalWithGST] = useState(0);
  const [GSTTotal, setGSTTotal] = useState(0);

  const handlePriceChange = () => {
    const sum = items.reduce((partialSum, a) => partialSum + a.total, 0);

    setTotalWithGST(sum.toFixed(2));
    console.log("handlePriceChange:  " + TotalWithGST);
  };

  const handleGSTChange = () => {
    const sum = items.reduce(
      (prevValue, curValue) =>
        prevValue + (curValue.gst / 100) * curValue.total,
      0
    );

    setGSTTotal(sum.toFixed(2));
  };

  const [items, setItems] = useState([
    // {
    //   id: 1,
    //   name: "Pen",
    //   qty: 5,
    //   rate: 5,
    //   total: 25,
    //   gst: 18,
    // },
    // {
    //   id: 2,
    //   name: "Book",
    //   qty: 10,
    //   rate: 20,
    //   total: 200,
    //   gst: 18,
    // },
  ]);

  const [imgSRC, setImgSRC] = useState(
    "https://placehold.co/300x300/e2e8f0/e2e8f0"
  );

  const [progress, setProgress] = useState(77);

  const [getFileClick, setGetFileClick] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fileRef = React.createRef();

  const handleSendData = () => {
    console.log(items);
    console.log(billing);
    console.log(from);
    console.log(invoiceDate);
    console.log(dueDate);
    console.log(TotalWithGST);
    console.log(GSTTotal);

    if (
      !items ||
      !billing.name ||
      !billing.address ||
      !billing.extra ||
      !from.name ||
      !from.address ||
      !from.extra ||
      !invoiceDate ||
      !dueDate ||
      !TotalWithGST ||
      !GSTTotal
    ) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const invoicesRef = db.collection("invoices");
      const invoiceRef = invoicesRef.doc(userUniqueID);
      const dataRef = invoiceRef.collection("invoicesList");

      dataRef
        .add({
          invoiceNo: Math.random().toString().substr(2, 6),
          items: items,
          billing: billing,
          from: from,
          invoiceDate: Timestamp.fromDate(new Date(invoiceDate)),
          dueDate: Timestamp.fromDate(new Date(dueDate)),
          TotalWithGST: TotalWithGST,
          GSTTotal: GSTTotal,
        })
        .then(() => {
          // toast("Article added successfully", {
          //   type: "success",
          // });
          setProgress(0);
          console.log("Data added to subcollection successfully");
        });
    } catch (error) {
      console.error(
        "Subcollection ID: " +
          userUniqueID +
          "<br/>" +
          "Error adding data to subcollection: ",
        error
      );
    }
    // -------------------------------
    // const storageRef = ref(
    //   storage,
    //   `/images/${Date.now()}${formData.image.name}`
    // );

    // const uploadImage = uploadBytesResumable(storageRef, formData.image);4
    // uploadImage.on(
    //   "state_changed",
    //   (snapshot) => {
    //     const progressPercent = Math.round(
    //       (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //     );
    //     setProgress(progressPercent);
    //   },
    //   (err) => {
    //     console.log(err);
    //   },
    //   () => {
    //     // setFormData({
    //     //   title: "",
    //     //   postContent: "",
    //     //   image: "",
    //     //   createdAt: Timestamp.now().toDate(),
    //     //   likes: [""],
    //     //   comments: { "": "" },
    //     //   postedBy: currentUser.email,
    //     //   tags: [],
    //     // });

    //     getDownloadURL(uploadImage.snapshot.ref).then((url) => {
    //       const articleRef = collection(db, "discuss-posts");
    //       addDoc(articleRef, {
    //         title: formData.title,
    //         postContent: formData.postContent,
    //         imageUrl: url,
    //         createdAt: Timestamp.now().toDate(),
    //         likes: [],
    //         comments: [],
    //         postedBy: formData.postedBy,
    //         tags: formData.tags,
    //       })
    //         .then(() => {
    //           toast("Article added successfully", {
    //             type: "success",
    //           });
    //           setProgress(0);
    //         })
    //         .catch((err) => {
    //           toast("Error adding article", { type: "error" });
    //         });
    //     });
    //   }
    // );
  };

  useEffect(() => {
    handleGSTChange();
    handlePriceChange();

    if (!userUniqueID) {
      db.collection("invoices")
        .where("userName", "==", currentUser.email)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            console.log("Document data:", doc.data());
            setUserUniqueID(doc.id);
            // ---------------
            // setProfile({
            //   ...profile,
            //   emailAddress: currentUser.email,
            //   sellerName: currentUser.displayName,
            //   ...doc.data(),
            // });
            // setImage(doc.data().userImage);
          });
        })
        .catch(function (error) {
          console.log("Error getting documents: ", error);
        });
    }

    return () => {
      handleGSTChange();
      handlePriceChange();
      console.log(getFileClick);
    };
  }, [items]);

  return (
    <>
      <div className="border-t-8 border-gray-700 h-2"></div>

      <div
        className="container mx-auto py-6 px-4"
        // x-data="invoices()"
        // x-init="generateInvoiceNumber(111111, 999999);"
        // x-cloak
      >
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold mb-6 pb-2 tracking-wider uppercase">
            Invoice
          </h2>
          <div>
            <div className="relative mr-4 inline-block">
              <div
                className="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center"
                //  @mouseenter="showTooltip = true" @mouseleave="showTooltip = false" @click="printInvoice()"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-printer"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="0" y="0" width="24" height="24" stroke="none"></rect>
                  <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                  <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                  <rect x="7" y="13" width="10" height="8" rx="2" />
                </svg>
              </div>
              {/* <div x-show.transition="showTooltip" className="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs">
						Print this invoice!
					</div> */}
            </div>

            <div className="relative inline-block">
              <div
                className="text-gray-500 cursor-pointer w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-300 inline-flex items-center justify-center"
                // @mouseenter="showTooltip2 = true" @mouseleave="showTooltip2 = false" @click="window.location.reload()"
              >
                <img
                  src="https://img.icons8.com/fluency/96/000000/filled-sent.png"
                  onClick={handleSendData}
                />
              </div>
              {/* <div
                                //  x-show.transition="showTooltip2"
                                className="z-40 shadow-lg text-center w-32 block absolute right-0 top-0 p-2 mt-12 rounded-lg bg-gray-800 text-white text-xs"
                            >
                                Reload Page
                            </div> */}
            </div>
          </div>
        </div>
        <div className="flex mb-8 justify-between">
          <div className="w-2/4">
            <div className="mb-2 md:mb-1 md:flex items-center">
              <label className="w-32 text-gray-800 block font-bold text-sm uppercase tracking-wide">
                Invoice No.
              </label>
              <span className="mr-4 inline-block hidden md:block">:</span>
              <div className="flex-1">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-48 py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                  id="inline-full-name"
                  type="text"
                  placeholder="eg. #INV-100001"
                  value={`#INV-${Math.random().toString().substr(2, 6)}`}
                  readOnly
                  //  x-model="invoiceNumber"
                />
              </div>
            </div>
            {progress === 0 ? null : (
              <div className="w-full bg-gray-200 rounded-full">
                <div
                  className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-l-full"
                  style={{ width: `${progress}%` }}
                >
                  {" "}
                  {`uploading image ${progress}%`}
                </div>
              </div>
            )}
            <InvoiceDate
              invoiceDate={invoiceDate}
              setInvoiceDate={setInvoiceDate}
              isOpen1={isOpen1}
              setIsOpen1={setIsOpen1}
            />
            <DueDate
              dueDate={dueDate}
              setDueDate={setDueDate}
              isOpen2={isOpen2}
              setIsOpen2={setIsOpen2}
            />
          </div>
          <ImageComponent
            fileRef={fileRef}
            imgSRC={imgSRC}
            setImgSRC={setImgSRC}
            getFileClick={getFileClick}
            setGetFileClick={setGetFileClick}
          />
        </div>
        <AddressComponent
          billing={billing}
          from={from}
          setBilling={setBilling}
          setFrom={setFrom}
        />
        <InvoiceTableHeading />
        <InvoiceTableData
          items={items}
          setItems={setItems}
          setGSTTotal={setGSTTotal}
          handlePriceChange={handlePriceChange}
          id={id}
          setID={setID}
        />
        <button
          className="mt-6 bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 text-sm border border-gray-300 rounded shadow-sm"
          onClick={(e) => setShowModal(!showModal)}
          // x-on:click="openModal = !openModal"
        >
          Add Invoice Items
        </button>
        <div className="py-2 ml-auto mt-5 w-full sm:w-2/4 lg:w-1/4">
          <div className="flex justify-between mb-3">
            <div className="text-gray-800 text-right flex-1">
              Total incl. GST
            </div>
            <div className="text-right w-40">
              <div className="text-gray-800 font-medium">
                Rs. {TotalWithGST}
              </div>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="text-sm text-gray-600 text-right flex-1">
              GST(18%) incl. in Total
            </div>
            <div className="text-right w-40">
              <div className="text-sm text-gray-600">Rs. {GSTTotal}</div>
            </div>
          </div>

          <div className="py-2 border-t border-b">
            <div className="flex justify-between">
              <div className="text-xl text-gray-600 text-right flex-1">
                Amount due
              </div>
              <div className="text-right w-40">
                <div className="text-xl text-gray-800 font-bold">
                  {(parseFloat(TotalWithGST) + parseFloat(GSTTotal)).toFixed(
                    2
                  ) > 0
                    ? (parseFloat(TotalWithGST) + parseFloat(GSTTotal)).toFixed(
                        2
                      )
                    : "₹0.00"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-10 text-center">
          <p className="text-gray-600">
            Inspired by{" "}
            <a
              className="text-blue-600 hover:text-blue-500 border-b-2 border-blue-200 hover:border-blue-300"
              href="https://twitter.com/mithicher"
            >
              @mithicher
            </a>
            . Built with{" "}
            <a
              className="text-blue-600 hover:text-blue-500 border-b-2 border-blue-200 hover:border-blue-300"
              href="https://tailwindcss.com/"
            >
              tailwindCSS
            </a>
            .
          </p>
        </div>

        {showModal && (
          <Modal
            showModal={showModal}
            setShowModal={setShowModal}
            singleItem={singleItem}
            setSingleItem={setSingleItem}
            items={items}
            handlePriceChange={handlePriceChange}
            handleGSTChange={handleGSTChange}
            id={id}
            setID={setID}
          />
        )}
      </div>
    </>
  );
}

const ImageComponent = ({
  fileRef,
  imgSRC,
  setImgSRC,
  getFileClick,
  setGetFileClick,
}) => {
  return (
    <div>
      <div className="w-32 h-32 mb-1 border rounded-lg overflow-hidden relative bg-gray-100">
        <img id="image" className="object-cover w-full h-32" src={imgSRC} />

        <div
          className="absolute top-0 left-0 right-0 bottom-0 w-full block cursor-pointer flex items-center justify-center"
          // onClick="document.getElementById('fileInput').click()"
          onClick={(e) => {
            fileRef.current.click();
          }}
        >
          <button
            type="button"
            className="hover:bg-gray-100 bg-white/[0.65]  text-gray-700 font-semibold py-2 px-4 text-sm border border-gray-300 rounded-lg shadow-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-camera"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="0" y="0" width="24" height="24" stroke="none"></rect>
              <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
              <circle cx="12" cy="13" r="3" />
            </svg>
          </button>
        </div>
      </div>
      <input
        name="photo"
        id="fileInput"
        accept="image/*"
        className="hidden"
        type="file"
        ref={fileRef}
        onChange={(e) => {
          let file = e.target.files[0];
          var reader = new FileReader();

          // reader.onload = function (e) {
          //     document.getElementById('image').src = e.target.result
          //     document.getElementById('image2').src = e.target.result
          // }

          reader.readAsDataURL(file);
          console.log(reader);
        }}
      />
    </div>
  );
};

const InvoiceTableData = ({
  items,
  setItems,
  setGSTTotal,
  handlePriceChange,
  id,
  setID,
}) => {
  const handleDeleteItem = (id) => {
    // items.items.splice(id - 1, 1);
    const arr = items.filter((a) => a.id != id);
    setItems(arr);
    // console.log(arr);
    // console.log(items);
    handlePriceChange();
    setGSTTotal();
    setID(--id);
  };

  useEffect(() => {
    console.log("UseEffect: " + JSON.stringify(items));
    handlePriceChange();
    setGSTTotal();

    return () => {};
  }, [items]);

  return (
    <div>
      {items.map((item, i) => {
        return (
          <div className="flex -mx-1 py-2  border-b" key={item.id}>
            <div className="flex-1 px-1 border-b-2 border-green-500">
              <p className="text-gray-800" value="invoice.name">
                {item.name}
              </p>
            </div>

            <div className="px-1 w-20 text-right border-b-2 border-red-500">
              <p className="text-gray-800" value="invoice.qty">
                {item.qty}
              </p>
            </div>

            <div className="px-1 w-32 text-right border-b-2 border-yellow-500">
              <p className="text-gray-800" value="numberFormat(invoice.rate)">
                {item.rate}
              </p>
            </div>

            <div className="px-1 w-32 text-right border-b-2 border-green-500">
              <p className="text-gray-800" value="numberFormat(invoice.total)">
                {item.total}
              </p>
            </div>

            <div className="px-1 w-20 text-right border-b-2 border-red-500">
              <a
                className="text-red-500 hover:text-red-600 text-sm font-semibold cursor-pointer"
                onClick={(e) => handleDeleteItem(item.id)}
              >
                Delete
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

function invoices() {
  return {
    items: [], //done
    invoiceNumber: 0,
    invoiceDate: "", //done
    invoiceDueDate: "", //done

    totalGST: 0,
    netTotal: 0,

    item: {
      id: "", //done
      name: "",
      qty: 0,
      rate: 0,
      total: 0,
      gst: 18,
    },

    showTooltip: false,
    showTooltip2: false,
    openModal: false, //done

    addItem() {
      this.items.push({
        id: this.generateUUID(),
        name: this.item.name,
        qty: this.item.qty,
        rate: this.item.rate,
        gst: this.calculateGST(this.item.gst, this.item.rate),
        total: this.item.qty * this.item.rate,
      });

      this.itemTotal();
      this.itemTotalGST();

      this.item.id = "";
      this.item.name = "";
      this.item.qty = 0;
      this.item.rate = 0;
      this.item.gst = 18;
      this.item.total = 0;
    },

    deleteItem(uuid) {
      this.items = this.items.filter((item) => uuid !== item.id);

      this.itemTotal();
      this.itemTotalGST();
    },

    itemTotal() {
      this.netTotal = this.numberFormat(
        this.items.length > 0
          ? this.items.reduce((result, item) => {
              return result + item.total;
            }, 0)
          : 0
      );
    },

    itemTotalGST() {
      this.totalGST = this.numberFormat(
        this.items.length > 0
          ? this.items.reduce((result, item) => {
              return result + item.gst * item.qty;
            }, 0)
          : 0
      );
    },

    calculateGST(GSTPercentage, itemRate) {
      return this.numberFormat(
        (itemRate - itemRate * (100 / (100 + GSTPercentage))).toFixed(2)
      );
    },

    generateUUID() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },

    generateInvoiceNumber(minimum, maximum) {
      const randomNumber =
        Math.floor(Math.random() * (maximum - minimum)) + minimum;
      this.invoiceNumber = "#INV-" + randomNumber;
    },

    numberFormat(amount) {
      return amount.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      });
    },

    printInvoice() {
      var printContents = this.$refs.printTemplate.innerHTML;
      var originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    },
  };
}

const Modal = ({
  showModal,
  setShowModal,
  singleItem,
  setSingleItem,
  items,
  handlePriceChange,
  handleGSTChange,
  id,
  setID,
}) => {
  const [itemsCount, setItemsCount] = useState(items.length);
  const [newTotal, setTotal] = useState(0);

  const handleModalItemValueChange = (e) => {
    let updatedValue = {};
    updatedValue = {
      [e.target.name]: e.target.value,
    };
    setSingleItem((val) => ({
      ...val,
      ...updatedValue,
    }));
  };

  const handleAddItem = () => {
    setTotal(parseFloat(singleItem.qty) * parseFloat(singleItem.rate));

    singleItem.total = newTotal;

    if (
      !singleItem.name ||
      !singleItem.qty ||
      !singleItem.rate ||
      !singleItem.total ||
      !singleItem.gst
    ) {
      console.log(singleItem);
      alert("Fill all the fields");
      return;
    }
    console.log("Here");
    handlePriceChange();
    handleGSTChange();
    setTotal(parseFloat(singleItem.qty) * parseFloat(singleItem.rate));

    singleItem.total = newTotal;
    singleItem.id = id;
    setID(++id);
    if (items.indexOf(singleItem) == -1) {
      items.push(singleItem);
      setItemsCount(items.length);
      console.log(items);
    }

    setSingleItem({ id: id, name: "", qty: 0, rate: 0, total: 0, gst: 18 });
  };

  const handleGSTValue = (e) => {
    console.log(e.target.value);
  };

  useEffect(() => {
    setTotal(parseFloat(singleItem.qty) * parseFloat(singleItem.rate));
    let updatedValue = {};
    updatedValue = {
      total: newTotal,
    };

    singleItem.total = newTotal;
    setSingleItem((val) => ({
      ...val,
      ...updatedValue,
    }));

    handleGSTChange();
    handlePriceChange();
  }, [singleItem.qty, singleItem.rate, items]);

  return (
    <div
      // style=" background-color: rgba(0, 0, 0, 0.8)"
      className="fixed z-40 top-0 right-0 left-0 bottom-0 h-full w-full bg-slate-500/[.6] .... transition ease-in-out delay-150  duration-300 "
      // x-show.transition.opacity="openModal"
    >
      <div className="p-4 max-w-xl mx-auto relative absolute left-0 right-0 overflow-hidden mt-24">
        <div
          className="shadow absolute right-0 top-0 w-10 h-10 rounded-full bg-white text-gray-500 hover:text-gray-800 inline-flex items-center justify-center cursor-pointer"
          onClick={(e) => setShowModal(!showModal)}
        >
          <svg
            className="fill-current w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M16.192 6.344L11.949 10.586 7.707 6.344 6.293 7.758 10.535 12 6.293 16.242 7.707 17.656 11.949 13.414 16.192 17.656 17.606 16.242 13.364 12 17.606 7.758z" />
          </svg>
        </div>

        <div className="shadow w-full rounded-lg bg-white overflow-hidden w-full block p-8">
          <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b pb-2">
            Fill your services
          </h2>

          <div className="mb-4">
            <label className="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">
              Description
            </label>
            <input
              className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
              id="inline-full-name"
              type="text"
              name="name"
              value={singleItem.name}
              onChange={(e) => handleModalItemValueChange(e)}
            />
          </div>

          <div className="flex">
            <div className="mb-4 w-32 mr-2">
              <label className="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">
                Units
              </label>
              <input
                className="text-right mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                id="inline-full-name"
                min={0}
                type="number"
                name="qty"
                value={singleItem.qty}
                onChange={(e) => {
                  handleModalItemValueChange(e);
                }}
              />
            </div>

            <div className="mb-4 w-32 mr-2">
              <label className="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">
                Unit Price
              </label>
              <input
                className="text-right mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                id="inline-full-name"
                min={0}
                type="number"
                name="rate"
                value={singleItem.rate}
                onChange={(e) => {
                  handleModalItemValueChange(e);
                }}
              />
            </div>

            <div className="mb-4 w-32">
              <label className="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">
                Amount
              </label>
              <input
                className="text-right mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                id="inline-full-name"
                name="total"
                type="text"
                value={newTotal}
                readOnly
              />
            </div>
          </div>

          <div className="mb-4 w-32">
            <div className="relative">
              <label className="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">
                GST
              </label>
              <select
                className="text-gray-700 block appearance-none w-full bg-gray-200 border-2 border-gray-200 px-4 py-2 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
                name="gst"
                onChange={(e) => {
                  handleModalItemValueChange(e);
                }}
              >
                <option value="5">GST 5%</option>
                <option value="12">GST 12%</option>
                <option value="18">GST 18%</option>
                <option value="28">GST 28%</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
                <svg
                  className="fill-current h-4 w-4 mt-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-8 text-right">
            <button
              type="button"
              className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm mr-2"
              onClick={(e) => setShowModal(!showModal)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 border border-gray-700 rounded shadow-sm"
              // @click="addItem()"
              onClick={handleAddItem}
            >
              Add Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// const PrintTemplate = () => {
// 	return (
//     <div>
// 		<div id="js-print-template" x-ref="printTemplate" className="hidden">
// 			<div className="mb-8 flex justify-between">
// 				<div>
// 					<h2 className="text-3xl font-bold mb-6 pb-2 tracking-wider uppercase">Invoice</h2>

// 					<div className="mb-1 flex items-center">
// 						<label className="w-32 text-gray-800 block font-bold text-xs uppercase tracking-wide">Invoice No.</label>
// 						<span className="mr-4 inline-block">:</span>
// 						<div x-text="invoiceNumber"></div>
// 					</div>

// 					<div className="mb-1 flex items-center">
// 						<label className="w-32 text-gray-800 block font-bold text-xs uppercase tracking-wide">Invoice Date</label>
// 						<span className="mr-4 inline-block">:</span>
// 						<div x-text="invoiceDate"></div>
// 					</div>

// 					<div className="mb-1 flex items-center">
// 						<label className="w-32 text-gray-800 block font-bold text-xs uppercase tracking-wide">Due date</label>
// 						<span className="mr-4 inline-block">:</span>
// 						<div x-text="invoiceDueDate"></div>
// 					</div>
// 				</div>
// 				<div className="pr-5">
// 					<div className="w-32 h-32 mb-1 overflow-hidden">
// 						<img id="image2" className="object-cover w-20 h-20" />
// 					</div>
// 				</div>
// 			</div>

// 			<div className="flex justify-between mb-10">
// 				<div className="w-1/2">
// 					<label className="text-gray-800 block mb-2 font-bold text-xs uppercase tracking-wide">Bill/Ship To:</label>
// 					<div>
// 						<div x-text="billing.name"></div>
// 						<div x-text="billing.address"></div>
// 						<div x-text="billing.extra"></div>
// 					</div>
// 				</div>
// 				<div className="w-1/2">
// 					<label className="text-gray-800 block mb-2 font-bold text-xs uppercase tracking-wide">From:</label>
// 					<div>
// 						<div x-text="from.name"></div>
// 						<div x-text="from.address"></div>
// 						<div x-text="from.extra"></div>
// 					</div>
// 				</div>
// 			</div>

// 			<div className="flex flex-wrap -mx-1 border-b py-2 items-start">
// 				<div className="flex-1 px-1">
// 					<p className="text-gray-600 uppercase tracking-wide text-xs font-bold">Description</p>
// 				</div>

// 				<div className="px-1 w-32 text-right">
// 					<p className="text-gray-600 uppercase tracking-wide text-xs font-bold">Units</p>
// 				</div>

// 				<div className="px-1 w-32 text-right">
// 					<p className="leading-none">
// 						<span className="block uppercase tracking-wide text-xs font-bold text-gray-600">Unit Price</span>
// 						<span className="font-medium text-xs text-gray-500">(Incl. GST)</span>
// 					</p>
// 				</div>

// 				<div className="px-1 w-32 text-right">
// 					<p className="leading-none">
// 						<span className="block uppercase tracking-wide text-xs font-bold text-gray-600">Amount</span>
// 						<span className="font-medium text-xs text-gray-500">(Incl. GST)</span>
// 					</p>
// 				</div>
// 			</div>
// 			<template x-for="invoice in items" :key="invoice.id">
// 				<div className="flex flex-wrap -mx-1 py-2 border-b">
// 					<div className="flex-1 px-1">
// 						<p className="text-gray-800" x-text="invoice.name"></p>
// 					</div>

// 					<div className="px-1 w-32 text-right">
// 						<p className="text-gray-800" x-text="invoice.qty"></p>
// 					</div>

// 					<div className="px-1 w-32 text-right">
// 						<p className="text-gray-800" x-text="numberFormat(invoice.rate)"></p>
// 					</div>

// 					<div className="px-1 w-32 text-right">
// 						<p className="text-gray-800" x-text="numberFormat(invoice.total)"></p>
// 					</div>
// 				</div>
// 			</template>

// 			<div className="py-2 ml-auto mt-20" style="width: 320px">
// 				<div className="flex justify-between mb-3">
// 					<div className="text-gray-800 text-right flex-1">Total incl. GST</div>
// 					<div className="text-right w-40">
// 						<div className="text-gray-800 font-medium" x-html="netTotal"></div>
// 					</div>
// 				</div>
// 				<div className="flex justify-between mb-4">
// 					<div className="text-sm text-gray-600 text-right flex-1">GST(18%) incl. in Total</div>
// 					<div className="text-right w-40">
// 						<div className="text-sm text-gray-600" x-html="totalGST"></div>
// 					</div>
// 				</div>

// 				<div className="py-2 border-t border-b">
// 					<div className="flex justify-between">
// 						<div className="text-xl text-gray-600 text-right flex-1">Amount due</div>
// 						<div className="text-right w-40">
// 							<div className="text-xl text-gray-800 font-bold" x-html="netTotal"></div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</div>)
// }
