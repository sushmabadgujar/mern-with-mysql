import api from "./axios";

export const addWishlist = (productId) => {
    return api.post("/wishlist", {
        productId,
    });
};

export const removeWishlist = (productId) => {
    return api.delete(`/wishlist/${productId}`);
};

export const getMyWishlist = () => {
    return api.get("/wishlist");
};

export const getAllWishlists = (params) => {
    return api.get("/wishlist/admin/all", {
        params,
    });
};

export const deleteWishlist = (id) => {
    return api.delete(`/wishlist/admin/${id}`);
};