import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProducts } from "../api/productApi";
import { addToCart } from "../api/cartApi";
import { showError, showSuccess } from "../utils/toast";
import { addWishlist, getMyWishlist,removeWishlist } from "../api/wishlistApi";
// import "./Shop.css";
import "../style/shop.css";
const Shop = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalItems: 0,
    });
    const [wishlistIds, setWishlistIds] = useState([]);
    const fetchProducts = async () => {
        try {
            setLoading(true);

            const response = await getProducts({
                page,
                limit: 8,
                search,
            });

            console.log("Products Response:", response.data);

            setProducts(response.data.data || []);

            setPagination(response.data.pagination || {});
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await getMyWishlist();
                console.log("response is ",response);
                const ids = (response.data.wishlist || response.data).map(
                    (item) => item.productId
                );

                setWishlistIds(ids);
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            }
        };

        fetchWishlist();
    }, []);
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchProducts();
    };
    const handleAddToCart = async (productId) => {
        try {
            await addToCart({
                productId,
                quantity: 1,
            });

            showSuccess("Product added to cart");
        } catch (error) {
            console.error("Add to cart error:", error);

            showError(
                error.response?.data?.message ||
                "Failed to add product to cart"
            );
        }
    };
    const handleBuyNow = (product) => {
        navigate("/checkout", {
            state: {
                buyNow: true,
                productId: product.id,
                quantity: 1,
            },
        });
    };
    const handleWishlist = async (productId) => {
        try {
            if (wishlistIds.includes(productId)) {
                await removeWishlist(productId);

                setWishlistIds((prev) =>
                    prev.filter((id) => id !== productId)
                );

                showSuccess("Removed from wishlist");
            } else {
                await addWishlist(productId);

                setWishlistIds((prev) => [
                    ...prev,
                    productId,
                ]);

                showSuccess("Added to wishlist");
            }
        } catch (error) {
            console.log("Wishlist error:", error);

            showError(
                error.response?.data?.message ||
                "Failed to update wishlist"
            );
        }
    };

    return (
        <div className="container py-4 shop-page">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Shop</h2>
                    <p className="text-muted mb-0">
                        Browse our latest products
                    </p>
                </div>

                <Link to="/product-cart" className="btn btn-dark">
                    Cart
                </Link>
            </div>

            {/* Search */}
            <div className="shop-filter-card mb-4">
                <form onSubmit={handleSearch}>
                    <div className="row g-2">

                        <div className="col-md-10">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
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
            </div>

            {/* Product Count */}
            <div className="mb-3">
                <span className="text-muted">
                    {pagination.totalItems} products found
                </span>
            </div>

            {/* Products */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border" role="status"></div>
                    <p className="mt-2 text-muted">
                        Loading products...
                    </p>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-5">
                    <h5>No products found</h5>
                    <p className="text-muted">
                        Try another search.
                    </p>
                </div>
            ) : (
                <div className="row g-4">

                    {products.map((product) => (
                        <div
                            className="col-12 col-sm-6 col-md-4 col-lg-3"
                            key={product.id}
                        >
                            <div className="card h-100 shop-product-card">

                                {/* Image */}
                                <div className="shop-image-wrapper">

                                    {product.productImage ? (
                                        <img
                                            src={`${import.meta.env.VITE_API_URL}${product.productImage}`}
                                            alt={product.name}
                                            className="shop-product-image"
                                        />
                                    ) : (
                                        <div className="shop-no-image">
                                            No Image
                                        </div>
                                    )}

                                    {/* Wishlist */}
                                    <button
                                        type="button"
                                        className={`shop-wishlist-btn ${wishlistIds.includes(product.id) ? "active" : ""
                                            }`}
                                        title={
                                            wishlistIds.includes(product.id)
                                                ? "Remove from Wishlist"
                                                : "Add to Wishlist"
                                        }
                                        onClick={() => handleWishlist(product.id)}
                                    >
                                        {wishlistIds.includes(product.id) ? "♥" : "♡"}
                                    </button>
                                </div>

                                {/* Product Details */}
                                <div className="card-body d-flex flex-column">

                                    <h5 className="shop-product-name">
                                        {product.name}
                                    </h5>

                                    <p className="text-muted small mb-2">
                                        {product.category?.name || "Product"}
                                    </p>

                                    <h5 className="fw-bold mb-3">
                                        ₹{product.price}
                                    </h5>

                                    <div className="mt-auto">

                                        <button
                                            type="button"
                                            className="btn btn-dark w-100 mb-2"
                                            onClick={() => handleAddToCart(product.id)}
                                        >
                                            Add to Cart
                                        </button>

                                        <button
                                            type="button"
                                            className="btn btn-outline-dark w-100"
                                            onClick={() =>

                                                navigate("/check-out", {
                                                    state: {
                                                        buyNow: true,
                                                        productId: product.id,
                                                        // quantity: quantity,
                                                    },
                                                })
                                            }
                                        >
                                            Buy Now
                                        </button>

                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}

                </div>
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                    <nav>
                        <ul className="pagination ">

                            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                                <button
                                    className="page-link "
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    Previous
                                </button>
                            </li>

                            {Array.from(
                                { length: pagination.totalPages },
                                (_, index) => index + 1
                            ).map((pageNumber) => (
                                <li
                                    key={pageNumber}
                                    className={`page-item ${page === pageNumber ? "active" : ""
                                        }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setPage(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                </li>
                            ))}

                            <li
                                className={`page-item ${page === pagination.totalPages ? "disabled" : ""
                                    }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === pagination.totalPages}
                                >
                                    Next
                                </button>
                            </li>

                        </ul>
                    </nav>
                </div>
            )}

        </div>
    );
};

export default Shop;