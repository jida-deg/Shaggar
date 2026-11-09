import {createEvent, getAllEvents, deleteEvent,getEventByTitle, updateEvent} from "../service/event.service.js";
import { uploadToCloudinary } from "../config/cloudnery.js";
export const createEventController = async (req, res) => {
    try {
        const data = { ...req.body };

        if (data.date && !data.eventDate) {
            data.eventDate = data.date;
        }

        delete data.date;

        const uploadedFiles = Array.isArray(req.files)
            ? req.files
            : req.files?.files || req.files?.file || [];

        if (uploadedFiles.length > 0) {
            const uploadedImages = [];
            for (const file of uploadedFiles) {
                try {
                    const uploadRes = await uploadToCloudinary(file.buffer, 'events');
                    uploadedImages.push({
                        url: uploadRes.secure_url,
                        publicId: uploadRes.public_id,
                    });
                } catch (uploadError) {
                    console.warn('Image upload skipped:', uploadError.message);
                }
            }
            data.images = uploadedImages;
        } else if (!data.images) {
            data.images = [];
        }
        const event = await createEvent(data);
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllEventsController = async (req, res) => {
    try{
        const events = await getAllEvents();
        res.status(200).json(events);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getEventByTitleController = async (req, res) => {
    try{
        const event = await getEventByTitle(req.params.title);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// export const getEventController = async (req, res) => {
//     try{
//         const event = await getEvent(req.params.id);
//         if (!event) {
//             return res.status(404).json({ message: "Event not found" });
//         }
//         res.status(200).json(event);
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }
export const updateEventController = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.date && !updateData.eventDate) {
      updateData.eventDate = updateData.date;
    }

    if (!updateData.eventDate || updateData.eventDate === "") {
      delete updateData.eventDate;
    }

    delete updateData.date;

    const uploadedFiles = req.files?.files || req.files?.file || [];
    if (uploadedFiles.length > 0) {
      const uploadedImages = [];
      for (const file of uploadedFiles) {
        try {
          const uploadRes = await uploadToCloudinary(file.buffer, 'events');
          uploadedImages.push({
            url: uploadRes.secure_url,
            publicId: uploadRes.public_id,
          });
        } catch (uploadError) {
          console.warn('Image upload skipped:', uploadError.message);
        }
      }
      updateData.images = uploadedImages;
    }

    const updatedEvent = await updateEvent(req.params.id, updateData);

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({
        message: error.message,
        error: error
    });
}
};

export const deleteEventController = async (req, res) => {
    try{
        const deletedEvent = await deleteEvent(req.params.id);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}