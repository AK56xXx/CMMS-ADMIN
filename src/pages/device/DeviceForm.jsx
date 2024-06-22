import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { DateTime } from 'luxon';
import "../../home.scss";

const DeviceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [device, setDevice] = useState({
    name: "",
    serial: "",
    description: "",
    ipAddress: "",
    macAddress: "",
    purchaseDate: "",
    repair_nbr: 0,
    clientId: "",
    modelId: "",
    eosdate: "",
  });

  const [clients, setClients] = useState([]);
  const [models, setModels] = useState([]);

  useEffect(() => {
    const fetchClientsAndModels = async () => {
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

        const modelsResponse = await axios.get(
          "http://localhost:8081/api/v1/model",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setModels(modelsResponse.data);
      } catch (error) {
        console.error("Error fetching clients and models:", error);
      }
    };

    fetchClientsAndModels();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchDevice = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(`http://localhost:8081/api/v1/device/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const {
            name, serial, description, ipAddress, macAddress, purchaseDate, repair_nbr, client, model, eosdate
          } = response.data;
          setDevice({
            name,
            serial,
            description,
            ipAddress,
            macAddress,
            purchaseDate: purchaseDate ? purchaseDate.split("T")[0] : "",
            repair_nbr,
            clientId: client.id,
            modelId: model.id,
            eosdate: eosdate ? eosdate.split("T")[0] : "",
          });
        } catch (error) {
          console.error('Error fetching device:', error);
        }
      };

      fetchDevice();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDevice((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async (e) => {

    e.preventDefault();
    const token = localStorage.getItem('token');
    const deviceData = {
      id: id,
      ...device,
      client: { id: parseInt(device.clientId) },
      model: { id: parseInt(device.modelId) },
      purchaseDate: device.purchaseDate + "T00:00:00", // add default time component
      eosdate: device.eosdate + "T00:00:00", // add default time component
    };

    // Ensure that device.purchaseDate and device.eosdate contain a valid date
    if (!device.purchaseDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        deviceData.purchaseDate = new Date().toISOString().split('T')[0] + "T00:00:00";
    }
    if (!device.eosdate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        deviceData.eosdate = new Date().toISOString().split('T')[0] + "T00:00:00";
    }
  
    try {
      if (id) {
        await axios.put(
          `http://localhost:8081/api/v1/device/update`,
          deviceData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.put(
          'http://localhost:8081/api/v1/device/add',
          deviceData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      navigate('/device');
    } catch (error) {
      console.error('Error saving device:', error);
    }
  }, [device, id, navigate]);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>{id ? "Edit Device" : "Create Device"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={device.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Serial</label>
              <input
                type="text"
                className="form-control"
                name="serial"
                value={device.serial}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                className="form-control"
                name="description"
                value={device.description}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">IP Address</label>
              <input
                type="text"
                className="form-control"
                name="ipAddress"
                value={device.ipAddress}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">MAC Address</label>
              <input
                type="text"
                className="form-control"
                name="macAddress"
                value={device.macAddress}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Purchase Date</label>
              <input
                type="date"
                className="form-control"
                name="purchaseDate"
                value={device.purchaseDate}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Repair Number</label>
              <input
                type="number"
                className="form-control"
                name="repair_nbr"
                value={device.repair_nbr}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Client</label>
              <select
                className="form-select"
                name="clientId"
                value={device.clientId}
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
              <label className="form-label">Model</label>
              <select
                className="form-select"
                name="modelId"
                value={device.modelId}
                onChange={handleChange}
                required
              >
                <option value="">Select Model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">EOS Date</label>
              <input
                type="date"
                className="form-control"
                name="eosdate"
                value={device.eosdate}
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

export default DeviceForm;
