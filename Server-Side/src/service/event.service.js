import Event from "../models/event.model.js";

 export const createEvent = async (eventData) => {
    try{
        const craetedEvent = new Event(eventData);
        await craetedEvent.save();
        return craetedEvent;

    }
    catch (error) {
        throw error;
    }
}

export const getEventByTitle = async (title) =>{
    try{
        const event = await Event.findOne({ title });
        return event;
    }
    catch (error) {
        throw error;
    }
}
export const getAllEvents = async () =>{

    try{
        const events = await Event.find();
        return events;
    }
    catch (error) {
        throw error;
    }
}
export const getEventById = async (eventId) =>{
    try{
        const event = await Event.findById(eventId).lean();
        return event;
    }
    catch (error) {
        throw error;
    }
}

export const updateEvent = async (eventId, eventData) =>{
    try{
        const updatedEvent = await Event.findByIdAndUpdate(eventId, eventData, { returnDocument: "after", runValidators: true });
        return updatedEvent;
    }
    catch (error) {
        throw error;
    }
}
export const deleteEvent = async (eventId) =>{
    try{
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        return deletedEvent;
    }
    catch (error) {
        throw error;
    }
}
