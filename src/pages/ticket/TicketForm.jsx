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
    device: {},
    client: {},
  });
  const [clients, setClients] = useState([]);
  const [devices, setDevices] = useState([]);
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchClients = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:8081/api/v1/users/clients", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

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

    fetchClients();
    fetchProblems();
  }, []);

  useEffect(() => {
    if (ticket.client.id) {
      const fetchDevices = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(`http://localhost:8081/api/v1/device/client/${ticket.client.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setDevices(response.data);
        } catch (error) {
          console.error("Error fetching devices:", error);
        }
      };

      fetchDevices();
    }
  }, [ticket.client.id]);

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
          setTicket(response.data);
        } catch (error) {
          console.error("Error fetching ticket:", error);
        }
      };

      fetchTicket();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket((prevTicket) => ({ ...prevTicket, [name]: value }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (id) {
        await axios.put(`http://localhost:8081/api/v1/ticket/update`, ticket, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.put("http://localhost:8081/api/v1/ticket/add", ticket, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      navigate("/ticket");
    } catch (error) {
      console.error("Error saving ticket:", error);
    }
  }, [ticket, navigate, id]);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>{id ? "Edit Ticket" : "Add Ticket"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Issue</label>
              <select
                className="form-control"
                name="issue"
                value={ticket.issue}
                onChange={handleChange}
                required
              >
                <option value="">Select an Issue</option>
                {problems.map((problem) => (
                  <option key={problem.id} value={problem.name}>
                    {problem.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Other</label>
              <input
                type="text"
                className="form-control"
                name="other"
                value={ticket.other}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Client</label>
              <select
                className="form-control"
                name="client"
                value={ticket.client.id || ""}
                onChange={(e) => {
                  const selectedClient = clients.find((client) => client.id === parseInt(e.target.value));
                  setTicket((prevTicket) => ({ ...prevTicket, client: selectedClient }));
                }}
                required
              >
                <option value="">Select a Client</option>
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
                className="form-control"
                name="device"
                value={ticket.device.id || ""}
                onChange={(e) => {
                  const selectedDevice = devices.find((device) => device.id === parseInt(e.target.value));
                  setTicket((prevTicket) => ({ ...prevTicket, device: selectedDevice }));
                }}
                required
              >
                <option value="">Select a Device</option>
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
                className="form-control"
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
