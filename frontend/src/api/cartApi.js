import api from "./axios";

export const createCart = (data) => {
  return api.post("/cart", data);
};

// export const getCarts = (params) => {
//   return api.get("/cart", {
//     params,
//   });
// };

export const getAllCarts = (params) => {
  return api.get("/cart", {
    params,
  });
};

export const getCartById = (id) => {
  return api.get(`/cart/${id}`);
};

export const updateCart = (id, data) => {
  return api.put(`/carts/${id}`, data);
};

export const deleteCart = (id) => {
  return api.delete(`/carts/${id}`);
};