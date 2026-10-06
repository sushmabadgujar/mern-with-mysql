import React from "react";
import "../style/order.css";

const OrderDetailModal = ({
    selectedOrder,
    onClose,
}) => {
    if (!selectedOrder) {
        return null;
    }

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

    const orderItems =
        selectedOrder.items ||
        selectedOrder.orderItems ||
        [];

    return (
        <div
            className="modal fade show orders-detail-modal"
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

                    {/* Header */}

                    <div className="modal-header">

                        <div>
                            <h5 className="modal-title fw-bold mb-1">
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
                            onClick={onClose}
                        ></button>

                    </div>

                    {/* Body */}

                    <div className="modal-body">

                        {/* Status */}

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <h6 className="fw-bold mb-0">
                                Order Status
                            </h6>

                            <span
                                className={`orders-status ${getStatusClass(
                                    selectedOrder.status
                                )}`}
                            >
                                {selectedOrder.status}
                            </span>

                        </div>

                        {/* Products */}

                        <h6 className="fw-bold mb-3">
                            Products
                        </h6>

                        <div className="orders-modal-products">

                            {orderItems.length > 0 ? (
                                orderItems.map((item) => {

                                    const product =
                                        item.product || {};

                                    return (
                                        <div
                                            className="orders-modal-product"
                                            key={item.id}
                                        >

                                            {/* Product Image */}

                                            <div className="orders-modal-image-wrapper">

                                                {product.productImage ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_API_URL}${product.productImage}`}
                                                        alt={
                                                            product.name ||
                                                            "Product"
                                                        }
                                                        className="orders-modal-image"
                                                    />
                                                ) : (
                                                    <div className="orders-modal-no-image">
                                                        No Image
                                                    </div>
                                                )}

                                            </div>

                                            {/* Product Information */}

                                            <div className="orders-modal-product-info">

                                                <h6 className="fw-bold mb-1">
                                                    {product.name ||
                                                        "Product"}
                                                </h6>

                                                <p className="text-muted mb-1">
                                                    Price: ₹
                                                    {Number(
                                                        item.price || 0
                                                    ).toFixed(2)}
                                                </p>

                                                <p className="text-muted mb-0">
                                                    Quantity:{" "}
                                                    {item.quantity}
                                                </p>

                                            </div>

                                            {/* Subtotal */}

                                            <div className="orders-modal-subtotal">

                                                <strong>
                                                    ₹
                                                    {Number(
                                                        item.subtotal || 0
                                                    ).toFixed(2)}
                                                </strong>

                                            </div>

                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-muted mb-0">
                                    No products found.
                                </p>
                            )}

                        </div>

                        <hr />

                        {/* Total */}

                        <div className="d-flex justify-content-between align-items-center">

                            <strong className="fs-5">
                                Total
                            </strong>

                            <strong className="fs-5">
                                ₹
                                {Number(
                                    selectedOrder.totalAmount || 0
                                ).toFixed(2)}
                            </strong>

                        </div>

                    </div>

                    {/* Footer */}

                    <div className="modal-footer">

                        <button
                            type="button"
                            className="btn btn-outline-dark"
                            onClick={onClose}
                        >
                            Close
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;

