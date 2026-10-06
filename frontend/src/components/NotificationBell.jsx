import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import {
    getMyNotifications,
    getUnreadCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../api/notificationApi";
import { useNavigate } from "react-router-dom";
import "../style/notification.css";

const NotificationBell = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();

    const fetchUnreadCount = async () => {
        try {
            const response = await getUnreadCount();

            setUnreadCount(response.data.count);
        } catch (error) {
            console.error("Unread notification error:", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await getMyNotifications();

            setNotifications(response.data.notifications || []);
        } catch (error) {
            console.error("Notification fetch error:", error);
        }
    };

    useEffect(() => {
        fetchUnreadCount();
    }, []);

    const handleBellClick = () => {
        setShowDropdown((prev) => !prev);

        if (!showDropdown) {
            fetchNotifications();
        }
    };

    const handleNotificationClick = async (notification) => {
        try {
            if (!notification.isRead) {
                await markNotificationAsRead(notification.id);

                setNotifications((prev) =>
                    prev.map((item) =>
                        item.id === notification.id
                            ? {
                                  ...item,
                                  isRead: true,
                              }
                            : item
                    )
                );

                setUnreadCount((prev) =>
                    Math.max(prev - 1, 0)
                );
            }

            if (
                notification.type === "ORDER" &&
                notification.referenceId
            ) {
                setShowDropdown(false);

                navigate(
                    `/orders/${notification.referenceId}`
                );
            }
        } catch (error) {
            console.error(
                "Mark notification read error:",
                error
            );
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsAsRead();

            setNotifications((prev) =>
                prev.map((item) => ({
                    ...item,
                    isRead: true,
                }))
            );

            setUnreadCount(0);
        } catch (error) {
            console.error(
                "Mark all notifications error:",
                error
            );
        }
    };

    return (
        <div className="zn-notification-wrapper">

            <button
                type="button"
                className="zn-notification-button text-light"
                onClick={handleBellClick}
                aria-label="Notifications"
            >
                <FaBell className="zn-notification-icon" />

                {unreadCount > 0 && (
                    <span className="zn-notification-badge">
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="zn-notification-dropdown shadow">

                    <div className="zn-notification-header">
                        <div>
                            <h6 className="mb-1">
                                Notifications
                            </h6>

                            {unreadCount > 0 && (
                                <small className="text-muted">
                                    {unreadCount} unread
                                </small>
                            )}
                        </div>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                className="btn btn-link btn-sm p-0 text-decoration-none"
                                onClick={handleMarkAllRead}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="zn-notification-list">

                        {notifications.length === 0 ? (
                            <div className="zn-notification-empty py-4 text-center">
                                <div className="mb-2">
                                    <FaBell />
                                </div>

                                <p className="mb-0">
                                    No notifications
                                </p>
                            </div>
                        ) : (
                            notifications
                                .slice(0, 5)
                                .map((notification) => (
                                    <div
                                        key={
                                            notification.id
                                        }
                                        className={`zn-notification-item ${
                                            !notification.isRead
                                                ? "zn-notification-unread"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleNotificationClick(
                                                notification
                                            )
                                        }
                                    >
                                        <div className="zn-notification-item-icon">
                                            <FaBell />
                                        </div>

                                        <div className="zn-notification-item-content">
                                            <div className="d-flex justify-content-between align-items-start gap-2">
                                                <h6 className="zn-notification-item-title">
                                                    {
                                                        notification.title
                                                    }
                                                </h6>

                                                {!notification.isRead && (
                                                    <span className="zn-unread-dot"></span>
                                                )}
                                            </div>

                                            <p className="zn-notification-item-message">
                                                {
                                                    notification.message
                                                }
                                            </p>

                                            <small className="zn-notification-item-time">
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString()}
                                            </small>
                                        </div>
                                    </div>
                                ))
                        )}

                    </div>

                    <div className="zn-notification-footer">
                        <button
                            type="button"
                            className="btn btn-link btn-sm text-decoration-none w-100"
                            onClick={() => {
                                setShowDropdown(false);
                                navigate("/notifications");
                            }}
                        >
                            View All Notifications
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default NotificationBell;