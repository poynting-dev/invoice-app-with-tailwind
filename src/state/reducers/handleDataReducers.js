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

export const rootReducer = combineReducers({
  invoices,
  userProfile,
});
