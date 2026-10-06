import React, { useEffect, useState } from "react";
import { getAllActivityLogs ,deleteActivityLog,clearActivityLogs, } from "../api/activityLogApi";

import { showError, showSuccess } from "../utils/toast";
import "../../style/activityLogs.css";

const ActivityLogs = () => {
    const [activities, setActivities] = useState([]);
    const [search, setSearch] = useState("");
    const [action, setAction] = useState("");
    const [module, setModule] = useState("");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const [loading, setLoading] = useState(false);

    const fetchActivityLogs = async () => {
        try {
            setLoading(true);

            const response = await getAllActivityLogs({
                page,
                limit,
                search,
                action,
                module,
            });
            console.log("response of logs:",response);
            setActivities(response.data.activities || []);
            setTotalPages(response.data.totalPages || 1);
            setTotalItems(response.data.totalItems || 0);
        } catch (error) {
            console.error("Fetch activity logs error:", error);

            showError(
                error.response?.data?.message ||
                    "Unable to fetch activity logs."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActivityLogs();
    }, [page, limit, action, module]);

    const handleSearch = (event) => {
        event.preventDefault();
        setPage(1);
        fetchActivityLogs();
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this activity log?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteActivityLog(id);

            showSuccess("Activity log deleted successfully.");

            fetchActivityLogs();
        } catch (error) {
            console.error("Delete activity log error:", error);

            showError(
                error.response?.data?.message ||
                    "Unable to delete activity log."
            );
        }
    };

    const handleClearAll = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete all activity logs?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await clearActivityLogs();

            showSuccess("All activity logs deleted successfully.");

            setPage(1);
            fetchActivityLogs();
        } catch (error) {
            console.error("Clear activity logs error:", error);

            showError(
                error.response?.data?.message ||
                    "Unable to clear activity logs."
            );
        }
    };

    const getActionBadgeClass = (action) => {
        switch (action) {
            case "LOGIN":
                return "bg-success";

            case "LOGOUT":
                return "bg-secondary";

            case "CREATE":
                return "bg-primary";

            case "READ":
                return "bg-info text-dark";

            case "UPDATE":
                return "bg-warning text-dark";

            case "DELETE":
                return "bg-danger";

            case "PASSWORD_CHANGE":
                return "bg-dark";

            default:
                return "bg-secondary";
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleString();
    };

    return (
        <div className="container-fluid py-4 zn-activity-page">
            <div className="card shadow-sm">
                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                        <div>
                            <h3 className="mb-1">
                                Activity Logs
                            </h3>

                            <p className="text-muted mb-0">
                                Total Activities: {totalItems}
                            </p>
                        </div>

                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={handleClearAll}
                            disabled={activities.length === 0}
                        >
                            <i className="bi bi-trash me-2"></i>
                            Clear All
                        </button>
                    </div>

                    <form
                        onSubmit={handleSearch}
                        className="row g-3 mb-4"
                    >
                        <div className="col-md-5">
                            <label className="form-label">
                                Search User
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by name or email"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">
                                Action
                            </label>

                            <select
                                className="form-select"
                                value={action}
                                onChange={(event) => {
                                    setAction(event.target.value);
                                    setPage(1);
                                }}
                            >
                                <option value="">
                                    All Actions
                                </option>

                                <option value="LOGIN">
                                    LOGIN
                                </option>

                                <option value="LOGOUT">
                                    LOGOUT
                                </option>

                                <option value="CREATE">
                                    CREATE
                                </option>

                                <option value="READ">
                                    READ
                                </option>

                                <option value="UPDATE">
                                    UPDATE
                                </option>

                                <option value="DELETE">
                                    DELETE
                                </option>

                                <option value="PASSWORD_CHANGE">
                                    PASSWORD CHANGE
                                </option>
                            </select>
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">
                                Module
                            </label>

                            <select
                                className="form-select"
                                value={module}
                                onChange={(event) => {
                                    setModule(event.target.value);
                                    setPage(1);
                                }}
                            >
                                <option value="">
                                    All Modules
                                </option>

                                <option value="AUTH">
                                    AUTH
                                </option>

                                <option value="USER">
                                    USER
                                </option>

                                <option value="PROFILE">
                                    PROFILE
                                </option>

                                <option value="PRODUCT">
                                    PRODUCT
                                </option>

                                <option value="CATEGORY">
                                    CATEGORY
                                </option>

                                <option value="CART">
                                    CART
                                </option>

                                <option value="WISHLIST">
                                    WISHLIST
                                </option>

                                <option value="ORDER">
                                    ORDER
                                </option>
                            </select>
                        </div>

                        <div className="col-md-1 d-flex align-items-end">
                            <button
                                type="submit"
                                className="btn btn-primary w-100"
                            >
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </form>

                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>#</th>
                                    <th>User</th>
                                    <th>Action</th>
                                    <th>Module</th>
                                    <th>Description</th>
                                    <th>IP Address</th>
                                    <th>Date & Time</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-5"
                                        >
                                            <div
                                                className="spinner-border text-primary"
                                                role="status"
                                            >
                                                <span className="visually-hidden">
                                                    Loading...
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : activities.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-5"
                                        >
                                            <i className="bi bi-clock-history zn-activity-empty-icon"></i>

                                            <p className="mt-2 mb-0 text-muted">
                                                No activity logs found.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    activities.map(
                                        (
                                            activity,
                                            index
                                        ) => (
                                            <tr
                                                key={
                                                    activity.id
                                                }
                                            >
                                                <td>
                                                    {(page -
                                                        1) *
                                                        limit +
                                                        index +
                                                        1}
                                                </td>

                                                <td>
                                                    <div className="fw-semibold">
                                                        {
                                                            activity
                                                                .user
                                                                ?.name
                                                        }
                                                    </div>

                                                    <small className="text-muted">
                                                        {
                                                            activity
                                                                .user
                                                                ?.email
                                                        }
                                                    </small>
                                                </td>

                                                <td>
                                                    <span
                                                        className={`badge ${getActionBadgeClass(
                                                            activity.action
                                                        )}`}
                                                    >
                                                        {
                                                            activity.action
                                                        }
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="badge bg-light text-dark border">
                                                        {
                                                            activity.module
                                                        }
                                                    </span>
                                                </td>

                                                <td className="zn-activity-description">
                                                    {
                                                        activity.description
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        activity.ipAddress ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>
                                                    {formatDate(
                                                        activity.createdAt
                                                    )}
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() =>
                                                            handleDelete(
                                                                activity.id
                                                            )
                                                        }
                                                        title="Delete"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mt-4">

                            <div className="d-flex align-items-center gap-2">
                                <span className="text-muted">
                                    Rows per page:
                                </span>

                                <select
                                    className="form-select form-select-sm zn-page-limit"
                                    value={limit}
                                    onChange={(event) => {
                                        setLimit(
                                            Number(
                                                event
                                                    .target
                                                    .value
                                            )
                                        );
                                        setPage(1);
                                    }}
                                >
                                    <option value="5">
                                        5
                                    </option>

                                    <option value="10">
                                        10
                                    </option>

                                    <option value="20">
                                        20
                                    </option>

                                    <option value="50">
                                        50
                                    </option>
                                </select>
                            </div>

                            <nav>
                                <ul className="pagination mb-0">

                                    <li
                                        className={`page-item ${
                                            page === 1
                                                ? "disabled"
                                                : ""
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            className="page-link"
                                            onClick={() =>
                                                setPage(
                                                    (prev) =>
                                                        Math.max(
                                                            prev -
                                                                1,
                                                            1
                                                        )
                                                )
                                            }
                                        >
                                            Previous
                                        </button>
                                    </li>

                                    {Array.from(
                                        {
                                            length: totalPages,
                                        },
                                        (_, index) =>
                                            index + 1
                                    ).map(
                                        (
                                            pageNumber
                                        ) => (
                                            <li
                                                key={
                                                    pageNumber
                                                }
                                                className={`page-item ${
                                                    page ===
                                                    pageNumber
                                                        ? "active"
                                                        : ""
                                                }`}
                                            >
                                                <button
                                                    type="button"
                                                    className="page-link"
                                                    onClick={() =>
                                                        setPage(
                                                            pageNumber
                                                        )
                                                    }
                                                >
                                                    {
                                                        pageNumber
                                                    }
                                                </button>
                                            </li>
                                        )
                                    )}

                                    <li
                                        className={`page-item ${
                                            page ===
                                            totalPages
                                                ? "disabled"
                                                : ""
                                        }`}
                                    >
                                        <button
                                            type="button"
                                            className="page-link"
                                            onClick={() =>
                                                setPage(
                                                    (prev) =>
                                                        Math.min(
                                                            prev +
                                                                1,
                                                            totalPages
                                                        )
                                                )
                                            }
                                        >
                                            Next
                                        </button>
                                    </li>

                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityLogs;