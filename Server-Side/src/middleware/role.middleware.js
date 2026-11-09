export const superAdminOnly = (req, res, next) => {
    const role = String(req.user?.role || req.user?.admin?.role || "")
        .toLowerCase()
        .trim()
        .replace(/[\s_-]/g, "");

    const isSuperAdmin =
        role === "superadmin" || req.user?.isSuperAdmin === true;

    if (!isSuperAdmin) {
        return res.status(403).json({
            message: "Access denied. Super admin only.",
            role: req.user?.role || null,
            isSuperAdmin: req.user?.isSuperAdmin || false,
        });
    }

    next();
};