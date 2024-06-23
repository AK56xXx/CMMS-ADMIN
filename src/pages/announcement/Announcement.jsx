import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModels = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:8081/api/v1/announcement", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8081/api/v1/announcement/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>Announcement</h2>
          <button
            className="btn btn-primary mb-3"
            onClick={() => navigate("/announcements/new")}
          >
            Create Announcement
          </button>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th>By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement) => (
                <tr key={announcement.id}>
                  <td>{announcement.title}</td>
                  <td>{announcement.content}</td>
                  <td>{announcement.admin.fname + " " + announcement.admin.lname}</td>
                  <td>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => navigate(`/announcements/edit/${announcement.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(announcement.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Announcement;
