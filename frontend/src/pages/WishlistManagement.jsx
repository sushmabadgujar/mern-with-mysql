import React, { useEffect, useState } from "react";
import {
    getAllWishlists,
    deleteWishlist,
} from "../api/wishlistApi";
import { showError, showSuccess } from "../utils/toast";

const WishlistManagement = () => {
    const [wishlists, setWishlists] = useState([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: 5,
    });

    const [search, setSearch] = useState("");

    const fetchWishlists = async () => {
        try {
            setLoading(true);

            const response = await getAllWishlists({
                page,
                limit: 5,
                search,
                sortBy: "id",
                sortOrder: "DESC",
            });
            console.log("wishlist is ",response);
            setWishlists(response.data.data || []);
            setPagination(response.data.pagination || {});
        } catch (error) {
            console.error("Wishlist fetch error:", error);

            showError(
                error.response?.data?.message ||
                "Failed to fetch wishlists"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlists();
    }, [page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchWishlists();
    };

    const handleDelete = async (id) => {
        try {
            console.log("id is ",id);
            await deleteWishlist(id);

            showSuccess("Wishlist deleted successfully");

            fetchWishlists();
        } catch (error) {
            console.error("Delete wishlist error:", error);

            showError(
                error.response?.data?.message ||
                "Failed to delete wishlist"
            );
        }
    };

    return (
        <div className="container-fluid">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Wishlist Management</h3>
            </div>

            <form onSubmit={handleSearch} className="mb-4">
                <div className="row g-2">
                    <div className="col-md-10">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search user or product..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />
                    </div>

                    <div className="col-md-2">
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </form>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border"></div>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Email</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Image</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {wishlists.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="7"
                                        className="text-center"
                                    >
                                        No wishlist items found.
                                    </td>
                                </tr>
                            ) : (
                                wishlists.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>

                                        <td>
                                            {item.user?.name}
                                        </td>

                                        <td>
                                            {item.user?.email}
                                        </td>

                                        <td>
                                            {item.product?.name}
                                        </td>

                                        <td>
                                            ₹{item.product?.price}
                                        </td>

                                        <td>
                                            {item.product?.productImage ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL}${item.product.productImage}`}
                                                    alt={item.product.name}
                                                    width="60"
                                                    height="60"
                                                    style={{
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            ) : (
                                                "No Image"
                                            )}
                                        </td>

                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default WishlistManagement;