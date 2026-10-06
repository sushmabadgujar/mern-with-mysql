
import React, { useEffect, useState } from "react";
import {
    getMyNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
    deleteNotification,
} from "../../api/notificationApi";
import "../../style/notification.css";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("all");

    const fetchNotifications = async () => {
        try {
            const response = await getMyNotifications();

            setNotifications(response.data.notifications || []);
        } catch (error) {
            console.error("Notification history error:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);

            setNotifications((prev) =>
                prev.map((notification) =>
                    notification.id === id
                        ? {
                              ...notification,
                              isRead: true,
                          }
                        : notification
                )
            );
        } catch (error) {
            console.error("Mark notification error:", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsAsRead();

            setNotifications((prev) =>
                prev.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );
        } catch (error) {
            console.error("Mark all notification error:", error);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await deleteNotification(id);

            setNotifications((prev) =>
                prev.filter((notification) => notification.id !== id)
            );
        } catch (error) {
            console.error("Delete notification error:", error);
        }
    };

    const filteredNotifications =
        filter === "unread"
            ? notifications.filter(
                  (notification) => !notification.isRead
              )
            : notifications;

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    return (
        <div className="container py-4 zn-notifications-page">
            <div className="row justify-content-center">
                <div className="col-lg-9 col-xl-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-0">
                            <div className="zn-notifications-header p-4 border-bottom">
                                <div>
                                    <h2 className="mb-1">
                                        Notifications
                                    </h2>

                                    <p className="text-muted mb-0">
                                        {unreadCount > 0
                                            ? `${unreadCount} unread notification${
                                                  unreadCount > 1
                                                      ? "s"
                                                      : ""
                                              }`
                                            : "You're all caught up"}
                                    </p>
                                </div>

                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={handleMarkAllRead}
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            <div className="p-3 border-bottom">
                                <div
                                    className="btn-group"
                                    role="group"
                                >
                                    <button
                                        type="button"
                                        className={`btn ${
                                            filter === "all"
                                                ? "btn-primary"
                                                : "btn-outline-primary"
                                        }`}
                                        onClick={() =>
                                            setFilter("all")
                                        }
                                    >
                                        All

                                        <span className="badge bg-light text-dark ms-2">
                                            {notifications.length}
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        className={`btn ${
                                            filter === "unread"
                                                ? "btn-primary"
                                                : "btn-outline-primary"
                                        }`}
                                        onClick={() =>
                                            setFilter("unread")
                                        }
                                    >
                                        Unread

                                        {unreadCount > 0 && (
                                            <span className="badge bg-danger ms-2">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="zn-notifications-history">
                                {filteredNotifications.length === 0 ? (
                                    <div className="text-center py-5">
                                        <div className="zn-empty-icon mb-3">
                                            <i className="bi bi-bell-slash"></i>
                                        </div>

                                        <h5 className="mb-2">
                                            No notifications
                                        </h5>

                                        <p className="text-muted mb-0">
                                            {filter === "unread"
                                                ? "You don't have any unread notifications."
                                                : "You don't have any notifications yet."}
                                        </p>
                                    </div>
                                ) : (
                                    filteredNotifications.map(
                                        (notification) => (
                                            <div
                                                key={notification.id}
                                                className={`zn-history-item ${
                                                    !notification.isRead
                                                        ? "zn-history-unread"
                                                        : ""
                                                }`}
                                            >
                                                <div
                                                    className="zn-history-icon text-black"
                                                    onClick={() =>
                                                        !notification.isRead &&
                                                        handleMarkAsRead(
                                                            notification.id
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-bell"></i>
                                                </div>

                                                <div
                                                    className="zn-history-content"
                                                    onClick={() =>
                                                        !notification.isRead &&
                                                        handleMarkAsRead(
                                                            notification.id
                                                        )
                                                    }
                                                >
                                                    <div className="d-flex justify-content-between align-items-start gap-3">
                                                        <div>
                                                            <h5 className="zn-history-title">
                                                                {
                                                                    notification.title
                                                                }
                                                            </h5>

                                                            <p className="zn-history-message">
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>
                                                        </div>

                                                        {!notification.isRead && (
                                                            <span className="zn-unread-dot"></span>
                                                        )}
                                                    </div>

                                                    <small className="zn-history-time">
                                                        <i className="bi bi-clock me-1"></i>
                                                        {new Date(
                                                            notification.createdAt
                                                        ).toLocaleString()}
                                                    </small>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="zn-notification-delete"
                                                    onClick={() =>
                                                        handleDeleteNotification(
                                                            notification.id
                                                        )
                                                    }
                                                    title="Delete notification"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;

