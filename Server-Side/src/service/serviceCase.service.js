import ServiceCase from "../models/serviceCase.model.js";

export const createServiceCase = async (caseData, citizenId) => {
  const {
    caseType,
    category,
    title,
    description,
    directorateId,
    attachments,
  } = caseData;

  if (!citizenId) {
    throw new Error("Authenticated citizen is required");
  }

  if (
    !category?.trim() ||
    !title?.trim() ||
    !description?.trim() ||
    !directorateId
  ) {
    throw new Error("All required fields must be provided");
  }

  if (!["service_request", "complaint"].includes(caseType)) {
    throw new Error("Invalid case type");
  }

  const serviceCase = new ServiceCase({
    caseType,
    citizenId,
    category: category.trim(),
    title: title.trim(),
    description: description.trim(),
    directorateId,
    attachments: attachments ?? [],
    // Status, priority and assignment use trusted schema defaults.
  });

  serviceCase.referenceNumber = `SST-${serviceCase._id.toString()}`;
  return await serviceCase.save();
};

export const getServiceCaseById = async (id) => {
  return await ServiceCase.findById(id)
    .populate("citizenId", "fullName email phone")
    .populate("assignedTo", "name email")
    .populate("directorateId", "name code");
};

export const getAllServiceCases = async (filters = {}) => {
  const query = {};

  const allowedFilters = [
    "citizenId",
    "directorateId",
    "assignedTo",
    "caseType",
    "status",
    "priority",
  ];

  for (const key of allowedFilters) {
    if (filters[key]) {
      query[key] = filters[key];
    }
  }

  return await ServiceCase.find(query)
    .populate("citizenId", "fullName email phone")
    .populate("assignedTo", "name email")
    .populate("directorateId", "name code")
    .sort({ createdAt: -1 });
};

export const updateServiceCaseStatus = async (
  id,
  status,
  resolution,
  caseType
) => {
  const allowedStatuses = [
    "submitted",
    "under_review",
    "assigned",
    "in_progress",
    "awaiting_information",
    "approved",
    "resolved",
    "rejected",
    "closed",
  ];

  if (!allowedStatuses.includes(status)) {
    const error = new Error("Invalid service case status");
    error.statusCode = 400;
    throw error;
  }

  const serviceCase = await ServiceCase.findOne({
    _id: id,
    ...(caseType ? { caseType } : {}),
  });
  if (!serviceCase) {
    return null;
  }

  serviceCase.status = status;
  if (resolution !== undefined) {
    serviceCase.resolution = resolution;
  }
  serviceCase.resolvedAt = status === "resolved" ? new Date() : null;

  await serviceCase.save();
  return await serviceCase
    .populate("citizenId", "fullName email phone")
    .then((result) => result.populate("assignedTo", "name email"))
    .then((result) => result.populate("directorateId", "name code"));
};
