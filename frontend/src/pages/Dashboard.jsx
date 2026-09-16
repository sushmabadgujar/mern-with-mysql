import React, { useEffect, useState } from "react";
import {
    FaUsers,
    FaUserCheck,
    FaUserTimes,
    FaUserPlus,
    FaArrowUp,
    FaChartLine,
} from "react-icons/fa";

import { getDashboardStats } from "../api/dashboardApi";
import Alert from "../components/Alert";
import "./../dashboard.css";
import { Link } from "react-router-dom";
const Dashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        newRegistrations: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getDashboardStats();

            setStats(response.data.data);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to load dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    // Active user percentage
    const activePercentage =
        stats.totalUsers > 0
            ? Math.round(
                (stats.activeUsers / stats.totalUsers) * 100
            )
            : 0;

    // Inactive user percentage
    const inactivePercentage =
        stats.totalUsers > 0
            ? Math.round(
                (stats.inactiveUsers / stats.totalUsers) * 100
            )
            : 0;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" />
                    <p className="text-muted mb-0">
                        Loading dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-dark border-black text-black">
                <div className="container">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div
                        className="collapse navbar-collapse"
                        id="navbarNav"
                    >
                        <ul className="navbar-nav me-auto">

                            {/* Dashboard */}
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to="/dashboard"
                                >
                                    Dashboard
                                </Link>
                            </li>

                            {/* Category */}
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to="/categories"
                                >
                                    Category
                                </Link>
                            </li>

                            {/* Product */}
                            <li className="nav-item">
                                <Link
                                    className="nav-link"
                                    to="/products"
                                >
                                    Product
                                </Link>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>
            <div className="container-fluid px-0">

                {/* =========================
          Dashboard Header
      ========================= */}
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

                    <div>
                        <h2 className="fw-bold mb-1">
                            Dashboard
                        </h2>

                        <p className="text-muted mb-0">
                            Welcome back! Here's what's happening
                            with your users.
                        </p>
                    </div>

                    <button
                        className="btn btn-primary d-flex align-items-center gap-2"
                        onClick={fetchDashboardStats}
                    >
                        <FaChartLine />
                        Refresh
                    </button>

                </div>

                <Alert message={error} />

                {/* =========================
          Dashboard Cards
      ========================= */}
                <div className="row g-4 mb-4">

                    {/* Total Users */}
                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100 dashboard-card">
                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-start">

                                    <div>
                                        <p className="text-muted mb-2">
                                            Total Users
                                        </p>

                                        <h2 className="fw-bold mb-1">
                                            {stats.totalUsers}
                                        </h2>

                                        <small className="text-muted">
                                            All registered users
                                        </small>
                                    </div>

                                    <div className="dashboard-icon bg-primary bg-opacity-10 text-primary">
                                        <FaUsers />
                                    </div>

                                </div>

                                <div className="mt-4">
                                    <div className="progress" style={{ height: "6px" }}>
                                        <div
                                            className="progress-bar bg-primary"
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Active Users */}
                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100 dashboard-card">
                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-start">

                                    <div>
                                        <p className="text-muted mb-2">
                                            Active Users
                                        </p>

                                        <h2 className="fw-bold mb-1 text-success">
                                            {stats.activeUsers}
                                        </h2>

                                        <small className="text-muted">
                                            {activePercentage}% of total users
                                        </small>
                                    </div>

                                    <div className="dashboard-icon bg-success bg-opacity-10 text-success">
                                        <FaUserCheck />
                                    </div>

                                </div>

                                <div className="mt-4">
                                    <div
                                        className="progress"
                                        style={{ height: "6px" }}
                                    >
                                        <div
                                            className="progress-bar bg-success"
                                            style={{
                                                width: `${activePercentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Inactive Users */}
                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100 dashboard-card">
                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-start">

                                    <div>
                                        <p className="text-muted mb-2">
                                            Inactive Users
                                        </p>

                                        <h2 className="fw-bold mb-1 text-danger">
                                            {stats.inactiveUsers}
                                        </h2>

                                        <small className="text-muted">
                                            {inactivePercentage}% of total users
                                        </small>
                                    </div>

                                    <div className="dashboard-icon bg-danger bg-opacity-10 text-danger">
                                        <FaUserTimes />
                                    </div>

                                </div>

                                <div className="mt-4">
                                    <div
                                        className="progress"
                                        style={{ height: "6px" }}
                                    >
                                        <div
                                            className="progress-bar bg-danger"
                                            style={{
                                                width: `${inactivePercentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* New Registrations */}
                    <div className="col-xl-3 col-md-6">
                        <div className="card border-0 shadow-sm h-100 dashboard-card">
                            <div className="card-body p-4">

                                <div className="d-flex justify-content-between align-items-start">

                                    <div>
                                        <p className="text-muted mb-2">
                                            New Registrations
                                        </p>

                                        <h2 className="fw-bold mb-1 text-warning">
                                            {stats.newRegistrations}
                                        </h2>

                                        <small className="text-muted">
                                            Registered this month
                                        </small>
                                    </div>

                                    <div className="dashboard-icon bg-warning bg-opacity-10 text-warning">
                                        <FaUserPlus />
                                    </div>

                                </div>

                                <div className="mt-4">
                                    <span className="badge bg-success-subtle text-success">
                                        <FaArrowUp className="me-1" />
                                        New Users
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>
                    {/* =========================
                        User Overview
                    ========================= */}
                    <div className="row g-4">

                        {/* User Activity */}
                        <div className="col-lg-8">
                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body p-4">

                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div>
                                            <h5 className="fw-bold mb-1">
                                                User Overview
                                            </h5>

                                            <p className="text-muted small mb-0">
                                                Current user activity
                                            </p>
                                        </div>

                                        <FaUsers className="text-primary fs-4" />
                                    </div>

                                    {/* Active */}
                                    <div className="mb-4">

                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="fw-semibold">
                                                Active Users
                                            </span>

                                            <span className="text-muted">
                                                {stats.activeUsers}
                                            </span>
                                        </div>

                                        <div
                                            className="progress"
                                            style={{ height: "10px" }}
                                        >
                                            <div
                                                className="progress-bar bg-success"
                                                style={{
                                                    width: `${activePercentage}%`,
                                                }}
                                            />
                                        </div>

                                    </div>

                                    {/* Inactive */}
                                    <div>

                                        <div className="d-flex justify-content-between mb-2">
                                            <span className="fw-semibold">
                                                Inactive Users
                                            </span>

                                            <span className="text-muted">
                                                {stats.inactiveUsers}
                                            </span>
                                        </div>

                                        <div
                                            className="progress"
                                            style={{ height: "10px" }}
                                        >
                                            <div
                                                className="progress-bar bg-danger"
                                                style={{
                                                    width: `${inactivePercentage}%`,
                                                }}
                                            />
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* Registration Summary */}
                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm h-100">

                                <div className="card-body p-4">

                                    <div className="d-flex align-items-center gap-3 mb-4">

                                        <div className="dashboard-icon bg-primary bg-opacity-10 text-primary">
                                            <FaUserPlus />
                                        </div>

                                        <div>
                                            <h5 className="fw-bold mb-1">
                                                Registrations
                                            </h5>

                                            <small className="text-muted">
                                                This month
                                            </small>
                                        </div>

                                    </div>

                                    <div className="text-center py-3">

                                        <h1 className="display-4 fw-bold text-primary">
                                            {stats.newRegistrations}
                                        </h1>

                                        <p className="text-muted mb-0">
                                            New users registered
                                        </p>

                                    </div>

                                    <hr />

                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">
                                            Total Users
                                        </span>

                                        <strong>
                                            {stats.totalUsers}
                                        </strong>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;