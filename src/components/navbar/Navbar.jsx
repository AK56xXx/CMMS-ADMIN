import React from "react";
import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <div className="navbar-brand">Your Brand</div>
        <div className="collapse navbar-collapse">
          <div className="navbar-nav ms-auto">
            <div className="nav-item search">
              <input type="text" className="form-control" placeholder="Search..." />
              <SearchOutlinedIcon />
            </div>
            <div className="nav-item dropdown">
              <div className="nav-link">
                <LanguageOutlinedIcon className="icon" />
                English
              </div>
            </div>
            <div className="nav-item dropdown">
              <div className="nav-link">
                {user.username}
                <img
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                  alt="avatar"
                  className="avatar"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
