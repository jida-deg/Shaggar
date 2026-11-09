import mongoose from "mongoose";

const serviceCaseSchema = new mongoose.Schema(
  {
    referenceNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    caseType: {
      type: String,
      enum: ["service_request", "complaint"],
      required: true,
    },

    citizenId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Citizen",
      required: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },

    directorateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Directorate",
      required: true,
      index: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "submitted",
        "under_review",
        "assigned",
        "in_progress",
        "awaiting_information",
        "approved",
        "resolved",
        "rejected",
        "closed",
      ],
      default: "submitted",
      required: true,
      index: true,
    },

    priority: {
      type: String,
      enum: ["low", "normal", "high", "urgent"],
      default: "normal",
      required: true,
    },

    attachments: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          publicId: {
            type: String,
            default: null,
          },
          originalName: {
            type: String,
            trim: true,
            default: "",
          },
          mimeType: {
            type: String,
            required: true,
          },
          size: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
      default: [],
    },

    resolution: {
      type: String,
      trim: true,
      default: "",
      maxlength: 5000,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

serviceCaseSchema.index({
  citizenId: 1,
  createdAt: -1,
});

serviceCaseSchema.index({
  directorateId: 1,
  status: 1,
});

const ServiceCase = mongoose.model("ServiceCase", serviceCaseSchema);

export default ServiceCase;
