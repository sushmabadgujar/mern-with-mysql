import React, { useEffect, useState } from "react";
import { showSuccess, showError } from "../utils/toast";
import { getAllCarts, deleteCart } from "../api/cartApi";

const CartManagement = () => {
    const [carts, setCarts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 5,
        totalPages: 1,
        totalItems: 0,
    });

    const fetchCarts = async () => {
        try {
            setLoading(true);

            const response = await getAllCarts({
                page: pagination.page,
                limit: pagination.limit,
                search,
                sortBy: "id",
                sortOrder: "DESC",
            });

            const data = response.data;

            console.log("Cart API Response:", data);

            setCarts(data.carts || []);

            setPagination((prev) => ({
                ...prev,
                totalPages: data.pagination?.totalPages || 1,
                totalItems:
                    data.pagination?.total ||
                    data.carts?.length ||
                    0,
            }));
        } catch (error) {
            console.log(error);

            showError(
                error.response?.data?.message ||
                "Failed to fetch carts"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCarts();
    }, [
        pagination.page,
        pagination.limit,
        search,
    ]);

    const handleDelete = async (cartId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this cart?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);

            await deleteCart(cartId);

            showSuccess("Cart deleted successfully");

            if (
                carts.length === 1 &&
                pagination.page > 1
            ) {
                setPagination((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                }));
            } else {
                await fetchCarts();
            }
        } catch (error) {
            console.log(error);

            showError(
                error.response?.data?.message ||
                "Failed to delete cart"
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        if (
            page < 1 ||
            page > pagination.totalPages
        ) {
            return;
        }

        setPagination((prev) => ({
            ...prev,
            page,
        }));
    };

    return (
        <div className="container-fluid py-4">

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1">
                        Cart Management
                    </h3>

                    <p className="text-muted mb-0">
                        Manage customer shopping carts
                    </p>
                </div>
            </div>

            {/* Main Card */}

            <div className="card shadow-sm">

                {/* Card Header */}

                <div className="card-header">

                    <div className="row align-items-center g-3">

                        <div className="col-md-6">
                            <h5 className="mb-0">
                                Customer Carts
                            </h5>
                        </div>

                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search user, email or product..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);

                                    setPagination((prev) => ({
                                        ...prev,
                                        page: 1,
                                    }));
                                }}
                            />
                        </div>

                    </div>

                </div>

                {/* Cart List */}

                <div className="card-body">

                    {loading ? (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border"
                                role="status"
                            />

                            <p className="mt-3 mb-0 text-muted">
                                Loading carts...
                            </p>
                        </div>
                    ) : carts.length === 0 ? (
                        <div className="text-center py-5">
                            <h5>
                                No carts found
                            </h5>

                            <p className="text-muted mb-0">
                                No customer carts are available.
                            </p>
                        </div>
                    ) : (
                        carts.map((cart) => {

                            const items = cart.items || [];

                            const cartTotal = items.reduce(
                                (total, item) => {
                                    const price =
                                        Number(
                                            item.product?.price
                                        ) || 0;

                                    const quantity =
                                        Number(
                                            item.quantity
                                        ) || 0;

                                    return (
                                        total +
                                        price * quantity
                                    );
                                },
                                0
                            );

                            const totalQuantity =
                                items.reduce(
                                    (total, item) =>
                                        total +
                                        (Number(
                                            item.quantity
                                        ) || 0),
                                    0
                                );

                            return (
                                <div
                                    className="card border mb-4"
                                    key={cart.cartId || cart.id}
                                >

                                    {/* Cart Header */}

                                    <div className="card-header bg-light">

                                        <div className="row align-items-center">

                                            <div className="col-md-6">

                                                <div className="d-flex align-items-center gap-2">

                                                    <span className="fw-bold">
                                                        Cart #
                                                        {cart.cartId ||
                                                            cart.id}
                                                    </span>

                                                    <span className="badge bg-primary">
                                                        {items.length}{" "}
                                                        {items.length === 1
                                                            ? "Product"
                                                            : "Products"}
                                                    </span>

                                                </div>

                                            </div>

                                            <div className="col-md-6 text-md-end mt-2 mt-md-0">

                                                <small className="text-muted">
                                                    Created:{" "}
                                                    {cart.createdAt
                                                        ? new Date(
                                                            cart.createdAt
                                                        ).toLocaleDateString()
                                                        : "-"}
                                                </small>

                                            </div>

                                        </div>

                                    </div>

                                    {/* User Information */}

                                    <div className="card-body pb-3">

                                        <div className="row mb-4">

                                            <div className="col-md-4">
                                                <small className="text-muted d-block">
                                                    Customer
                                                </small>

                                                <span className="fw-semibold">
                                                    {cart.user?.name ||
                                                        "-"}
                                                </span>
                                            </div>

                                            <div className="col-md-4 mt-3 mt-md-0">
                                                <small className="text-muted d-block">
                                                    Email
                                                </small>

                                                <span>
                                                    {cart.user?.email ||
                                                        "-"}
                                                </span>
                                            </div>

                                            <div className="col-md-4 mt-3 mt-md-0">
                                                <small className="text-muted d-block">
                                                    Total Quantity
                                                </small>

                                                <span className="badge bg-secondary">
                                                    {totalQuantity}
                                                </span>
                                            </div>

                                        </div>

                                        {/* Products */}

                                        <div className="table-responsive">

                                            <table className="table table-bordered align-middle mb-0">

                                                <thead className="table-light">

                                                    <tr>
                                                        <th>
                                                            #
                                                        </th>

                                                        <th>
                                                            Product
                                                        </th>

                                                        <th>
                                                            Price
                                                        </th>

                                                        <th>
                                                            Quantity
                                                        </th>

                                                        <th>
                                                            Subtotal
                                                        </th>
                                                    </tr>

                                                </thead>

                                                <tbody>

                                                    {items.map(
                                                        (
                                                            item,
                                                            index
                                                        ) => {

                                                            const price =
                                                                Number(
                                                                    item.product?.price
                                                                ) ||
                                                                0;

                                                            const quantity =
                                                                Number(
                                                                    item.quantity
                                                                ) ||
                                                                0;

                                                            const subtotal =
                                                                Number(
                                                                    item.subtotal
                                                                ) ||
                                                                price *
                                                                quantity;

                                                            return (
                                                                <tr
                                                                    key={
                                                                        item.id
                                                                    }
                                                                >

                                                                    <td>
                                                                        {index +
                                                                            1}
                                                                    </td>

                                                                    <td>
                                                                        <div className="fw-semibold">
                                                                            {item
                                                                                .product
                                                                                ?.name ||
                                                                                "-"}
                                                                        </div>

                                                                        <small className="text-muted">
                                                                            Product
                                                                            ID:{" "}
                                                                            {
                                                                                item.productId
                                                                            }
                                                                        </small>
                                                                    </td>

                                                                    <td>
                                                                        ₹
                                                                        {price.toFixed(
                                                                            2
                                                                        )}
                                                                    </td>

                                                                    <td>
                                                                        <span className="badge bg-primary">
                                                                            {
                                                                                quantity
                                                                            }
                                                                        </span>
                                                                    </td>

                                                                    <td className="fw-semibold">
                                                                        ₹
                                                                        {subtotal.toFixed(
                                                                            2
                                                                        )}
                                                                    </td>

                                                                </tr>
                                                            );
                                                        }
                                                    )}

                                                </tbody>

                                            </table>

                                        </div>

                                        {/* Cart Footer */}

                                        <div className="d-flex justify-content-between align-items-center mt-4">

                                            <div>
                                                <small className="text-muted d-block">
                                                    Cart Total
                                                </small>

                                                <h5 className="mb-0 fw-bold">
                                                    ₹
                                                    {cartTotal.toFixed(
                                                        2
                                                    )}
                                                </h5>
                                            </div>

                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() =>
                                                    handleDelete(
                                                        cart.cartId ||
                                                        cart.id
                                                    )
                                                }
                                                disabled={
                                                    loading
                                                }
                                            >
                                                Delete Cart
                                            </button>

                                        </div>

                                    </div>

                                </div>
                            );
                        })
                    )}

                </div>

                {/* Pagination */}

                {pagination.totalPages > 1 && (
                    <div className="card-footer">

                        <div className="d-flex justify-content-between align-items-center">

                            <span className="text-muted">
                                Total Carts:{" "}
                                {pagination.totalItems}
                            </span>

                            <nav>

                                <ul className="pagination mb-0">

                                    <li
                                        className={`page-item ${pagination.page ===
                                            1
                                            ? "disabled"
                                            : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.page -
                                                    1
                                                )
                                            }
                                        >
                                            Previous
                                        </button>
                                    </li>

                                    {Array.from(
                                        {
                                            length:
                                                pagination.totalPages,
                                        },
                                        (_, index) =>
                                            index + 1
                                    ).map((page) => (
                                        <li
                                            key={page}
                                            className={`page-item ${pagination.page ===
                                                page
                                                ? "active"
                                                : ""
                                                }`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() =>
                                                    handlePageChange(
                                                        page
                                                    )
                                                }
                                            >
                                                {page}
                                            </button>
                                        </li>
                                    ))}

                                    <li
                                        className={`page-item ${pagination.page ===
                                            pagination.totalPages
                                            ? "disabled"
                                            : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.page +
                                                    1
                                                )
                                            }
                                        >
                                            Next
                                        </button>
                                    </li>

                                </ul>

                            </nav>

                        </div>

                    </div>
                )}

            </div>

        </div>
    );
};

export default CartManagement;