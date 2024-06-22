import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [maintenance, setMaintenance] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:8081/api/v1/feedback", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleView = async (feedback) => {
    setSelectedFeedback(feedback);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`http://localhost:8081/api/v1/maintenance/${feedback.maintenance.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMaintenance(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching maintenance:", error);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedFeedback(null);
    setMaintenance(null);
  };

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>Feedbacks</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Client</th>
                <th>Maintenance Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((feedback) => (
                <tr key={feedback.id}>
                  <td>{feedback.subject}</td>
                  <td>{feedback.client.fname} {feedback.client.lname}</td>
                  <td>{feedback.maintenance.title}</td>
                  <td>
                    <Button variant="primary" onClick={() => handleView(feedback)}>
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedFeedback && maintenance && (
          <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Feedback Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>Feedback</h5>
              <p><strong>Subject:</strong> {selectedFeedback.subject}</p>
              <p><strong>Client:</strong> {selectedFeedback.client.fname} {selectedFeedback.client.lname}</p>

              <h5>Maintenance</h5>
              <p><strong>Title:</strong> {maintenance.title}</p>
              <p><strong>Description:</strong> {maintenance.description}</p>
              <p><strong>Technician:</strong> {maintenance.technician.fname} {maintenance.technician.lname}</p>
              <p><strong>Status:</strong> {maintenance.status}</p>
              <p><strong>Device:</strong> {maintenance.device.name}</p> 
              <p><strong>Model:</strong> {maintenance.device.model.name}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Feedback;
