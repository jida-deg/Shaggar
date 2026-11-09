import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

images: [
  {
    url: {
      type: String,
    },

    publicId: {
      type: String,
      default: "",
    },
  },
],

    eventDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model("Event", eventSchema);
export default Event;