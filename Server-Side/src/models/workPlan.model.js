import mongoose from "mongoose";

const workPlanSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    weekStart: {
      type: Date,
      required: true,
    },

    weekEnd: {
      type: Date,
      required: true,
      validate: {
        validator(value) {
          return !this.weekStart || value >= this.weekStart;
        },
        message: "weekEnd must be on or after weekStart.",
      },
    },

    directorateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directorate",
      required: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "closed"],
      default: "draft",
      required: true,
    },
 planType: {
  type: String,
  enum: ["week", "month", "year"],
  required: true,
  default: "week",
},


    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const WorkPlan = mongoose.model("WorkPlan", workPlanSchema);

export default WorkPlan;
