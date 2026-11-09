import jwt from "jsonwebtoken";
import Citizen from "../models/citizens.model.js";

export const protectCitizen = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;
    const token = bearerToken || req.cookies?.citizen_token;

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET must be configured");
    } 

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.tokenType !== "citizen" || !decoded.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const citizen = await Citizen.findById(decoded.id);
    if (!citizen || !citizen.isActive) {
      return res.status(401).json({ message: "Citizen account is unavailable" });
    }

    req.user = { id: citizen.id, role: "citizen" };
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    return next(error);
  }
};