import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";

const Device = () => {
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevices = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get('http://localhost:8081/api/v1/device', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDevices(response.data);
      } catch (error) {
        console.error('Error fetching devices:', error);
      }
    };

    fetchDevices();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8081/api/v1/device/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDevices(devices.filter((device) => device.id !== id));
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>Devices</h2>
          <Link to="/devices/new" className="btn btn-primary mb-2">Create Device</Link>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Serial</th>
                <th>Description</th>
                <th>Client</th>
                <th>Model</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id}>
                  <td>{device.name}</td>
                  <td>{device.serial}</td>
                  <td>{device.description}</td>
                  <td>{device.client.fname} {device.client.lname}</td>
                  <td>{device.model.name}</td>
                  <td>
                    <Link to={`/devices/edit/${device.id}`} className="btn btn-secondary me-2">Edit</Link>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(device.id)}
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

export default Device;
