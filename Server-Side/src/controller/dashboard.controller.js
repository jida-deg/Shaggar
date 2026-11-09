import AuditLog from "../models/auditLog.model.js";
import Directorate from "../models/directorate.model.js";
import Event from "../models/event.model.js";
import RestPeriodRequest from "../models/restPeriodRequest.model.js";
import ServiceCase from "../models/serviceCase.model.js";
import Staff from "../models/staff.model.js";
import WorkPlan from "../models/workPlan.model.js";

const openCaseStatuses = [
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "awaiting_information",
];

const isSuperAdmin = (user) =>
  String(user?.role || "").toLowerCase().replace(/[\s_-]/g, "") ===
  "superadmin";

export const getDashboardSummaryController = async (req, res) => {
  try {
    const today = new Date();
    const [staff, directorates, workPlans, pendingCases, pendingRestRequests,
      caseTypes, casesByStatus, upcomingEvents, recentActivities,
      recentRequests] = await Promise.all([
      Staff.countDocuments(),
      Directorate.countDocuments({ isActive: true }),
      WorkPlan.countDocuments({ status: { $ne: "closed" } }),
      ServiceCase.countDocuments({ status: { $in: openCaseStatuses } }),
      RestPeriodRequest.countDocuments({ status: "pending" }),
      ServiceCase.aggregate([
        { $group: { _id: "$caseType", count: { $sum: 1 } } },
      ]),
      ServiceCase.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1, _id: 1 } },
      ]),
      Event.find({ eventDate: { $gte: today } })
        .select("title eventDate")
        .sort({ eventDate: 1 })
        .limit(5)
        .lean(),
      AuditLog.find()
        .select("action targetModel createdAt")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      isSuperAdmin(req.user)
        ? ServiceCase.find()
            .select("referenceNumber caseType title status createdAt")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean()
        : Promise.resolve([]),
    ]);

    return res.status(200).json({
      stats: {
        staff,
        directorates,
        workPlans,
        pendingRequests: pendingCases + pendingRestRequests,
      },
      caseTypes,
      casesByStatus,
      recentActivities,
      recentRequests,
      upcomingEvents,
    });
  } catch (error) {
    console.error("Failed to load dashboard summary:", error);
    return res.status(500).json({
      message: "Failed to load dashboard data.",
    });
  }
};
