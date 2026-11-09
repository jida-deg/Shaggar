import { useContext } from "react";
import { Link } from "react-router-dom";
import { EventContext } from "../../context/EventContext";
import "../../assets/ManageEvent.css";

const ManageEvents = () => {
  const { events, deleteEvent } = useContext(EventContext);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await deleteEvent(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="manage-events-page">
      <h2>Manage Events</h2>

<div className="manage-event-actions">

  <Link to="/admin/events/create">
    <button className="create-event-btn">
      Create New Event
    </button>
  </Link>

  <Link to="/admin/dashboard">
    <button className="back-dashboard-btn">
      Back to Dashboard
    </button>
  </Link>

</div>


  
        
      
      
      <hr />

      {events.map((event) => (
        <div key={event._id || event.id} className="manage-events-card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>{event.date}</p>

          <Link to={`/admin/events/edit/${event._id || event.id}`}>
            <button>Edit</button>
          </Link>

          <button onClick={() => handleDelete(event._id || event.id)}>
            Delete
          </button>
        </div>
        
      ))}
    </div>
  );
};

export default ManageEvents;