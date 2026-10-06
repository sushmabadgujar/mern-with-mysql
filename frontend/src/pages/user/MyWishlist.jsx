import React from "react";
import { useEffect, useState } from "react";
import {
    getMyWishlist,
    removeWishlist,
} from "../../api/wishlistApi";

import { showError, showSuccess } from "../../utils/toast";
const MyWishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWishlist = async () => {
        try {
            setLoading(true);

            const response = await getMyWishlist();
            console.log(response);
            setWishlist(response.data.wishlist || []);
        } catch (error) {
            console.log(error);
            showError(
                error.response?.data?.message ||
                "Failed to fetch wishlist"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        try {
            await removeWishlist(productId);

            showSuccess("Removed from wishlist");

            setWishlist((prev) =>
                prev.filter(
                    (item) => item.productId !== productId
                )
            );
        } catch (error) {
            showError(
                error.response?.data?.message ||
                "Failed to remove wishlist"
            );
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
       <div className="wishlist-page py-5">
    <div className="container">
        <h2 className="text-center mb-4">My Wishlist</h2>

        {wishlist.length === 0 ? (
            <div className="text-center py-5">
                <p className="text-muted fs-5">
                    Your wishlist is empty.
                </p>
            </div>
        ) : (
            <div className="row g-4">
                {wishlist.map((item) => (
                    <div
                        className="col-12 col-sm-6 col-md-4 col-lg-3"
                        key={item.id}
                    >
                        <div className="card h-100 shadow-sm border-0">
                            <div
                                className="overflow-hidden"
                                style={{ height: "250px" }}
                            >
                                <img
                                    src={`${import.meta.env.VITE_API_URL}${item.product.productImage}`}
                                    alt={item.product.name}
                                    className="card-img-top w-100 h-100"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>

                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">
                                    {item.product.name}
                                </h5>

                                <p className="card-text fw-semibold">
                                    ₹{item.product.price}
                                </p>

                                <button
                                    type="button"
                                    className="btn btn-dark mt-auto"
                                    onClick={() =>
                                        handleRemove(item.productId)
                                    }
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
</div>
    );
};

export default MyWishlist;