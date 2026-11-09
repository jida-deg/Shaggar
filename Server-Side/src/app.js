import express from "express";
import adminRouter from "./route/admin.route.js";
import eventRouter from "./route/event.route.js";
// import documentRouter from "./route/document.route.js";
import directorateRouter from "./route/directorate.route.js";
import workPlanRouter from "./route/workPlan.route.js";
import uploadRouter from "./route/upload.route.js";
import workTaskRouter from "./route/workTask.route.js";
import createRestPeriodRequestRouter from "./route/createRestPeriodRequest.route.js";
import citizensRouter from "./route/citizens.route.js";
// import caseHistoryRouter from "./route/caseHistory.route.js";
import serviceCaseRouter from "./route/serviceCase.route.js";
// import auditLogRouter from "./route/auditLog.route.js";
import staffRouter from "./route/staff.route.js";
import dashboardRouter from "./route/dashboard.route.js";
import { auditLogMiddleware } from "./middleware/auditLog.middleware.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import connectMongo from "connect-mongo";

const app = express();

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auditLogMiddleware);
app.use(session({
  secret: process.env.SESSION_SECRET || "default_secret",
  resave: false,
  saveUninitialized: false,
  store: connectMongo.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    ttl: 14 * 24 * 60 * 60, 
  }),
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 14 * 24 * 60 * 60 * 1000, 
  },
  
}));

app.get("/test-session", (req, res) => {
  req.session.test = (req.session.test || 0);
  req.session.test += 1;
  res.json({
     test: req.session.test,
     message: "Session test value incremented",
     
     });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.use("/api/admin/admins", adminRouter);
app.use("/api/admin", adminRouter);
app.use("/event", eventRouter);
// app.use("/document", documentRouter);
app.use("/upload", uploadRouter);
app.use("/api/directorates", directorateRouter);
app.use("/api/work-plans", workPlanRouter);
app.use("/api/work-tasks", workTaskRouter);
app.use("/api/rest-period-requests", createRestPeriodRequestRouter);
app.use("/api/rest-requests", createRestPeriodRequestRouter);
app.use("/api/citizens", citizensRouter);
// app.use("/api/case-histories", caseHistoryRouter);
app.use("/api/service-cases", serviceCaseRouter);
app.use("/api/complaints", serviceCaseRouter);
app.use("/api/service-requests", serviceCaseRouter);
// app.use("/api/audit-logs", auditLogRouter);
app.use("/api/staff", staffRouter);
app.use("/api/dashboard", dashboardRouter);
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Express error:", err);
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
});

export default app;