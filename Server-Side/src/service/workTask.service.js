import WorkTask from "../models/workTask.model.js";

export const createWorkTask = async (workTaskData) => {
  const workTask = new WorkTask(workTaskData);
  return await workTask.save();
};
export const getAllWorkTasks = async (filters = {}) => {
    const query = {};
    const allowedFilters = [
      "workPlanId",
      "assignedTo",
      "directorateId",
      "priority",
      "status",
    ];
    for (const key of allowedFilters) {
      if (filters[key] !== undefined && filters[key] !== null && filters[key] !== "") {
        query[key] = filters[key];
      }
    }
    return await WorkTask.find(query)
      .populate("workPlanId", "title weekStart weekEnd")
      .populate("assignedTo", "name email")
      .populate("directorateId", "name code")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
}
export const getWorkTaskById = async (id) => {
  return await WorkTask.findById(id)
    .populate("workPlanId", "title weekStart weekEnd")
    .populate("assignedTo", "name email")
    .populate("directorateId", "name code")
    .populate("createdBy", "name email");
}
export const updateWorkTask = async (id, updateData) => {
  const allowedFields = [
    "description",
    "assignedTo",
    "directorateId",
    "priority",
    "dueDate",
    "status",
    "progressNote",
  ];
  const updateFields = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      updateFields[field] = updateData[field];
    }
  });
  return await WorkTask.findByIdAndUpdate(id, updateFields, {
    returnDocument: "after",
    runValidators: true,
  });
};

export const deleteWorkTask = async (id) => {
    return await WorkTask.findByIdAndDelete(id);

}
