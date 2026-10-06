import api from "./axios";


// USER CART

export const addToCart = (data) => {
  return api.post("/cart", data);
};

export const getMyCart = () => {
  return api.get("/cart/my-cart");
};

export const updateCartItem = (id, data) => {
  return api.put(`/cart/item/${id}`, data);
};

export const removeCartItem = (id) => {
  return api.delete(`/cart/item/${id}`);
};


// ADMIN CART

export const getAllCarts = (params) => {
  return api.get("/cart", {
    params,
  });
};

export const getCartById = (id) => {
  return api.get(`/cart/${id}`);
};

export const updateCart = (id, data) => {
  return api.put(`/cart/${id}`, data);
};
export const deleteCart = (id) => {
    return api.delete(`/cart/${id}`);
};