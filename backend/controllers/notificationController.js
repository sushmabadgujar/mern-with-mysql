const Notification = require("../models/Notification");

const getMyNotifications = async (req, res) => {
    try {
        const userId = req.user.id;

        const notifications = await Notification.findAll({
            where: {
                userId,
            },
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            notifications,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch notifications.",
            error: error.message,
        });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;

        const count = await Notification.count({
            where: {
                userId,
                isRead: false,
            },
        });

        res.status(200).json({
            count,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to fetch unread notification count.",
            error: error.message,
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const notification = await Notification.findOne({
            where: {
                id,
                userId,
            },
        });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found.",
            });
        }

        notification.isRead = true;

        await notification.save();

        res.status(200).json({
            message: "Notification marked as read.",
            notification,
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to mark notification as read.",
            error: error.message,
        });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await Notification.update(
            {
                isRead: true,
            },
            {
                where: {
                    userId,
                    isRead: false,
                },
            }
        );

        res.status(200).json({
            message: "All notifications marked as read.",
        });
    } catch (error) {
        res.status(500).json({
            message: "Unable to mark notifications as read.",
            error: error.message,
        });
    }
};
const deleteNotification = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const notification = await Notification.findOne({
            where: {
                id,
                userId,
            },
        });

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found.",
            });
        }

        await notification.destroy();

        res.status(200).json({
            message: "Notification deleted successfully.",
        });
    } catch (error) {
        console.error("Delete notification error:", error);

        res.status(500).json({
            message: "Unable to delete notification.",
            error: error.message,
        });
    }
};
module.exports = {
    getMyNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
        deleteNotification,

};