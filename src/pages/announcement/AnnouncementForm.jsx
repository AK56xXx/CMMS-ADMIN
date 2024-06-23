import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";

const AnnouncementForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [announcement, setAnnouncement] = useState({
    title: "",
    content: "",
    admin: {id: user.id}
  });


useEffect(() => {
    if (id) {
      const fetchAnnouncement = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(`http://localhost:8081/api/v1/announcement/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setAnnouncement(response.data);
        } catch (error) {
          console.error("Error fetching announcement:", error);
        }
      };

      fetchAnnouncement();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnnouncement((prevAnnouncement) => ({ ...prevAnnouncement, [name]: value }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (id) {
        await axios.put(`http://localhost:8081/api/v1/announcement/update`, announcement, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post("http://localhost:8081/api/v1/announcement/add", announcement, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      navigate("/announcement");
    } catch (error) {
      console.error("Error saving announcement:", error);
    }
  }, [announcement, navigate, id]);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>{id ? "Edit Announcement" : "Add Announcement"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={announcement.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Content</label>
              <input
                type="text"
                className="form-control"
                name="content"
                value={announcement.content}
                onChange={handleChange}
              />
            </div>
            
            <button type="submit" className="btn btn-primary">
              {id ? "Update" : "Create"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementForm;


  
