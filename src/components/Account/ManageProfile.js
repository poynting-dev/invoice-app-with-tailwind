import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getAuth, updateProfile } from "firebase/auth";

import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../../firebase";

import "./ManageProfile.css";

export default function ManageProfile() {
  const [userImg, setUserImg] = useState();
  const [profile, setProfile] = useState({
    emailAddress: "",
    sellerName: "",
    companyName: "",
    companyAddress: "",
    companyExtraInfo: "",
    phoneNumber: "",
    sellerName: "",
  });

  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();

  const displayName = currentUser.displayName;
  const [userUniqueID, setID] = useState("");

  useEffect(() => {
    setProfile({
      ...profile,
      emailAddress: currentUser.email,
      sellerName: currentUser.displayName,
    });
    // console.log(currentUser.email);
    db.collection("invoices")
      .where("userName", "==", currentUser.email)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          console.log("Document data:", doc.id);
          setID(doc.id);
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
    return () => {};
  }, []);

  const updateSellerProfile = () => {
    db.collection("invoices")
      .doc(userUniqueID)
      .update({ ...profile }, { merge: true })
      .then(function () {
        console.log("Successfully Inserted");
      })
      .catch(function (error) {
        console.log("Error Inserting Data: ", error);
      });
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
    console.log(e.target.value);
  };
  return (
    <div className="mb-24">
      <div class="container">
        <h2>Edit your Info.</h2>

        <div class="relative z-0 mb-6 w-full group">
          <input
            type="email"
            name="emailAddress"
            id="userEmail"
            class="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-1 border-b-2 border-gray-300 appearance-none border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            value={profile.emailAddress}
            // onChange={(e) => handleChange(e)}
            required
          />
          <label
            for="emailAddress"
            class="peer-focus:font-medium absolute text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
        </div>

        <div class="grid md:grid-cols-2 md:gap-6">
          <div class="relative z-0 mb-6 w-full group">
            <input
              type="text"
              name="sellerName"
              id="sellerName"
              class="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-1 border-b-2 border-gray-300 appearance-none border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              value={profile.sellerName}
              placeholder=" "
              onChange={(e) => handleChange(e)}
              required
            />
            <label
              for="sellerName"
              class="peer-focus:font-medium absolute text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Your Name
            </label>
          </div>
          <div class="relative z-0 mb-6 w-full group">
            <input
              type="text"
              name="companyName"
              id="companyName"
              class="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-1 border-b-2 border-gray-300 appearance-none border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={profile.companyName}
              onChange={(e) => handleChange(e)}
              required
            />
            <label
              for="companyName"
              class="peer-focus:font-medium absolute text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Company Name
            </label>
          </div>

          <div class="relative z-0 mb-6 w-full group">
            <input
              type="text"
              name="companyAddress"
              id="companyAddress"
              class="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-1 border-b-2 border-gray-300 appearance-none border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={profile.companyAddress}
              onChange={(e) => handleChange(e)}
              required
            />
            <label
              for="companyAddress"
              class="peer-focus:font-medium absolute text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Company Address
            </label>
          </div>

          <div class="relative z-0 mb-6 w-full group">
            <input
              type="text"
              name="companyExtraInfo"
              id="companyExtraInfo"
              class="block py-2.5 px-0 w-full text-gray-900 bg-transparent border-1 border-b-2 border-gray-300 appearance-none border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={profile.companyExtraInfo}
              onChange={(e) => handleChange(e)}
              required
            />
            <label
              for="companyExtraInfo"
              class="peer-focus:font-medium absolute text-gray-500 text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Extra Info
            </label>
          </div>
        </div>

        <div className="mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Attach Logo here:
            </label>
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="companyLogo"
                    className="relative cursor-pointer rounded-md font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="companyLogo"
                      name="companyLogo"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          <RoundedCircleImageUploader />
        </div>
        <button className="container">
          <button class="snip1547" onClick={updateSellerProfile}>
            <span>Submit</span>
            {/* <div class="simple-spinner">
              <span></span>
            </div> */}
          </button>
        </button>
      </div>
    </div>
  );
}

function RoundedCircleImageUploader() {
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div>
      <div className="image-container border-2 border-dashed border-cyan-500">
        {image ? (
          <img src={image} alt="uploaded image" className="rounded-circle" />
        ) : (
          <div className="plus-icon">
            +
            <input type="file" onChange={handleImageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
