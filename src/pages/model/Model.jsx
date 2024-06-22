import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";

const Model = () => {
  const [models, setModels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModels = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:8081/api/v1/model", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setModels(response.data);
      } catch (error) {
        console.error("Error fetching models:", error);
      }
    };

    fetchModels();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8081/api/v1/model/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModels(models.filter((model) => model.id !== id));
    } catch (error) {
      console.error("Error deleting model:", error);
    }
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>Models</h2>
          <button
            className="btn btn-primary mb-3"
            onClick={() => navigate("/models/new")}
          >
            Add Model
          </button>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Version</th>
                <th>Manufacturer</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {models.map((model) => (
                <tr key={model.id}>
                  <td>{model.name}</td>
                  <td>{model.description}</td>
                  <td>{model.version}</td>
                  <td>{model.manufacturer}</td>
                  <td>
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => navigate(`/models/edit/${model.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(model.id)}
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

export default Model;
