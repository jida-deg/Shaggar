import WorkPlan from "../models/workPlan.model.js";

export const createWorkPlan = async (workPlanData) => {
  const workPlan = new WorkPlan(workPlanData);

  await workPlan.save();

  return workPlan;
};

export const getAllWorkPlans = async (filters = {}) => {
  const query = {};

  if (filters.planType) {
    query.planType = filters.planType;
  }

  if (filters.directorateId) {
    query.directorateId = filters.directorateId;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  return await WorkPlan.find(query)
    .populate("createdBy", "name email")
    .populate("directorateId", "name code")
    .sort({ weekStart: -1 });
};

export const getWorkPlanById = async (id) => {
  return await WorkPlan.findById(id)
    .populate("createdBy", "name email")
    .populate("directorateId", "name code");
};

export const getWorkPlansByPeriod = async (
  planType,
  startDate,
  endDate
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (
    !planType ||
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end < start
  ) {
    const error = new Error("A valid plan type, start date, and end date are required.");
    error.statusCode = 400;
    throw error;
  }

  return await WorkPlan.find({
    planType,
    weekStart: { $lte: end },
    weekEnd: { $gte: start },
  })
    .populate("createdBy", "name email")
    .populate("directorateId", "name code")
    .sort({ weekStart: -1 });
};

export const updateWorkPlan = async (id, updateData) => {
  const allowedFields = [
    "title",
    "weekStart",
    "weekEnd",
    "planType",
  ];

  const updates = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      updates[field] = updateData[field];
    }
  }

  const workPlan = await WorkPlan.findById(id);
  if (!workPlan) {
    return null;
  }

  Object.assign(workPlan, updates);
  await workPlan.save();
  return workPlan
    .populate("createdBy", "name email")
    .then((plan) => plan.populate("directorateId", "name code"));
};

export const deleteWorkPlan = async (id) => {
  return await WorkPlan.findByIdAndDelete(id);
};
