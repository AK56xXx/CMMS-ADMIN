import React, { useState } from'react';
import ReactDOM from'react-dom';
import { Calendar,  momentLocalizer , Views } from'react-big-calendar';
import moment from'moment';
//import globalize from 'globalize'
import'react-big-calendar/lib/css/react-big-calendar.css';
import events from './events';
//moment.locale('en-GB');
const localizer =  momentLocalizer (moment);



const allViews = Object.values(Views);

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalEvents, setModalEvents] = useState([]);

  const onShowMore = (events, date) => {
    setShowModal(true);
    setModalEvents(events);



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
    <div style={{ height: 700 }}>
      <Calendar
        localizer={localizer}
        events={events} //take the events data
        step={60}
        views={allViews}
        defaultView='week'

     //   defaultDate={new Date(2015, 3, 1)}
        popup={false}
        onShowMore={onShowMore}
        min={new Date(2024, 1, 0, 8, 0, 0)} // start at 08:00
        max={new Date(2024, 1, 0, 19, 0, 0)} //end at 19:00
        formats={formats}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));