import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    const token = bearerToken || req.cookies?.admin_token;

    if (!token || typeof token !== 'string' || token.split('.').length !== 3) {
      const err = new Error('Invalid token');
      err.statusCode = 401;
      return next(err);
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET must be configured");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.tokenType !== "admin") {
        const error = new Error("Invalid token");
        error.statusCode = 401;
        return next(error);
      }
    } catch (verifyError) {
      verifyError.statusCode = 401;
      if (verifyError.name === 'TokenExpiredError') verifyError.message = 'Token expired';
      else verifyError.message = 'Invalid token';
      return next(verifyError);
    }

    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin) {
      const error = new Error('Admin not found');
      error.statusCode = 401;
      return next(error);
    }

    req.user = {
      ...admin.toObject(),
      isSuperAdmin: admin.role === 'superadmin',
    };
    next();
  } catch (error) {
    error.statusCode = 401;
    next(error);
  }
};
