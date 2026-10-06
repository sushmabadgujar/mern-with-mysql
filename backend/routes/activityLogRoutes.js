const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
    getAllActivityLogs,
    deleteActivityLog,
    clearActivityLogs,
} = require("../controllers/activityLogController");

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllActivityLogs
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteActivityLog
);

router.delete(
    "/clear/all",
    authMiddleware,
    adminMiddleware,
    clearActivityLogs
);

module.exports = router;