import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";

const TicketForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState({
    issue: "",
    other: "",
    status: "OPEN",
    clientId: "",
    deviceId: "",
  });

  const [clients, setClients] = useState([]);
  const [devices, setDevices] = useState([]);
  const [isDeviceDropdownDisabled, setIsDeviceDropdownDisabled] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          "http://localhost:8081/api/v1/users/clients",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchTicket = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(`http://localhost:8081/api/v1/ticket/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const { issue, other, status, client, device } = response.data;
          setTicket({
            issue,
            other,
            status,
            clientId: client.id,
            deviceId: device.id,
          });
          fetchDevices(client.id);
        } catch (error) {
          console.error('Error fetching ticket:', error);
        }
      };

      fetchTicket();
    }
  }, [id]);

  const fetchDevices = async (clientId) => {
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
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'clientId') {
      setTicket((prev) => ({ ...prev, clientId: value }));
      fetchDevices(value);
      setIsDeviceDropdownDisabled(false);
    } else {
      setTicket((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const ticketData = {
      id: id,
      ...ticket,
      client: { id: parseInt(ticket.clientId) },
      device: { id: parseInt(ticket.deviceId) },
    };

    try {
      if (id) {
        await axios.put(
          `http://localhost:8081/api/v1/ticket/update`,
          ticketData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          'http://localhost:8081/api/v1/ticket/create',
          ticketData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      navigate('/ticket');
    } catch (error) {
      console.error('Error saving ticket:', error);
    }
  }, [ticket, id, navigate]);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>{id ? "Edit Ticket" : "Create Ticket"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Issue</label>
              <input
                type="text"
                className="form-control"
                name="issue"
                value={ticket.issue}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Other</label>
              <input
                type="text"
                className="form-control"
                name="other"
                value={ticket.other}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Client</label>
              <select
                className="form-select"
                name="clientId"
                value={ticket.clientId}
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
                value={ticket.deviceId}
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
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={ticket.status}
                onChange={handleChange}
                required
              >
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="CLOSED">CLOSED</option>
              </select>
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

export default TicketForm;
