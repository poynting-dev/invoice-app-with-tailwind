import React from "react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getAuth, updateProfile } from "firebase/auth";

import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase";

import "./ManageProfile.css";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { green, grey } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import CustomizedSnackbars from "../CustomizedSnackbars";

export default function ManageProfile() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();

  const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

  const imageRef = useRef(null);
  const [image, setImage] = useState(null);
  const [imageChanged, setImageChanged] = useState(false);

  const handleImageChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleImageClick = () => {
    imageRef.current.click();
  };

  const [userImg, setUserImg] = useState();
  const [profile, setProfile] = useState({
    emailAddress: "",
    sellerName: "",
    companyName: "",
    companyAddress: "",
    companyExtraInfo: "",
    phoneNumber: "",
    sellerName: "",
    userImage: "",
  });

  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();

  const displayName = currentUser.displayName;
  const [userUniqueID, setID] = useState("");

  const handleImageUpload = (e) => {
    setProfile({
      ...profile,
      userImage: e.target.files[0],
    });
    setImageChanged(true);
  };

  const handleButtonClick = () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      timer.current = window.setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 2000);
    }
  };

  const updateSellerProfile = () => {
    const isEmpty = Object.values(profile).some((val) => val === "");
    const storageRef = ref(
      storage,
      `/${currentUser.email}/profile/${profile.userImage.name}`
    );

    if (isEmpty) {
      alert("One or more fields are empty");
      console.log(
        "storageRef: ",
        `/${currentUser.email}/profile/${profile.userImage.name}`
      );
      // console.log(profile);
      return;
    }

    if (!loading) {
      setSuccess(false);
      setLoading(true);
      if (imageChanged) {
        const uploadImage = uploadBytesResumable(storageRef, profile.userImage);
        uploadImage.on(
          "state_changed",
          (snapshot) => {
            const progressPercent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            // setProgress(progressPercent);
          },
          (err) => {
            console.log(err);
          },
          () => {
            getDownloadURL(uploadImage.snapshot.ref).then((url) => {
              const invoiceRef = collection(db, "invoices");

              console.log("url: ", url);
              setProfile({
                ...profile,
                userImage: url,
                updatedAt: Timestamp.now().toDate(),
              });
              // addDoc(invoiceRef, {
              //   ...profile,
              //   updatedAt: Timestamp.now().toDate(),
              // })
              db.collection("invoices")
                .doc(userUniqueID)
                .update({ ...profile, userImage: url }, { merge: true })
                .then(function () {
                  console.log("Successfully Updated");
                  setSuccess(true);
                  setLoading(false);
                })
                .catch(function (error) {
                  console.log("Error Inserting Data: ", error);
                });
              // .then(() => {
              // console.log("Account successfully");
              // toast("Account successfully", { type: "success" });
              // setProgress(0);
              // })
              // .catch((err) => {
              //   console.log("Error updating Account");
              // toast("Error adding article", { type: "error" });
              // });
            });
          }
        );
      } else {
        db.collection("invoices")
          .doc(userUniqueID)
          .update({ ...profile }, { merge: true })
          .then(function () {
            console.log("Successfully Updated");
            setSuccess(true);
            setLoading(false);
          })
          .catch(function (error) {
            console.log("Error Inserting Data: ", error);
          });
      }
    }
  };

  useEffect(() => {
    // console.log(currentUser.email);
    db.collection("invoices")
      .where("userName", "==", currentUser.email)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          console.log("Document data:", doc.data());
          setID(doc.id);
          // ---------------
          setProfile({
            ...profile,
            emailAddress: currentUser.email,
            sellerName: currentUser.displayName,
            ...doc.data(),
          });
          setImage(doc.data().userImage);
        });
        setToastMessageInfo({
          message: "Data has been fetched successfully.",
          category: "SUCCESS",
          time: new Date().getUTCSeconds(),
        });
      })
      .catch(function (error) {
        setToastMessageInfo({
          message: "Data has been fetched successfully.",
          category: "SUCCESS",
          time: new Date().getUTCSeconds(),
        });
        console.log("Error getting documents: ", error);
      });

    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const [toastMessage, setToastMessageInfo] = useState(null);
  const updateSellerProfileOlder = () => {
    const isEmpty = Object.values(profile).some((val) => val === "");

    if (isEmpty) {
      alert("One or more fields are empty");
      console.log(profile);
      console.log(profile.userImage);
    } else {
      db.collection("invoices")
        .doc(userUniqueID)
        .update({ ...profile }, { merge: true })
        .then(function () {
          console.log("Successfully Inserted");
        })
        .catch(function (error) {
          console.log("Error Inserting Data: ", error);
        });
    }
  };

  const handleChange = (e) => {
    console.log(e.target.name, e.target.value);
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
    // console.log(e.target.value);
  };
  return (
    <div className="mb-24">
      <CustomizedSnackbars {...toastMessage} />
      <div className="container">
        <h2>Edit your Info.</h2>

        {/* <div className="grid md:grid-cols-2 md:gap-6">
          {Object.entries(profile).map(([key, value], index) => (
            <InputField
              name={key}
              value={value}
              label={key}
              handleChange={handleChange}
            />
          ))}
        </div> */}
        <div className="flex space-x-4">
          {/* -------------------------------Image Uploader--------------- */}
          <div
            className="w-60 h-60"
            // style={{ height: "120px", width: "120px", zIndex: "1001" }}
          >
            <img
              className="rounded-md w-100 h-100 shadow-md cursor-pointer"
              alt="User Pic"
              src={
                image == null
                  ? "https://d30y9cdsu7xlg0.cloudfront.net/png/138926-200.png"
                  : image
              }
              id="profile-image1"
              height="200"
              onClick={handleImageClick}
            />
            <input
              ref={imageRef}
              id="profile-image-upload"
              className="hidden"
              type="file"
              name="userImage"
              onChange={(e) => (handleImageChange(e), handleImageUpload(e))}
            />
            <div style={{ color: "#999" }}> </div>
          </div>
          {/* -------------------------------Image Uploader--------------- */}
          <div className="w-75">
            <div className="relative z-0 mb-6 w-full group">
              <input
                type="email"
                name="emailAddress"
                id="userEmail"
                className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-1 border-b-2 border-gray-300 appearance-none border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                value={profile.emailAddress}
                // onChange={(e) => handleChange(e)}
                required
              />
              <label
                htmlFor="emailAddress"
                className="peer-focus:font-medium absolute text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Email address
              </label>
            </div>

            <div className="grid md:grid-cols-2 md:gap-6">
              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="text"
                  name="sellerName"
                  id="sellerName"
                  className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-1 border-b-2 border-gray-300 appearance-none border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  value={profile.sellerName}
                  placeholder=" "
                  onChange={(e) => handleChange(e)}
                  required
                />
                <label
                  htmlFor="sellerName"
                  className="peer-focus:font-medium absolute text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Your Name
                </label>
              </div>
              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="number"
                  name="phoneNumber"
                  id="phoneNumber"
                  className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-1 border-b-2 border-gray-300 appearance-none border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  value={profile.phoneNumber}
                  placeholder=" "
                  onChange={(e) => handleChange(e)}
                  required
                />
                <label
                  htmlFor="phoneNumber"
                  className="peer-focus:font-medium absolute text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Your Contact No.
                </label>
              </div>

              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-1 border-b-2 border-gray-300 appearance-none border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={profile.companyName}
                  onChange={(e) => handleChange(e)}
                  required
                />
                <label
                  htmlFor="companyName"
                  className="peer-focus:font-medium absolute text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Company Name
                </label>
              </div>

              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="text"
                  name="companyAddress"
                  id="companyAddress"
                  className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-1 border-b-2 border-gray-300 appearance-none border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={profile.companyAddress}
                  onChange={(e) => handleChange(e)}
                  required
                />
                <label
                  htmlFor="companyAddress"
                  className="peer-focus:font-medium absolute text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Company Address
                </label>
              </div>

              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="text"
                  name="companyExtraInfo"
                  id="companyExtraInfo"
                  className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-1 border-b-2 border-gray-300 appearance-none border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  value={profile.companyExtraInfo}
                  onChange={(e) => handleChange(e)}
                  required
                />
                <label
                  htmlFor="companyExtraInfo"
                  className="peer-focus:font-medium absolute text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Extra Info
                </label>
              </div>
            </div>
            {/* <RoundedCircleImageUploader
          handleImageUpload={handleImageUpload}
          profile={profile}
        /> */}

            <button
              style={{ display: "flex", alignItems: "center" }}
              disabled={loading}
            >
              <button
                className="snip1547"
                onClick={updateSellerProfile}
                style={{ margin: 1, position: "relative" }}
              >
                <span style={{ padding: "10px 20px" }}>Submit</span>
                {loading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: grey[900],
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                )}
              </button>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoundedCircleImageUploader(props) {
  const imageRef = useRef(null);
  const [image, setImage] = useState(props.profile.userImage);

  const handleImageChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  const handleImageClick = () => {
    imageRef.current.click();
  };

  useEffect(() => {
    return () => {};
  }, [image]);

  return (
    <div className="profile-pic">
      <img
        alt="User Pic"
        src={
          image == null
            ? "https://d30y9cdsu7xlg0.cloudfront.net/png/138926-200.png"
            : image
        }
        id="profile-image1"
        height="200"
        onClick={handleImageClick}
      />
      <input
        ref={imageRef}
        id="profile-image-upload"
        className="hidden"
        type="file"
        name="userImage"
        onChange={(e) => (handleImageChange(e), props.handleImageUpload(e))}
      />
      <div style={{ color: "#999" }}> </div>
    </div>
  );
}

const InputField = (props) => {
  return (
    <div className="relative z-0 mb-6 w-full group">
      <input
        type="text"
        name="sellerName" //props.name
        id="sellerName" //props.name
        className="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-1 border-b-2 border-gray-300 appearance-none border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        value={props.value} //props.value
        placeholder=" "
        onChange={(e) => props.handleChange(e)} //props.handleChange
        required
      />
      <label
        htmlFor="sellerName"
        className="peer-focus:font-medium absolute text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
      >
        {props.label}
      </label>
    </div>
  );
};
//props.name, props.value, props.handleChange, props.label
