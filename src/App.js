import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Pending from "./pages/pending/Pending";
import Inprogress from "./pages/inprogress/Inprogress";
import User from "./pages/user/User";
import Maintenance from "./pages/maintenance/Maintenance";
import Ticket from "./pages/ticket/Ticket";
import Device from "./pages/device/Device";
import Model from "./pages/model/Model";
import Problem from "./pages/problem/Problem";
import Feedback from "./pages/feedback/Feedback";
import Announcement from "./pages/announcement/Announcement";
import Page404 from "./pages/notfound/Page404";
import MaintenanceForm from "./pages/maintenance/MaintenanceForm";
import './App.css';
function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem('token'); // Adjust the logic as per your auth mechanism

  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  const isAuthenticated = !!localStorage.getItem('token'); // Adjust the logic as per your auth mechanism

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Default route redirects to home if authenticated, otherwise to login */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />} />

          {/* Login route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/pending" 
            element={
              <ProtectedRoute>
                <Pending />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/inprogress" 
            element={
              <ProtectedRoute>
                <Inprogress />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user" 
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/maintenance" 
            element={
              <ProtectedRoute>
                <Maintenance />
              </ProtectedRoute>
            } 
          />

           <Route path="/maintenance/create" element={<MaintenanceForm />} />
           <Route path="/maintenance/create/:ticketId" element={<MaintenanceForm />} />

          <Route 
            path="/ticket" 
            element={
              <ProtectedRoute>
                <Ticket />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/device" 
            element={
              <ProtectedRoute>
                <Device />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/model" 
            element={
              <ProtectedRoute>
                <Model />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/problem" 
            element={
              <ProtectedRoute>
                <Problem />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/feedback" 
            element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/announcement" 
            element={
              <ProtectedRoute>
                <Announcement />
              </ProtectedRoute>
            } 
          />

          {/* Fallback route for 404 */}
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
