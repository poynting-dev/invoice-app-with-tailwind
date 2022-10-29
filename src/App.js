import React, { Fragment } from "react";
import { Form, Button, Card, Container } from "react-bootstrap";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { AuthProvider } from "./contexts/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import "bootstrap/dist/css/bootstrap.min.css";
import InvoiceList from "./components/Account/InvoiceList";
import ViewInvoice from "./components/Account/ViewInvoice";
import SideBar from "./components/Account/SideBar";

function App() {
  return (
    <Router>
      <Fragment>
        <AuthProvider>
          <Routes>
            <Route exact path="/" element={<PrivateRoute />}>
              <Route
                exact
                path="/"
                element={<SideBar content={<Dashboard />} />}
              />
              <Route
                exact
                path="/all"
                element={<SideBar content={<InvoiceList />} />}
              />
              <Route
                path="/view/:id"
                element={<SideBar content={<ViewInvoice />} />}
              />
              <Route path="/update-profile" element={<UpdateProfile />} />
            </Route>

            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </AuthProvider>
      </Fragment>
    </Router>
  );
}

export default App;
