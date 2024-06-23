import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";

const Problem = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:8081/api/v1/problem", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProblems(response.data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    fetchProblems();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8081/api/v1/problem/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProblems(problems.filter((problem) => problem.id !== id));
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>Problems</h2>
          <button
            className="btn btn-primary mb-3"
            onClick={() => navigate("/problems/new")}
          >
            Create Problem
          </button>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr key={problem.id}>
                  <td>{problem.name}</td>
                  <td>{problem.description}</td>
                  <td>
                    <button
                      className="btn btn-success me-2"
                      onClick={() => navigate(`/problems/edit/${problem.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(problem.id)}
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

export default Problem;
