import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";

const Ticket = () => {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get('http://localhost:8081/api/v1/ticket', {
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

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8081/api/v1/ticket/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTickets(tickets.filter(ticket => ticket.id !== id));
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>Tickets</h2>
          <button
            className="btn btn-primary mb-3"
            onClick={() => navigate("/ticket/create")}
          >
            Create Ticket
          </button>
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
                      className="btn btn-success"
                      onClick={() => navigate(`/ticket/edit/${ticket.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger ms-2"
                      onClick={() => handleDelete(ticket.id)}
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

export default Ticket;
