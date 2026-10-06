import React from "react";
import { useState } from "react";
import { FaFileExcel, FaFilePdf, FaSearch, FaSyncAlt } from "react-icons/fa";

// const API_URL = import.meta.env.VITE_API_URL;
import {
    getUserReport,
    getProductReport,
    getOrderReport,
    getSalesReport,
    exportUsersExcel,
    exportProductsExcel,
    exportOrdersExcel,
    exportSalesExcel,
    exportUsersPDF,
    exportProductsPDF,
    exportOrdersPDF,
    exportSalesPDF,
} from "../api/reportApi";

const Reports = () => {
    const [reportType, setReportType] = useState("USER");
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [error, setError] = useState("");

    const [filters, setFilters] = useState({
        search: "",
        status: "",
        role: "",
        categoryId: "",
        minStock: "",
        maxStock: "",
        userId: "",
        startDate: "",
        endDate: "",
    });

    const [reportData, setReportData] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const buildParams = () => {
        const params = {};

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== "") {
                params[key] = value;
            }
        });

        return params;
    };

    // const getReportEndpoint = () => {
    //     switch (reportType) {
    //         case "USER":
    //             return "/api/reports/users";

    //         case "PRODUCT":
    //             return "/api/reports/products";

    //         case "ORDER":
    //             return "/api/reports/orders";

    //         case "SALES":
    //             return "/api/reports/sales";

    //         default:
    //             return "";
    //     }
    // };

    // const getExportEndpoint = (format) => {
    //     const type = reportType.toLowerCase();

    //     return `/api/reports/${type}/export/${format}`;
    // };

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError("");
            setReportData(null);

            const params = buildParams();

            let response;

            switch (reportType) {
                case "USER":
                    response = await getUserReport(params);
                    break;

                case "PRODUCT":
                    response = await getProductReport(params);
                    break;

                case "ORDER":
                    response = await getOrderReport(params);
                    break;

                case "SALES":
                    response = await getSalesReport(params);
                    break;

                default:
                    return;
            }

            setReportData(response);
        } catch (error) {
            console.error("Report Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to generate report"
            );
        } finally {
            setLoading(false);
        }
    };

    const exportReport = async (format) => {
        try {
            setExportLoading(true);
            setError("");

            const params = buildParams();

            let response;

            if (format === "excel") {
                switch (reportType) {
                    case "USER":
                        response = await exportUsersExcel(params);
                        break;

                    case "PRODUCT":
                        response = await exportProductsExcel(params);
                        break;

                    case "ORDER":
                        response = await exportOrdersExcel(params);
                        break;

                    case "SALES":
                        response = await exportSalesExcel(params);
                        break;

                    default:
                        return;
                }
            }

            if (format === "pdf") {
                switch (reportType) {
                    case "USER":
                        response = await exportUsersPDF(params);
                        break;

                    case "PRODUCT":
                        response = await exportProductsPDF(params);
                        break;

                    case "ORDER":
                        response = await exportOrdersPDF(params);
                        break;

                    case "SALES":
                        response = await exportSalesPDF(params);
                        break;

                    default:
                        return;
                }
            }

            const blob = new Blob([response.data]);

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = url;

            link.download = `${reportType.toLowerCase()}-report.${format === "excel" ? "xlsx" : "pdf"
                }`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Export Error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to export report"
            );
        } finally {
            setExportLoading(false);
        }
    };

    const resetFilters = () => {
        setFilters({
            search: "",
            status: "",
            role: "",
            categoryId: "",
            minStock: "",
            maxStock: "",
            userId: "",
            startDate: "",
            endDate: "",
        });

        setReportData(null);
        setError("");
    };

    const renderFilters = () => {
        if (reportType === "USER") {
            return (
                <>
                    <div className="col-md-4">
                        <label className="form-label">
                            Search
                        </label>

                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Name, email or mobile"
                        />
                    </div>

                    <div className="col-md-2">
                        <label className="form-label">
                            Status
                        </label>

                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="">All</option>
                            <option value="active">
                                Active
                            </option>
                            <option value="inactive">
                                Inactive
                            </option>
                        </select>
                    </div>

                    <div className="col-md-2">
                        <label className="form-label">
                            Role
                        </label>

                        <select
                            name="role"
                            value={filters.role}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="">All</option>
                            <option value="admin">
                                Admin
                            </option>
                            <option value="user">
                                User
                            </option>
                        </select>
                    </div>
                </>
            );
        }

        if (reportType === "PRODUCT") {
            return (
                <>
                    <div className="col-md-4">
                        <label className="form-label">
                            Product Search
                        </label>

                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Search product"
                        />
                    </div>

                    <div className="col-md-2">
                        <label className="form-label">
                            Category ID
                        </label>

                        <input
                            type="number"
                            name="categoryId"
                            value={filters.categoryId}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="Category ID"
                        />
                    </div>

                    <div className="col-md-2">
                        <label className="form-label">
                            Min Stock
                        </label>

                        <input
                            type="number"
                            name="minStock"
                            value={filters.minStock}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="0"
                        />
                    </div>

                    <div className="col-md-2">
                        <label className="form-label">
                            Max Stock
                        </label>

                        <input
                            type="number"
                            name="maxStock"
                            value={filters.maxStock}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="100"
                        />
                    </div>
                </>
            );
        }

        if (reportType === "ORDER") {
            return (
                <>
                    <div className="col-md-3">
                        <label className="form-label">
                            Status
                        </label>

                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleChange}
                            className="form-select"
                        >
                            <option value="">
                                All Orders
                            </option>

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="Confirmed">
                                Confirmed
                            </option>

                            <option value="Processing">
                                Processing
                            </option>

                            <option value="Shipped">
                                Shipped
                            </option>

                            <option value="Delivered">
                                Delivered
                            </option>

                            <option value="Cancelled">
                                Cancelled
                            </option>
                        </select>
                    </div>

                    <div className="col-md-3">
                        <label className="form-label">
                            User ID
                        </label>

                        <input
                            type="number"
                            name="userId"
                            value={filters.userId}
                            onChange={handleChange}
                            className="form-control"
                            placeholder="User ID"
                        />
                    </div>
                </>
            );
        }

        return null;
    };

    const renderUserReport = () => {
        if (!reportData?.users) {
            return null;
        }

        return (
            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Mobile</th>
                            <th>Status</th>
                            <th>Role</th>
                            <th>Created Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {reportData.users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.mobileNumber}</td>
                                <td>{user.status}</td>
                                <td>{user.role}</td>
                                <td>
                                    {new Date(
                                        user.createdAt
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {reportData.users.length === 0 && (
                    <div className="text-center py-4">
                        No users found.
                    </div>
                )}
            </div>
        );
    };

    const renderProductReport = () => {
        if (!reportData?.products) {
            return null;
        }

        return (
            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Created Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {reportData.products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>

                                <td>{product.name}</td>

                                <td>
                                    {product.category?.name ||
                                        "N/A"}
                                </td>

                                <td>
                                    ₹
                                    {Number(
                                        product.price
                                    ).toFixed(2)}
                                </td>

                                <td>{product.stock}</td>

                                <td>
                                    {new Date(
                                        product.createdAt
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {reportData.products.length === 0 && (
                    <div className="text-center py-4">
                        No products found.
                    </div>
                )}
            </div>
        );
    };

    const renderOrderReport = () => {
        if (!reportData?.orders) {
            return null;
        }

        return (
            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Email</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {reportData.orders.map((order) => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>

                                <td>
                                    {order.user?.name ||
                                        "N/A"}
                                </td>

                                <td>
                                    {order.user?.email ||
                                        "N/A"}
                                </td>

                                <td>
                                    ₹
                                    {Number(
                                        order.totalAmount
                                    ).toFixed(2)}
                                </td>

                                <td>{order.status}</td>

                                <td>
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {reportData.orders.length === 0 && (
                    <div className="text-center py-4">
                        No orders found.
                    </div>
                )}
            </div>
        );
    };

    const renderSalesReport = () => {
        if (!reportData?.summary) {
            return null;
        }

        return (
            <>
                <div className="row g-3 mb-4">
                    <div className="col-md-3">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h6 className="text-muted">
                                    Total Orders
                                </h6>

                                <h3>
                                    {
                                        reportData.summary
                                            .totalOrders
                                    }
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h6 className="text-muted">
                                    Completed Orders
                                </h6>

                                <h3>
                                    {
                                        reportData.summary
                                            .completedOrders
                                    }
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h6 className="text-muted">
                                    Total Sales
                                </h6>

                                <h3>
                                    ₹
                                    {Number(
                                        reportData.summary
                                            .totalSales
                                    ).toFixed(2)}
                                </h3>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h6 className="text-muted">
                                    Average Order
                                </h6>

                                <h3>
                                    ₹
                                    {Number(
                                        reportData.summary
                                            .averageOrderValue
                                    ).toFixed(2)}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>

                {reportData.orders && (
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Email</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {reportData.orders.map(
                                    (order) => (
                                        <tr key={order.id}>
                                            <td>
                                                #{order.id}
                                            </td>

                                            <td>
                                                {order.user
                                                    ?.name ||
                                                    "N/A"}
                                            </td>

                                            <td>
                                                {order.user
                                                    ?.email ||
                                                    "N/A"}
                                            </td>

                                            <td>
                                                ₹
                                                {Number(
                                                    order.totalAmount
                                                ).toFixed(2)}
                                            </td>

                                            <td>
                                                {
                                                    order.status
                                                }
                                            </td>

                                            <td>
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </>
        );
    };

    const renderReport = () => {
        if (!reportData) {
            return (
                <div className="text-center text-muted py-5">
                    <h5>No report generated</h5>
                    <p>
                        Select filters and click Generate
                        Report.
                    </p>
                </div>
            );
        }

        switch (reportType) {
            case "USER":
                return renderUserReport();

            case "PRODUCT":
                return renderProductReport();

            case "ORDER":
                return renderOrderReport();

            case "SALES":
                return renderSalesReport();

            default:
                return null;
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        Reports
                    </h2>

                    <p className="text-muted mb-0">
                        Generate and export system reports
                    </p>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-3">
                            <label className="form-label fw-semibold">
                                Report Type
                            </label>

                            <select
                                value={reportType}
                                onChange={(e) => {
                                    setReportType(
                                        e.target.value
                                    );
                                    setReportData(null);
                                    setError("");
                                }}
                                className="form-select"
                            >
                                <option value="USER">
                                    User Report
                                </option>

                                <option value="PRODUCT">
                                    Product Report
                                </option>

                                <option value="ORDER">
                                    Order Report
                                </option>

                                <option value="SALES">
                                    Sales Report
                                </option>
                            </select>
                        </div>

                        {renderFilters()}

                        <div className="col-md-3">
                            <label className="form-label">
                                Start Date
                            </label>

                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-3">
                            <label className="form-label">
                                End Date
                            </label>

                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="d-flex flex-wrap gap-2 mt-4">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={fetchReport}
                            disabled={loading}
                        >
                            <FaSearch className="me-2" />

                            {loading
                                ? "Generating..."
                                : "Generate Report"}
                        </button>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={resetFilters}
                        >
                            <FaSyncAlt className="me-2" />
                            Reset
                        </button>

                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() =>
                                exportReport("excel")
                            }
                            disabled={exportLoading}
                        >
                            <FaFileExcel className="me-2" />
                            Export Excel
                        </button>

                        <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() =>
                                exportReport("pdf")
                            }
                            disabled={exportLoading}
                        >
                            <FaFilePdf className="me-2" />
                            Export PDF
                        </button>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-semibold">
                        {reportType === "USER" &&
                            "User Report"}

                        {reportType === "PRODUCT" &&
                            "Product Report"}

                        {reportType === "ORDER" &&
                            "Order Report"}

                        {reportType === "SALES" &&
                            "Sales Report"}
                    </h5>
                </div>

                <div className="card-body">
                    {renderReport()}
                </div>
            </div>
        </div>
    );
};

export default Reports;
