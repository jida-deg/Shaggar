import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { EventContext } from "../../context/EventContext";
import "../../assets/DeleteEvent.css";

const DeleteEvents = () => {
  const { events, deleteEvent, error } = useContext(EventContext);
  const [deletingId, setDeletingId] = useState(null);
  const [localError, setLocalError] = useState("");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setLocalError("");
    setDeletingId(id);
    try {
      await deleteEvent(id);
    } catch (err) {
      setLocalError(err?.response?.data?.message || err.message || "Failed to delete event.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="delete-events">
      <h2>Delete Events</h2>
      <Link to="/admin/dashboard">
        <button>Back to Dashboard</button>
      </Link>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {localError && <p style={{ color: "red" }}>{localError}</p>}
      {!events.length && <p>No events available.</p>}
      {events.map((event) => (
        <div key={event._id || event.id} className="event-card">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <p>{event.eventDate || event.date}</p>
          <button
            onClick={() => handleDelete(event._id || event.id)}
            disabled={deletingId === (event._id || event.id)}
          >
            {deletingId === (event._id || event.id) ? "Deleting..." : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default DeleteEvents;