import mongoose from "mongoose";
import AuditLog from "../models/auditLog.model.js";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const targetModelNames = {
  admin: "Admin",
  directors: "Directorate",
  directorates: "Directorate",
  event: "Event",
  events: "Event",
  "rest-period-requests": "RestPeriodRequest",
  "rest-requests": "RestPeriodRequest",
  "service-cases": "ServiceCase",
  complaints: "ServiceCase",
  "service-requests": "ServiceCase",
  staff: "Staff",
  "work-plans": "WorkPlan",
  "work-tasks": "WorkTask",
  admins: "Admin",
  citizens: "Citizen",
};

const getTargetName = (path) => {
  const segments = path.split("/").filter(Boolean);
  const knownTarget = segments
    .filter((segment) => targetModelNames[segment])
    .sort((left, right) => right.length - left.length)[0];

  if (knownTarget) return knownTarget;

  const apiIndex = segments.findIndex((segment) => segment === "api");
  return segments[apiIndex >= 0 ? apiIndex + 1 : 0] || "system";
};

const getTargetModel = (targetName) => targetModelNames[targetName] || null;

const getAction = (method) => {
  if (method === "POST") return "created";
  if (method === "DELETE") return "deleted";
  return "updated";
};

const getActor = (user) => {
  const id = user?._id || user?.id;
  if (!id || !mongoose.Types.ObjectId.isValid(id)) return null;

  if (String(user.role || "").toLowerCase() === "citizen") {
    return { actorId: id, actorModel: "Citizen" };
  }

  if (user.role) {
    return { actorId: id, actorModel: "Admin" };
  }

  return null;
};

const findTargetId = (body, params) => {
  const responseId =
    body?.data?._id ||
    body?.data?.id ||
    body?._id ||
    body?.id ||
    params?.id ||
    null;

  return responseId && mongoose.Types.ObjectId.isValid(responseId)
    ? responseId
    : null;
};

const safeMetadata = (body = {}) => {
  const excludedFields = new Set([
    "password",
    "confirmPassword",
    "currentPassword",
    "newPassword",
    "token",
    "files",
  ]);

  return Object.fromEntries(
    Object.entries(body).filter(([key]) => !excludedFields.has(key))
  );
};

export const auditLogMiddleware = (req, res, next) => {
  if (!MUTATING_METHODS.has(req.method)) return next();

  const originalJson = res.json.bind(res);
  let responseBody;

  res.json = (body) => {
    responseBody = body;
    return originalJson(body);
  };

  res.once("finish", () => {
    if (res.statusCode < 200 || res.statusCode >= 300) return;

    const actor = getActor(req.user);
    if (!actor) return;

    const targetName = getTargetName(req.path);
    const targetModel = getTargetModel(targetName);

    AuditLog.create({
      ...actor,
      action: `${getAction(req.method)}_${targetName.replace(/-/g, "_")}`,
      targetModel,
      targetId: findTargetId(responseBody, req.params),
      metadata: {
        method: req.method,
        path: req.originalUrl,
        body: safeMetadata(req.body),
      },
      ipAddress: req.ip || req.socket?.remoteAddress || null,
      userAgent: req.get("user-agent") || null,
    }).catch((error) => {
      console.error("Failed to create audit log:", error);
    });
  });

  next();
};
