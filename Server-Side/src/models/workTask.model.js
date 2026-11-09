import mongoose from "mongoose";

const workTaskSchema = new mongoose.Schema(
  {
    workPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkPlan",
      required: true,
      index: true,
    },

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

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Staff",
      required: true,
      index: true,
    },

    directorateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directorate",
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
      required: true,
    },

    dueDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "in_progress", "blocked", "completed"],
      default: "pending",
      required: true,
    },

    progressNote: {
      type: String,
      trim: true,
      default: "",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const WorkTask = mongoose.model("WorkTask", workTaskSchema);

export default WorkTask;
