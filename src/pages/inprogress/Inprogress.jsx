import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";

const Inprogress = () => {
  const [maintenances, setMaintenances] = useState([]);

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

  const handleClose = async (maintenance) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(`http://localhost:8081/api/v1/maintenance/update`, 
        {
          ...maintenance,
          status: "CLOSED"
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMaintenances(maintenances.filter(m => m.id !== maintenance.id));
    } catch (error) {
      console.error('Error updating maintenance:', error);
    }
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>In Progress Maintenances</h2>
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
                  <td>{maintenance.technician.fname} {maintenance.technician.lname}</td>
                  <td>{maintenance.client.fname} {maintenance.client.lname}</td>
                  <td>{new Date(maintenance.startAt).toLocaleString()}</td>
                  <td>{new Date(maintenance.endAt).toLocaleString()}</td>
                  <td>{maintenance.status}</td>
                  <td>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleClose(maintenance)}
                    >
                      Close Maintenance
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

export default Inprogress;
