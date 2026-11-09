const isAdmin = (req, res, next) => {
  const role = req.user?.role?.toLowerCase();

  if (role === 'admin' || role === 'superadmin') {
    return next();
  }

  return res.status(403).json({ message: 'Access denied. Admin only.' });
};

export default isAdmin;