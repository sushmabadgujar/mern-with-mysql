import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../../api/orderApi";
import { showError } from "../../utils/toast";
// import "../../style/orders.css";
import OrderDetailModal from "../../components/OrderDetailModal";
import "../../style/order.css";
const Orders = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const fetchOrders = async () => {
        try {
            setLoading(true);

            const response = await getMyOrders();
            console.log(response);
            console.log("My Orders Response:", response.data);

            setOrders(
                Array.isArray(response.data)
                    ? response.data
                    : response.data?.orders || []
            );
        } catch (error) {
            console.error("Get orders error:", error);

            showError(
                error.response?.data?.message ||
                "Failed to load orders"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const getStatusClass = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "orders-status-pending";

            case "processing":
                return "orders-status-processing";

            case "shipped":
                return "orders-status-shipped";

            case "delivered":
                return "orders-status-delivered";

            case "cancelled":
                return "orders-status-cancelled";

            default:
                return "orders-status-default";
        }
    };

    const formatDate = (date) => {
        if (!date) {
            return "-";
        }

        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="container py-5 text-center orders-page">

                <div
                    className="spinner-border"
                    role="status"
                ></div>

                <p className="mt-3">
                    Loading your orders...
                </p>

            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="container py-5 orders-page">

                <div className="orders-empty text-center">

                    <div className="orders-empty-icon">
                        📦
                    </div>

                    <h3 className="fw-bold">
                        No Orders Yet
                    </h3>

                    <p className="text-muted">
                        You haven't placed any orders yet.
                    </p>

                    <button
                        type="button"
                        className="btn btn-dark"
                        onClick={() => navigate("/shop")}
                    >
                        Start Shopping
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="container py-5 orders-page">

            {/* Header */}

            <div className="orders-header mb-4">

                <h2 className="fw-bold mb-1">
                    My Orders
                </h2>

                <p className="text-muted mb-0">
                    View and manage your orders
                </p>

            </div>

            {/* Orders */}

            <div className="orders-list">

                {orders.map((order) => {

                    const items =
                        order.items ||
                        order.orderItems ||
                        [];

                    const totalItems = items.reduce(
                        (total, item) =>
                            total + Number(item.quantity || 0),
                        0
                    );

                    return (
                        <div
                            className="card orders-card mb-3"
                            key={order.id}
                        >

                            <div className="card-body">

                                <div className="row align-items-center g-3">

                                    {/* Order */}

                                    <div className="col-lg-2 col-md-6">

                                        <div className="orders-label">
                                            Order
                                        </div>

                                        <div className="orders-value">
                                            #{order.id}
                                        </div>

                                    </div>

                                    {/* Date */}

                                    <div className="col-lg-2 col-md-6">

                                        <div className="orders-label">
                                            Date
                                        </div>

                                        <div className="orders-value">
                                            {formatDate(
                                                order.createdAt
                                            )}
                                        </div>

                                    </div>

                                    {/* Items */}

                                    <div className="col-lg-2 col-md-6">

                                        <div className="orders-label">
                                            Items
                                        </div>

                                        <div className="orders-value">
                                            {totalItems}
                                        </div>

                                    </div>

                                    {/* Total */}

                                    <div className="col-lg-2 col-md-6">

                                        <div className="orders-label">
                                            Total
                                        </div>

                                        <div className="orders-value">
                                            ₹
                                            {Number(
                                                order.totalAmount || 0
                                            ).toFixed(2)}
                                        </div>

                                    </div>

                                    {/* Status */}

                                    <div className="col-lg-2 col-md-6">

                                        <div className="orders-label">
                                            Status
                                        </div>

                                        <span
                                            className={`orders-status ${getStatusClass(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>

                                    </div>

                                    {/* Action */}

                                    <div className="col-lg-2 col-md-6 text-lg-end">

                                        <button
                                            type="button"
                                            className="btn btn-dark orders-view-btn"
                                            // onClick={() =>
                                            //     navigate(
                                            //         `/orders/${order.id}`
                                            //     )
                                            // }
                                           onClick={() => setSelectedOrder(order)}
                                        >
                                            View Details
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>
                    );
                })}

            </div>
                <OrderDetailModal
    selectedOrder={selectedOrder}
    onClose={() => setSelectedOrder(null)}
/>
        </div>
    );
};

export default Orders;

