import React from "react";
import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import TripOriginIcon from '@mui/icons-material/TripOrigin';
import MemoryIcon from '@mui/icons-material/Memory';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import CampaignIcon from '@mui/icons-material/Campaign';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import BugReportIcon from '@mui/icons-material/BugReport';
import BuildIcon from '@mui/icons-material/Build';
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Perform logout API call
      await fetch("http://localhost:8081/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add any additional headers if required
        },
        credentials: "include", // Important for cookies/session
      });

      // Clear localStorage or sessionStorage as needed
      localStorage.removeItem('token'); // Remove token from localStorage
      localStorage.removeItem('user');

      // Navigate to login page or any other desired page
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
      // Handle logout failure if needed
    }
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/home" style={{ textDecoration: "none" }}>
          <span className="logo">Admin Panel</span>
        </Link>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/home" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Calendar</span>
            </li>
          </Link>

          <Link to="/pending" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Pending tickets</span>
            </li>
          </Link>

          <Link to="/inprogress" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>In progress (MNT)</span>
            </li>
          </Link>

          <p className="title">Management</p>
          <Link to="/user" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>
          <Link to="/maintenance" style={{ textDecoration: "none" }}>
            <li>
              <BuildIcon className="icon" />
              <span>Maintenance</span>
            </li>
          </Link>
          <Link to="/ticket" style={{ textDecoration: "none" }}>
            <li>
              <ConfirmationNumberIcon className="icon" />
              <span>Tickets</span>
            </li>
          </Link>

          <Link to="/device" style={{ textDecoration: "none" }}>
            <li>
              <MemoryIcon className="icon" />
              <span>Devices</span>
            </li>
          </Link>

          <Link to="/model" style={{ textDecoration: "none" }}>
            <li>
              <TripOriginIcon className="icon" />
              <span>Models</span>
            </li>
          </Link>

          <Link to="/problem" style={{ textDecoration: "none" }}>
            <li>
              <BugReportIcon className="icon" />
              <span>Problems</span>
            </li>
          </Link>

          <Link to="/feedback" style={{ textDecoration: "none" }}>
            <li>
              <ThumbUpAltIcon className="icon" />
              <span>Feedbacks</span>
            </li>
          </Link>

          <Link to="/announcement" style={{ textDecoration: "none" }}>
            <li>
              <CampaignIcon className="icon" />
              <span>Announcement</span>
            </li>
          </Link>

          <li onClick={handleLogout} style={{ cursor: "pointer" }}>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
