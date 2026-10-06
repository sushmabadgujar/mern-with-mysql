import React, { useEffect, useState } from "react";
import {
    FaEye,
    FaSearch,
    FaSyncAlt,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import { showError, showSuccess } from "../utils/toast";
import {
    getAllOrders,
    updateOrderStatus,
} from "../api/orderApi";
import "../style/orderManagement.css";

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [loading, setLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const [totalOrders, setTotalOrders] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [sortBy, setSortBy] = useState("id");
    const [sortOrder, setSortOrder] = useState("DESC");

    const [status, setStatus] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response = await getAllOrders({
                page,
                limit,
                search,
                sortBy,
                sortOrder,
            });
            console.log("response is ", response);
            const data = response.data?.data;

            setOrders(data?.orders || []);
            setTotalOrders(data?.totalOrders || 0);
            setTotalPages(data?.totalPages || 1);
            
        } catch (error) {
            console.log(error);

            showError(
                error.response?.data?.message ||
                "Unable to fetch orders."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, limit, search, sortBy, sortOrder]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleSort = (e) => {
        const value = e.target.value;

        if (value.includes("-")) {
            const [field, order] = value.split("-");

            setSortBy(field);
            setSortOrder(order);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            setStatusLoading(true);

            await updateOrderStatus(orderId, {
                status: newStatus,
            });

            showSuccess("Order status updated successfully.");

            fetchOrders();

            if (selectedOrder?.id === orderId) {
                setSelectedOrder((prev) => ({
                    ...prev,
                    status: newStatus,
                }));
            }
        } catch (error) {
            console.error(error);

            showError(
                error.response?.data?.message ||
                "Unable to update order status."
            );
        } finally {
            setStatusLoading(false);
        }
    };

    const openOrderDetails = (order) => {
        setSelectedOrder(order);
        setStatus(order.status || "");
    };

    const closeOrderDetails = () => {
        setSelectedOrder(null);
        setStatus("");
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusClass = (orderStatus) => {
        switch (orderStatus?.toLowerCase()) {
            case "pending":
                return "bg-warning text-dark";

            case "confirmed":
                return "bg-primary";

            case "processing":
                return "bg-info text-dark";

            case "shipped":
                return "bg-primary";

            case "delivered":
                return "bg-success";

            case "cancelled":
                return "bg-danger";

            default:
                return "bg-secondary";
        }
    };

    const getPaymentClass = (paymentStatus) => {
        switch (paymentStatus?.toLowerCase()) {
            case "paid":
                return "bg-success";

            case "pending":
                return "bg-warning text-dark";

            case "failed":
                return "bg-danger";

            default:
                return "bg-secondary";
        }
    };

    return (
        <div className="order-management-page">

            {/* Header */}
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">

                <div>
                    <h2 className="fw-bold mb-1">
                        Order Management
                    </h2>

                    <p className="text-muted mb-0">
                        Manage and track customer orders.
                    </p>
                </div>

                <button
                    className="btn btn-primary d-flex align-items-center gap-2"
                    onClick={fetchOrders}
                    disabled={loading}
                >
                    <FaSyncAlt />
                    Refresh
                </button>

            </div>

            {/* Filters */}
            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">

                    <div className="row g-3 align-items-center">

                        <div className="col-lg-6">
                            <div className="order-search-box">
                                <FaSearch />

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by order, user or email..."
                                    value={search}
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>

                        <div className="col-lg-3">
                            <select
                                className="form-select"
                                value={`${sortBy}-${sortOrder}`}
                                onChange={handleSort}
                            >
                                <option value="id-DESC">
                                    Latest Orders
                                </option>

                                <option value="id-ASC">
                                    Oldest Orders
                                </option>

                                <option value="totalAmount-DESC">
                                    Highest Amount
                                </option>

                                <option value="totalAmount-ASC">
                                    Lowest Amount
                                </option>
                            </select>
                        </div>

                        <div className="col-lg-3">
                            <select
                                className="form-select"
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                            >
                                <option value="5">
                                    5 Orders
                                </option>

                                <option value="10">
                                    10 Orders
                                </option>

                                <option value="20">
                                    20 Orders
                                </option>

                                <option value="50">
                                    50 Orders
                                </option>
                            </select>
                        </div>

                    </div>

                </div>
            </div>

            {/* Orders Table */}
            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white border-0 py-3">

                    <div className="d-flex justify-content-between align-items-center">

                        <h5 className="fw-bold mb-0">
                            Orders
                        </h5>

                        <span className="badge bg-primary">
                            {totalOrders} Orders
                        </span>

                    </div>

                </div>

                <div className="card-body p-0">

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" />
                            <p className="text-muted mt-3 mb-0">
                                Loading orders...
                            </p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-5">
                            <h5 className="text-muted">
                                No orders found
                            </h5>

                            <p className="text-muted mb-0">
                                There are no orders matching your search.
                            </p>
                        </div>
                    ) : (
                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Order</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Payment</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th className="text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {orders.map((order, index) => (
                                        <tr key={order.id}>

                                            <td>
                                                {(page - 1) * limit +
                                                    index +
                                                    1}
                                            </td>

                                            <td>
                                                <strong>
                                                    #{order.id}
                                                </strong>
                                            </td>

                                            <td>
                                                <div className="fw-semibold">
                                                    {order.user?.name ||
                                                        order.user?.firstName ||
                                                        "N/A"}
                                                </div>

                                                <small className="text-muted">
                                                    {order.user?.email || "-"}
                                                </small>
                                            </td>

                                            <td>
                                                <strong>
                                                    ₹{order.totalAmount}
                                                </strong>
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getPaymentClass(
                                                        order.paymentStatus
                                                    )}`}
                                                >
                                                    {order.paymentStatus ||
                                                        "Pending"}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`badge ${getStatusClass(
                                                        order.status
                                                    )}`}
                                                >
                                                    {order.status ||
                                                        "Pending"}
                                                </span>
                                            </td>

                                            <td>
                                                {formatDate(
                                                    order.createdAt
                                                )}
                                            </td>

                                            <td className="text-center">

                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() =>
                                                        openOrderDetails(
                                                            order
                                                        )
                                                    }
                                                >
                                                    <FaEye />
                                                </button>

                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

                {/* Pagination */}
                {orders.length > 0 && (
                    <div className="card-footer bg-white border-0">

                        <div className="d-flex justify-content-between align-items-center">

                            <small className="text-muted">
                                Page {page} of {totalPages}
                            </small>

                            <div className="d-flex gap-2">

                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    disabled={page === 1}
                                    onClick={() =>
                                        setPage((prev) => prev - 1)
                                    }
                                >
                                    <FaChevronLeft />
                                </button>

                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    disabled={
                                        page === totalPages
                                    }
                                    onClick={() =>
                                        setPage((prev) => prev + 1)
                                    }
                                >
                                    <FaChevronRight />
                                </button>

                            </div>

                        </div>

                    </div>
                )}

            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div
                    className="modal fade show order-detail-modal"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                    }}
                    tabIndex="-1"
                    role="dialog"
                >
                    <div
                        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
                        role="document"
                    >

                        <div className="modal-content">

                            <div className="modal-header">

                                <div>
                                    <h5 className="modal-title fw-bold">
                                        Order #{selectedOrder.id}
                                    </h5>

                                    <small className="text-muted">
                                        {formatDate(
                                            selectedOrder.createdAt
                                        )}
                                    </small>
                                </div>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeOrderDetails}
                                />
                            </div>

                            <div className="modal-body">

                                {/* Customer */}
                                <div className="order-detail-section">

                                    <h6 className="fw-bold mb-3">
                                        Customer Information
                                    </h6>

                                    <div className="row g-3">

                                        <div className="col-md-6">
                                            <small className="text-muted">
                                                Name
                                            </small>

                                            <div className="fw-semibold">
                                                {selectedOrder.user?.name ||
                                                    selectedOrder.user?.firstName ||
                                                    "N/A"}
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <small className="text-muted">
                                                Email
                                            </small>

                                            <div className="fw-semibold">
                                                {selectedOrder.user?.email ||
                                                    "-"}
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                <hr />

                                {/* Order Items */}
                                <div className="order-detail-section">

                                    <h6 className="fw-bold mb-3">
                                        Order Items
                                    </h6>

                                    {selectedOrder.items?.length > 0 ? (
                                        <div className="table-responsive">

                                            <table className="table table-bordered align-middle">

                                                <thead>
                                                    <tr>
                                                        <th>Product</th>
                                                        <th>Price</th>
                                                        <th>Quantity</th>
                                                        <th>Subtotal</th>
                                                    </tr>
                                                </thead>

                                                <tbody>

                                                    {selectedOrder.items.map(
                                                        (item) => (
                                                            <tr key={item.id}>

                                                                <td>
                                                                    {item.product
                                                                        ?.name ||
                                                                        item.productName ||
                                                                        "N/A"}
                                                                </td>

                                                                <td>
                                                                    ₹
                                                                    {item.price ||
                                                                        item.product
                                                                            ?.price ||
                                                                        0}
                                                                </td>

                                                                <td>
                                                                    {item.quantity}
                                                                </td>

                                                                <td>
                                                                    ₹
                                                                    {item.subtotal ||
                                                                        (
                                                                            Number(
                                                                                item.price ||
                                                                                item.product
                                                                                    ?.price ||
                                                                                0
                                                                            ) *
                                                                            Number(
                                                                                item.quantity ||
                                                                                0
                                                                            )
                                                                        ).toFixed(
                                                                            2
                                                                        )}
                                                                </td>

                                                            </tr>
                                                        )
                                                    )}

                                                </tbody>

                                            </table>

                                        </div>
                                    ) : (
                                        <p className="text-muted">
                                            No order items available.
                                        </p>
                                    )}

                                </div>

                                <hr />

                                {/* Status */}
                                <div className="order-detail-section">

                                    <h6 className="fw-bold mb-3">
                                        Order Status
                                    </h6>

                                    <div className="row align-items-end">

                                        <div className="col-md-8">

                                            <label className="form-label">
                                                Status
                                            </label>

                                            <select
                                                className="form-select"
                                                value={status}
                                                onChange={(e) =>
                                                    setStatus(
                                                        e.target.value
                                                    )
                                                }
                                            >
                                                <option value="pending">
                                                    Pending
                                                </option>

                                                <option value="confirmed">
                                                    Confirmed
                                                </option>

                                                <option value="processing">
                                                    Processing
                                                </option>

                                                <option value="shipped">
                                                    Shipped
                                                </option>

                                                <option value="delivered">
                                                    Delivered
                                                </option>

                                                <option value="cancelled">
                                                    Cancelled
                                                </option>
                                            </select>

                                        </div>

                                        <div className="col-md-4">

                                            <button
                                                className="btn btn-primary w-100"
                                                disabled={
                                                    statusLoading ||
                                                    !status ||
                                                    status ===
                                                    selectedOrder.status
                                                }
                                                onClick={() =>
                                                    handleStatusChange(
                                                        selectedOrder.id,
                                                        status
                                                    )
                                                }
                                            >
                                                {statusLoading
                                                    ? "Updating..."
                                                    : "Update Status"}
                                            </button>

                                        </div>

                                    </div>

                                </div>

                                <hr />

                                {/* Total */}
                                <div className="d-flex justify-content-between align-items-center">

                                    <h5 className="fw-bold mb-0">
                                        Total Amount
                                    </h5>

                                    <h4 className="fw-bold text-primary mb-0">
                                        ₹
                                        {
                                            selectedOrder.totalAmount
                                        }
                                    </h4>

                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={closeOrderDetails}
                                >
                                    Close
                                </button>

                            </div>

                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default OrderManagement;