import React, { Fragment } from 'react'
import { Form, Button, Card, Container } from 'react-bootstrap'
import Signup from './Signup'
import Dashboard from './Dashboard'
import Login from './Login'
import { AuthProvider } from './contexts/AuthContext'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Outlet,
} from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import ForgotPassword from './ForgotPassword'
import UpdateProfile from './UpdateProfile'

function App() {
    return (
        <Router>
            <Fragment>
                <AuthProvider>
                    <Routes>
                        <Route exact path="/" element={<PrivateRoute />}>
                            <Route exact path="/" element={<Dashboard />} />
                            <Route
                                path="/update-profile"
                                element={<UpdateProfile />}
                            />
                        </Route>

                        <Route path="/signup" element={<Signup />} />
                        <Route path="/login" element={<Login />} />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                    </Routes>
                </AuthProvider>
            </Fragment>
        </Router>
    )
}

export default App
