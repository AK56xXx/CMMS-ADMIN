import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";

const MaintenanceForm = () => {
  const { ticketId } = useParams(); // Use useParams to get the ticketId
  const navigate = useNavigate();

  const [maintenance, setMaintenance] = useState({
    title: "",
    technicianId: "",
    clientId: "",
    deviceId: "",
    msdate: "",
    userResponse: "NONE",
    status: "IN_PROGRESS",
  });

  const [clients, setClients] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isDeviceDropdownDisabled, setIsDeviceDropdownDisabled] = useState(true);

  useEffect(() => {
    const fetchClientsAndTechnicians = async () => {
      const token = localStorage.getItem("token");
      try {
        const clientsResponse = await axios.get(
          "http://localhost:8081/api/v1/users/clients",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClients(clientsResponse.data);

        const techniciansResponse = await axios.get(
          "http://localhost:8081/api/v1/users/technicians",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTechnicians(techniciansResponse.data);
      } catch (error) {
        console.error("Error fetching clients and technicians:", error);
      }
    };

    fetchClientsAndTechnicians();
  }, []);

  useEffect(() => {
    if (ticketId) {
      // Fetch ticket data and set maintenance state if ticketId is provided
      const fetchTicketData = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(`http://localhost:8081/api/v1/ticket/${ticketId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const ticket = response.data;
          setMaintenance((prev) => ({
            ...prev,
            title: `Maintenance for ${ticket.issue}`,
            clientId: ticket.client.id,
            deviceId: ticket.device.id,
            ticket: {id: ticket.id}
          }));
          fetchDevices(ticket.client.id, ticket.device.id);
        } catch (error) {
          console.error("Error fetching ticket data:", error);
        }
      };

      fetchTicketData();
    }
  }, [ticketId]);

  const fetchDevices = async (clientId, selectedDeviceId = null) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(
        `http://localhost:8081/api/v1/device/client/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDevices(response.data);
      setIsDeviceDropdownDisabled(false);
      if (selectedDeviceId) {
        setMaintenance((prev) => ({ ...prev, deviceId: selectedDeviceId }));
      }
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const padZero = (num) => {
    return (num < 10 ? "0" : "") + num;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'technicianId') {
      setMaintenance((prev) => ({ ...prev, technicianId: parseInt(value) }));
    } else if (name === 'clientId') {
      setMaintenance((prev) => ({ ...prev, clientId: parseInt(value) }));
      setMaintenance((prev) => ({ ...prev, deviceId: '' }));
      setIsDeviceDropdownDisabled(true);
      fetchDevices(value);
    } else if (name === 'deviceId') {
      setMaintenance((prev) => ({ ...prev, deviceId: parseInt(value) }));
    } else if (name === 'msdate') {
      const selectedDate = new Date(value);
      const formattedDate = `${selectedDate.getFullYear()}-${padZero(selectedDate.getMonth() + 1)}-${padZero(selectedDate.getDate())}T00:00:00`;
      setMaintenance((prev) => ({ ...prev, mdate: formattedDate, [name]: value }));
    } else {
      setMaintenance((prev) => ({ ...prev, [name]: value }));
    }
    console.log("Updated maintenance state:", maintenance); // Add this log
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const maintenanceData = {
        ...maintenance,
        technician: { id: parseInt(maintenance.technicianId) },   // we need to do it like this to be able to read the id, 
        device: { id: parseInt(maintenance.deviceId) },           // technician, client and device are a nested object (*)
        client: { id: parseInt(maintenance.clientId) },
      };
      console.log("Data to be submitted:", maintenanceData); 
      await axios.post(
        'http://localhost:8081/api/v1/maintenance/create',
        maintenanceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (ticketId) {
        // Fetch the existing ticket data
        const response = await axios.get(`http://localhost:8081/api/v1/ticket/${ticketId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const existingTicket = response.data;

        // Update the ticket status to "CLOSED"
        await axios.put(
          `http://localhost:8081/api/v1/ticket/update`,
          {
            ...existingTicket,
            status: "CLOSED",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      navigate('/maintenance');
    } catch (error) {
      console.error('Error saving maintenance:', error);
    }
  }, [maintenance, navigate, ticketId]);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>Create Maintenance</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={maintenance.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Technician</label>
              <select
                className="form-select"
                name="technicianId"
                value={maintenance.technicianId}
                onChange={handleChange}
                required
              >
                <option value="">Select Technician</option>
                {technicians.map((technician) => (
                  <option key={technician.id} value={technician.id}>
                    {technician.fname} {technician.lname}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Client</label>
              <select
                className="form-select"
                name="clientId"
                value={maintenance.clientId}
                onChange={handleChange}
                required
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.fname} {client.lname}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Device</label>
              <select
                className="form-select"
                name="deviceId"
                value={maintenance.deviceId}
                onChange={handleChange}
                disabled={isDeviceDropdownDisabled}
                required
              >
                <option value="">Select Device</option>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Maintenance Date</label>
              <input
                type="date"
                className="form-control"
                name="msdate"
                value={maintenance.msdate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]} // Restrict to future dates
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={maintenance.status}
                onChange={handleChange}
                required
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceForm;
