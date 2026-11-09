import { useState, useContext, useRef } from "react";
import { EventContext } from "../../context/EventContext";
import "../../assets/CreateEvent.css";
import { Link } from "react-router-dom";

const CreateEvent = () => {
  const { addEvent } = useContext(EventContext);
  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
    files: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileRef = useRef(null);


  const submit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      await addEvent(event);

      setEvent({
        title: "",
        description: "",
        date: "",
        files: [],
      });

      if (fileRef.current) {
        fileRef.current.value = "";
      }

      setSuccess("Event created successfully!");

    } catch (err) {

      setError(err.message || "Failed to create event.");

    } finally {

      setLoading(false);

    }
  };
  return (

    <div className="create-event-container">

      <div className="create-event-card">


        <h2 className="create-event-title">
          Create Event
        </h2>
        <form 
          className="create-event-form"
          onSubmit={submit}
        >
          <div className="input-group">

            <label>Event Title</label>

            <input
              className="event-input"
              type="text"
              placeholder="Event Title"
              value={event.title}
              onChange={(e)=>
                setEvent({
                  ...event,
                  title:e.target.value
                })
              }
              required
            />

          </div>
          <div className="input-group">

            <label>Description</label>

            <textarea
              className="event-textarea"
              placeholder="Event Description"
              value={event.description}
              onChange={(e)=>
                setEvent({
                  ...event,
                  description:e.target.value
                })
              }
              required
            />

          </div>
          <div className="input-group">

            <label>Event Date</label>

            <input
              className="event-input"
              type="date"
              value={event.date}
              onChange={(e)=>
                setEvent({
                  ...event,
                  date:e.target.value
                })
              }
              required
            />

          </div>

          <div className="image-upload">

            <label>
              Event Images (Optional)
            </label>
            <input
              className="file-input"
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e)=>
                setEvent({
                  ...event,
                  files:Array.from(e.target.files || [])
                })
              }
            />

 <div className="back-dashboard-container">
  <Link to="/admin/dashboard">
    <button className="back-dashboard-btn">
      Back to Dashboard
    </button>
  </Link>
</div>

          </div>

          <button
            className="create-btn"
            type="submit"
            disabled={loading}
          >

            {
              loading
              ? "Creating..."
              : "Create Event"
            }

          </button>
          {
            error && 
            <p className="error-message">
              {error}
            </p>
          }
          {
            success &&
            <p className="success-message">
              {success}
            </p>
          }



        </form>


      </div>


    </div>

  );
};


export default CreateEvent;