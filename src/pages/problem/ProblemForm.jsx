import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";

const ProblemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      const fetchProblem = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(`http://localhost:8081/api/v1/problem/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setProblem(response.data);
        } catch (error) {
          console.error("Error fetching problem:", error);
        }
      };

      fetchProblem();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblem((prevProblem) => ({ ...prevProblem, [name]: value }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (id) {
        await axios.put(`http://localhost:8081/api/v1/problem/update`, problem, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.put("http://localhost:8081/api/v1/problem/add", problem, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      navigate("/problem");
    } catch (error) {
      console.error("Error saving problem:", error);
    }
  }, [problem, navigate, id]);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>{id ? "Edit Problem" : "Add Problem"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={problem.name}
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
                value={problem.description}
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

export default ProblemForm;
