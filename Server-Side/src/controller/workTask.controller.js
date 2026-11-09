import {
  createWorkTask,
  getAllWorkTasks,
  getWorkTaskById,
  updateWorkTask,
  deleteWorkTask,
} from "../service/workTask.service.js";

export const createWorkTaskController = async (req, res) => {
  try {
    const workTask = await createWorkTask({
      ...req.body,
      createdBy: req.user._id,
    });
    return res.status(201).json(workTask);
  } catch (error) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
};

export const getAllWorkTasksController = async (req, res) => {
  try {
    const workTasks = await getAllWorkTasks(req.query);
    return res.status(200).json(workTasks);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getWorkTaskByIdController = async (req, res) => {
  try {
    const workTask = await getWorkTaskById(req.params.id);
    if (!workTask) {
      return res.status(404).json({ message: "Work task not found" });
    }
    return res.status(200).json(workTask);
  } catch (error) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
};

export const updateWorkTaskController = async (req, res) => {
  try {
    const workTask = await updateWorkTask(req.params.id, req.body);
    if (!workTask) {
      return res.status(404).json({ message: "Work task not found" });
    }
    return res.status(200).json(workTask);
  } catch (error) {
    return res.status(error.statusCode || 400).json({ message: error.message });
  }
};

export const deleteWorkTaskController = async (req, res) => {
  try {
    const workTask = await deleteWorkTask(req.params.id);
    if (!workTask) {
      return res.status(404).json({ message: "Work task not found" });
    }
    return res.status(200).json({ message: "Work task deleted successfully" });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
};