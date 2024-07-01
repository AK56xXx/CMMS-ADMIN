import React from "react";
import "./sidebar.scss";
import {
  Dashboard as DashboardIcon,
  PersonOutline as PersonOutlineIcon,
  ExitToApp as ExitToAppIcon,
  TripOrigin as TripOriginIcon,
  Memory as MemoryIcon,
  ThumbUpAlt as ThumbUpAltIcon,
  Campaign as CampaignIcon,
  ConfirmationNumber as ConfirmationNumberIcon,
  BugReport as BugReportIcon,
  Build as BuildIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8081/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <Link to="/home" className="text-decoration-none">
          <span className="sidebar-logo">Admin Panel</span>
        </Link>
      </div>
      <hr />
      <div className="sidebar-center">
        <ul className="nav flex-column">
          <li className="nav-item">
            <p className="nav-link sidebar-title">MAIN</p>
          </li>
          <li className="nav-item">
            <Link to="/home" className="nav-link d-flex align-items-center">
              <DashboardIcon className="sidebar-icon" />
              <span className="ms-2">Calendar</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/pending" className="nav-link d-flex align-items-center">
              <DashboardIcon className="sidebar-icon" />
              <span className="ms-2">Pending tickets</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/inprogress" className="nav-link d-flex align-items-center">
              <DashboardIcon className="sidebar-icon" />
              <span className="ms-2">In progress (MNT)</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/feedback" className="nav-link d-flex align-items-center">
              <ThumbUpAltIcon className="sidebar-icon" />
              <span className="ms-2">Feedbacks</span>
            </Link>
          </li>
          <li className="nav-item">
            <p className="nav-link sidebar-title">Management</p>
          </li>
          <li className="nav-item">
            <Link to="/user" className="nav-link d-flex align-items-center">
              <PersonOutlineIcon className="sidebar-icon" />
              <span className="ms-2">Users</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/maintenance" className="nav-link d-flex align-items-center">
              <BuildIcon className="sidebar-icon" />
              <span className="ms-2">Maintenance</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/ticket" className="nav-link d-flex align-items-center">
              <ConfirmationNumberIcon className="sidebar-icon" />
              <span className="ms-2">Tickets</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/device" className="nav-link d-flex align-items-center">
              <MemoryIcon className="sidebar-icon" />
              <span className="ms-2">Devices</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/model" className="nav-link d-flex align-items-center">
              <TripOriginIcon className="sidebar-icon" />
              <span className="ms-2">Models</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/problem" className="nav-link d-flex align-items-center">
              <BugReportIcon className="sidebar-icon" />
              <span className="ms-2">Problems</span>
            </Link>
          </li>
         
          <li className="nav-item">
            <Link to="/announcement" className="nav-link d-flex align-items-center">
              <CampaignIcon className="sidebar-icon" />
              <span className="ms-2">Announcement</span>
            </Link>
          </li>
          <li className="nav-item">
            <div onClick={handleLogout} className="nav-link d-flex align-items-center" style={{ cursor: "pointer" }}>
              <ExitToAppIcon className="sidebar-icon" />
              <span className="ms-2">Logout</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
