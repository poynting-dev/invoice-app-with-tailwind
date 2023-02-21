import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { rootReducer } from "./reducers/handleDataReducers";

export const store = createStore(
  rootReducer,
  { invoices: [], userProfile: [], userUniqueID: null },
  applyMiddleware(thunk)
);
