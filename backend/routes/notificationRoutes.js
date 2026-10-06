const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,deleteNotification,
} = require("../controllers/notificationController");

router.get("/", authMiddleware, getMyNotifications);

router.get(
    "/unread-count",
    authMiddleware,
    getUnreadCount
);

router.patch(
    "/:id/read",
    authMiddleware,
    markAsRead
);

router.patch(
    "/read-all",
    authMiddleware,
    markAllAsRead
);
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;