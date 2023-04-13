import { db } from "../../firebase";

const addInvoice = (invoice) => ({
  type: "ADD_INVOICE",
  invoice,
});

const updateInvoice = (id, updates) => ({
  type: "UPDATE_INVOICE",
  id,
  updates,
});

const deleteInvoice = (id) => ({
  type: "DELETE_INVOICE",
  id,
});

const setUserProfile = (profile) => ({
  type: "SET_USER_PROFILE",
  profile,
});

export const setUniqueUserID = (id) => ({
  type: "SET_USER_ID",
  id,
});

export const fetchUserUniqueID = (email) => {
  return async (dispatch) => {
    db.collection("invoices")
      .where("userName", "==", email)
      .get()
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          dispatch(setUniqueUserID(doc.id));
          console.log("userUniqueId has been setted: " + doc.id);
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  };
};

export const RESET_USER_ID = "RESET_USER_ID";

// define the new action creator
export const resetUserUniqueID = () => ({
  type: RESET_USER_ID,
  id: null,
});

export const mapDispatchToProps = (dispatch) => ({
  addInvoice: (invoice) => dispatch(addInvoice(invoice)),
  updateInvoice: (id, updates) => dispatch(updateInvoice(id, updates)),
  deleteInvoice: (id) => dispatch(deleteInvoice(id)),
  setUserProfile: (profile) => dispatch(setUserProfile(profile)),
  setUniqueUserID: (id) => dispatch(setUniqueUserID(id)),
  fetchUserUniqueID,
  resetUserUniqueID: () => dispatch(resetUserUniqueID()),
});
