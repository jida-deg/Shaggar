import {createWorkPlan, getAllWorkPlans, getWorkPlanById,
     getWorkPlansByPeriod, updateWorkPlan, deleteWorkPlan} 
from "../service/workPlan.service.js";

export const createWorkPlanController = async (req, res) => {
  try {
    const workPlan = await createWorkPlan({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(workPlan);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};
export const getAllWorkPlansController = async (req, res) => {
  try {
    const workPlans = await getAllWorkPlans(req.query);
    res.status(200).json(workPlans);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};
export const getWorkPlanByIdController = async (req, res) => {
  try {
    const workPlan = await getWorkPlanById(req.params.id);
    if (!workPlan) {
      return res.status(404).json({ message: "Work plan not found" });
    }
    res.status(200).json(workPlan);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};
export const getWorkPlansByPeriodController = async (req, res) => {
  try {
    const { planType, startDate, endDate } = req.query;
    const workPlans = await getWorkPlansByPeriod(planType, startDate, endDate);
    res.status(200).json(workPlans);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};
export const updateWorkPlanController = async (req, res) => {
  try {
    const workPlan = await updateWorkPlan(req.params.id, req.body);
    if (!workPlan) {
      return res.status(404).json({ message: "Work plan not found" });
    }
    res.status(200).json(workPlan);
  } catch (error) {
    res.status(error.statusCode || 400).json({ message: error.message });
  }
};
export const deleteWorkPlanController = async (req, res) => {
  try {
    const workPlan = await deleteWorkPlan(req.params.id);
    if (!workPlan) {
      return res.status(404).json({ message: "Work plan not found" });
    }
    res.status(200).json({ message: "Work plan deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};