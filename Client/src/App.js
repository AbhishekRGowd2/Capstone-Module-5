import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import BookAppointment from './pages/BookAppointment';
import UpdateProfile from './pages/UpdateProfile';
import GetAppointments from './pages/GetAppointments';
import Services from './pages/Services';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './PrivateRoute'; // ✅ import here

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected routes with Layout */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<UpdateProfile />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route path="/get-appointment" element={<GetAppointments />} />
          <Route path="/get-services" element={<Services />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
