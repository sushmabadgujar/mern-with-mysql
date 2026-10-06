const adminMiddleware = (req, res, next) => {
    console.log("user role", req.user);

    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized.",
        });
    }

    if (req.user.role !== "admin") {
        console.log("Access denied for user:", req.user);

        return res.status(403).json({
            message: "Admin access required.",
        });
    }

    next();
};

module.exports = adminMiddleware;