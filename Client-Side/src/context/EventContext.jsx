import { createContext, useState, useEffect } from "react";
import api from "../API/axios";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/event/all");
      setEvents(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

const addEvent = async (event) => {
  try {
    const form = new FormData();

    form.append("title", event.title);
    form.append("description", event.description);
    form.append("eventDate", event.date);

    if (event.files && event.files.length > 0) {
      event.files.forEach((file) => {
        form.append("files", file);
      });
    }

    const res = await api.post("/event/create", form);


    setEvents((prev) => [
      ...prev,
      res.data
    ]);


    return res.data;


  } catch (err) {

    console.log(
      "CREATE EVENT ERROR:",
      err.response?.data
    );

    throw err;

  }
};

const updateEvent = async (id, updatedEvent) => {
  try {

    const res = await api.put(
      `/event/${id}`,
      updatedEvent
    );

    setEvents((prev) =>
      prev.map((event) =>
        event._id === id ? res.data : event
      )
    );

    return res.data;

  } catch (err) {

    console.log("BACKEND ERROR:", err.response?.data);
    console.log("STATUS:", err.response?.status);

    throw err;
  }
};

  const deleteEvent = async (id) => {
    try {
      await api.delete(`/event/${id}`);
      setEvents((prev) => prev.filter((e) => e._id !== id && e.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return (
    <EventContext.Provider value={{ events, loading, error, fetchEvents, addEvent, updateEvent, deleteEvent }}>
      {children}
    </EventContext.Provider>
  );
};