import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";
//import 'bootstrap/dist/css/bootstrap.min.css';

const Pending = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get('http://localhost:8081/api/v1/ticket/open', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  const handleCreateMaintenance = (ticket) => {
    // Handle the "Create maintenance" button click
    console.log('Create maintenance for:', ticket);
    // Add your logic here
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>Pending Tickets</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Issue</th>
                <th>Other</th>
                <th>Status</th>
                <th>Client</th>
                <th>Device</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.issue}</td>
                  <td>{ticket.other}</td>
                  <td>{ticket.status}</td>
                  <td>{ticket.client.fname} {ticket.client.lname}</td>
                  <td>{ticket.device.name}</td>
                  <td>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleCreateMaintenance(ticket)}
                    >
                      Create maintenance
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

export default Pending;
