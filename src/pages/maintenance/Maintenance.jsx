import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";

const Maintenance = () => {
  const [maintenances, setMaintenances] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaintenances = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get('http://localhost:8081/api/v1/maintenance/in-progress', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMaintenances(response.data);
      } catch (error) {
        console.error('Error fetching maintenances:', error);
      }
    };

    fetchMaintenances();
  }, []);

  const handleDelete = async (maintenance) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8081/api/v1/maintenance/delete/${maintenance.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMaintenances(maintenances.filter(m => m.id!== maintenance.id));
    } catch (error) {
      console.error('Error deleting maintenance:', error);
    }   
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>Maintenances</h2>

          <Link to="/maintenance/create" className="btn btn-primary mb-2">Create Maintenance</Link>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Technician</th>
                <th>Client</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {maintenances.map((maintenance) => (
                <tr key={maintenance.id}>
                  <td>{maintenance.title}</td>
                  <td>{maintenance.technician?.fname} {maintenance.technician?.lname}</td>
                  <td>{maintenance.client.fname} {maintenance.client.lname}</td>
                  <td>{new Date(maintenance?.startAt).toLocaleString()}</td>
                  <td>{new Date(maintenance?.endAt).toLocaleString()}</td>
                  <td>{maintenance.status}</td>
                  <td>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(maintenance)}
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

export default Maintenance;