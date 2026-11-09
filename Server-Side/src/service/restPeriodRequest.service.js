import RestPeriodRequest from "../models/restPeriodRequest.model.js";

export const createRestPeriodRequest = async (
  requestData,
  employeeId
) => {
  const { requestType, startDate, endDate, reason } = requestData;

  if (!employeeId) {
    throw new Error("Authenticated employee is required");
  }

  if (!requestType || !startDate || !endDate || !reason?.trim()) {
    throw new Error("All required fields must be provided");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    throw new Error("Invalid start date or end date");
  }

  if (end < start) {
    throw new Error("End date cannot be earlier than start date");
  }

  const restPeriodRequest = new RestPeriodRequest({
    employeeId,
    requestType,
    startDate: start,
    endDate: end,
    reason: reason.trim(),
  });

  return await restPeriodRequest.save();
};

export const getAllRestPeriodRequests = async (filters = {}) => {
  const query = {};

  const allowedFilters = ["employeeId", "requestType", "status"];

  for (const key of allowedFilters) {
    if (filters[key]) {
      query[key] = filters[key];
    }
  }

  return await RestPeriodRequest.find(query)
    .populate("employeeId", "name email role")
    .populate("reviewedBy", "name email role")
    .sort({ createdAt: -1 });
};

export const getRestPeriodRequestsByEmployee = async (employeeId) => {
  if (!employeeId) {
    throw new Error("Authenticated employee is required");
  }

  return await RestPeriodRequest.find({ employeeId })
    .populate("employeeId", "name email role")
    .populate("reviewedBy", "name email role")
    .sort({ createdAt: -1 });
};

export const getRestPeriodRequestById = async (requestId, employeeId) => {
  const query = employeeId
    ? { _id: requestId, employeeId }
    : { _id: requestId };

  return await RestPeriodRequest.findOne(query)
    .populate("employeeId", "name email role")
    .populate("reviewedBy", "name email role");
};

export const decideRestPeriodRequest = async (
  requestId,
  status,
  decisionNote,
  reviewerId
) => {
  if (!["approved", "rejected"].includes(status)) {
    const error = new Error("Decision status must be approved or rejected");
    error.statusCode = 400;
    throw error;
  }

  const request = await RestPeriodRequest.findById(requestId);
  if (!request) {
    const error = new Error("Rest-period request not found");
    error.statusCode = 404;
    throw error;
  }

  if (request.status !== "pending") {
    const error = new Error("Only pending requests can be reviewed");
    error.statusCode = 409;
    throw error;
  }

  request.status = status;
  request.decisionNote = decisionNote?.trim() ?? "";
  request.reviewedBy = reviewerId;
  request.reviewedAt = new Date();
  await request.save();

  return await request.populate([
    { path: "employeeId", select: "name email role" },
    { path: "reviewedBy", select: "name email role" },
  ]);
};
