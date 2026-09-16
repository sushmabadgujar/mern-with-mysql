import React, { useEffect, useState } from "react";
import { showSuccess, showError } from "../utils/toast";
import { getAllCarts, deleteCart } from "../api/cartApi";

const CartManagement = () => {
    const [cart, setCart] = useState({
        cartId: null,
        items: [],
        total: 0,
    });
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
            console.log(response);
            const data = response.data;

            console.log("Cart Response:", data);

            setCarts(data.carts || []);

            setPagination((prev) => ({
                ...prev,
                totalPages: data.pagination?.totalPages || 1,
                totalItems: data.pagination?.total || 0,
            }));
        } catch (error) {
            console.log(error.response);
            showError(
                error.response?.data?.message || "Failed to fetch carts"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCarts();
    }, [pagination.page, pagination.limit, search]);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this cart?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);

            await deleteCart(id);

            showSuccess("Cart deleted successfully");

            if (carts.length === 1 && pagination.page > 1) {
                setPagination((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                }));
            } else {
                await fetchCarts();
            }
        } catch (error) {
            console.log(error.response);

            showError(
                error.response?.data?.message || "Failed to delete cart"
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > pagination.totalPages) {
            return;
        }

        setPagination((prev) => ({
            ...prev,
            page,
        }));
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h3 className="mb-1">Cart Management</h3>
                    <p className="text-muted mb-0">
                        Manage customer shopping carts
                    </p>
                </div>
            </div>

            <div className="card shadow-sm">
                <div className="card-header">
                    <div className="row align-items-center g-3">
                        <div className="col-md-6">
                            <h5 className="mb-0">Shopping Carts</h5>
                        </div>

                        <div className="col-md-6">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search carts..."
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

                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                    <th>Created At</th>
                                    <th className="text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan="9"
                                            className="text-center py-4"
                                        >
                                            Loading...
                                        </td>
                                    </tr>
                                ) : !cart || cart.items?.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="text-center py-4"
                                        >
                                            No carts found
                                        </td>
                                    </tr>
                                ) : (
                                    cart.items.map((item) => {
                                        const quantity = Number(item.quantity) || 0;

                                        const price =
                                            Number(item.product?.price) || 0;

                                        const total =
                                            Number(item.subtotal) || quantity * price;

                                        return (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>

                                                <td className="fw-semibold">
                                                    {item.product?.name || "-"}
                                                </td>

                                                <td>
                                                    <span className="badge bg-primary">
                                                        {quantity}
                                                    </span>
                                                </td>

                                                <td>
                                                    ₹{price.toFixed(2)}
                                                </td>

                                                <td className="fw-semibold">
                                                    ₹{total.toFixed(2)}
                                                </td>

                                                <td>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(item.id)}
                                                        disabled={loading}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {pagination.totalPages > 1 && (
                    <div className="card-footer">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted">
                                Total Cart Items: {pagination.totalItems}
                            </span>

                            <nav>
                                <ul className="pagination mb-0">
                                    <li
                                        className={`page-item ${pagination.page === 1
                                            ? "disabled"
                                            : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() =>
                                                handlePageChange(
                                                    pagination.page - 1
                                                )
                                            }
                                        >
                                            Previous
                                        </button>
                                    </li>

                                    {Array.from(
                                        {
                                            length: pagination.totalPages,
                                        },
                                        (_, index) => index + 1
                                    ).map((page) => (
                                        <li
                                            key={page}
                                            className={`page-item ${pagination.page === page
                                                ? "active"
                                                : ""
                                                }`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() =>
                                                    handlePageChange(page)
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
                                                    pagination.page + 1
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

