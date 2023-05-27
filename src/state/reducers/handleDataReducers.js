import { combineReducers } from "redux";

const invoices = (state = [], action) => {
  switch (action.type) {
    case "ADD_INVOICE":
      return [...state, action.invoice];
    case "UPDATE_INVOICE":
      return state.map((invoice) => {
        if (invoice.id === action.id) {
          return { ...invoice, ...action.updates };
        }
        return invoice;
      });
    case "DELETE_INVOICE":
      return state.filter((invoice) => invoice.id !== action.id);
    default:
      return state;
  }
};

const userProfile = (state = {}, action) => {
  switch (action.type) {
    case "SET_USER_PROFILE":
      return action.profile;
    default:
      return state;
  }
};

const userUniqueID = (state = null, action) => {
  switch (action.type) {
    case "SET_USER_ID": {
      console.log("User ID has been setted");
      return action.id;
    }
    case "RESET_USER_ID": {
      // handle the new action type
      console.log("resetting userUniqueID to null");
      return null;
    }
    default: {
      console.log("default");
      return state;
    }
  }
};

export const rootReducer = combineReducers({
  invoices,
  userProfile,
  userUniqueID,
});
