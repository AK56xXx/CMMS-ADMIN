import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { Modal, Button } from 'react-bootstrap';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import bootstrap CSS
import './customCalendar.css'; // Custom CSS for calendar styling

const localizer = momentLocalizer(moment);
const allViews = Object.values(Views);

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get('http://localhost:8081/api/v1/maintenance/in-progress', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedEvents = response.data.map(event => ({
        title: event.title,
        start: new Date(event.startAt),
        end: new Date(event.endAt),
        technician: `${event.technician.fname} ${event.technician.lname}`,
        client: `${event.client.fname} ${event.client.lname}`,
        device: event.device.name,
        description: event.description,
        status: event.status
      }));

      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const formats = {
    timeGutterFormat: 'HH:mm', //24h format
    timeColumnFormat: 'HH:mm', 
    selectRangeFormat: ({ start, end }) => `${start.format('HH:mm')} - ${end.format('HH:mm')}`,
    agendaHeaderFormat: ({start, end}) => {
      return (moment.utc(start).format('DD/MM/YYYY') + ' - ' + moment.utc(end).format('DD/MM/YYYY') );
    }
  };





  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div style={{ height: 1500 }}>
          <Calendar
            localizer={localizer}
            events={events}
            step={60}
            views={allViews}
            defaultView='week'
            popup={false}
            onSelectEvent={handleEventClick}
            min={new Date(2024, 1, 0, 8, 0, 0)}
            max={new Date(2024, 1, 0, 19, 0, 0)}
            formats={formats}
          />
        </div>

        {selectedEvent && (
          <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedEvent.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>Device:</strong> {selectedEvent.device}</p>
              <p><strong>Technician:</strong> {selectedEvent.technician}</p>
              <p><strong>Client:</strong> {selectedEvent.client}</p>
              <p><strong>Start:</strong> {selectedEvent.start.toString()}</p>
              <p><strong>End:</strong> {selectedEvent.end.toString()}</p>
              <p><strong>Description:</strong> {selectedEvent.description}</p>
              <p><strong>Status:</strong> {selectedEvent.status}</p>
        
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Home;
