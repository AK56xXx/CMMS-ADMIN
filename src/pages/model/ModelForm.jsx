import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";

const ModelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [model, setModel] = useState({
    name: "",
    description: "",
    version: "",
    manufacturer: "",
    image: null,
  });

  useEffect(() => {
    if (id) {
      const fetchModel = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(`http://localhost:8081/api/v1/model/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setModel(response.data);
        } catch (error) {
          console.error("Error fetching model:", error);
        }
      };

      fetchModel();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModel((prevModel) => ({ ...prevModel, [name]: value }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (id) {
        await axios.put(`http://localhost:8081/api/v1/model/update`, model, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.put("http://localhost:8081/api/v1/model/add", model, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      navigate("/model");
    } catch (error) {
      console.error("Error saving model:", error);
    }
  }, [model, navigate, id]);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>{id ? "Edit Model" : "Add Model"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={model.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={model.description}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Version</label>
              <input
                type="text"
                className="form-control"
                name="version"
                value={model.version}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Manufacturer</label>
              <input
                type="text"
                className="form-control"
                name="manufacturer"
                value={model.manufacturer}
                onChange={handleChange}
                required
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

export default ModelForm;
