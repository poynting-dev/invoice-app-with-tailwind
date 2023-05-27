import { useEffect } from "react";
import { db } from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";

export const AddressComponent = ({ billing, from, setBilling, setFrom }) => {
  const handleBillAddressChange = (e) => {
    let updatedValue = {};
    updatedValue = { [e.target.name]: e.target.value };
    setBilling((val) => ({
      ...val,
      ...updatedValue,
    }));
  };

  const handleFromAddressChange = (e) => {
    let updatedValue = {};
    updatedValue = { [e.target.name]: e.target.value };
    setFrom((val) => ({
      ...val,
      ...updatedValue,
    }));
  };

  const { currentUser } = useAuth();

  useEffect(() => {
    // ////////////////////////////
    db.collection("invoices")
      .where("userName", "==", currentUser.email)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          console.log("Document data:", doc.data());
          //setID(doc.id);
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
    // ////////////////////////////
  }, []);

  return (
    <div className="flex flex-wrap justify-between mb-8">
      <div className="w-full md:w-1/3 mb-2 md:mb-0">
        <label className="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">
          Bill/Ship To:
        </label>
        <input
          className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          id="inline-full-name"
          type="email"
          placeholder="Email Address"
          name="email"
          value={billing.email}
          onChange={(e) => handleBillAddressChange(e)}
        />
        <input
          className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          id="inline-full-name"
          type="text"
          placeholder="Name"
          name="name"
          value={billing.name}
          onChange={(e) => handleBillAddressChange(e)}
        />
        <input
          className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          id="inline-full-name"
          type="text"
          placeholder="Address"
          name="address"
          value={billing.address}
          onChange={(e) => handleBillAddressChange(e)}
        />
        <input
          className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          id="inline-full-name"
          type="text"
          name="extra"
          placeholder="Additional info"
          value={billing.extra}
          onChange={(e) => handleBillAddressChange(e)}
        />
      </div>
      <div className="w-full md:w-1/3">
        <label className="text-gray-800 block mb-1 font-bold text-sm uppercase tracking-wide">
          From:
        </label>
        <input
          className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          id="inline-full-name"
          type="email"
          name="email"
          value={from.email}
          placeholder="Email Address"
          onChange={(e) => handleFromAddressChange(e)}
        />
        <input
          className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          id="inline-full-name"
          type="text"
          name="name"
          value={from.name}
          placeholder="Your company name"
          onChange={(e) => handleFromAddressChange(e)}
        />
        <input
          className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          id="inline-full-name"
          type="text"
          name="address"
          value={from.address}
          placeholder="Your company address"
          onChange={(e) => handleFromAddressChange(e)}
        />

        <input
          className="mb-1 bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-blue-500"
          id="inline-full-name"
          type="text"
          name="extra"
          value={from.extra}
          placeholder="Additional info"
          onChange={(e) => handleFromAddressChange(e)}
        />
      </div>
    </div>
  );
};
