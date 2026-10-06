import api from "./axios";

export const placeOrder = (data) => {
    return api.post("/orders", data);
}

export const getMyOrders = () => {
    return api.get("/orders/my-orders");
};

export const getOrderById = (id) => {
    return api.get(`/orders/${id}`);
};

export const cancelOrder = (id) => {
    return api.put(`/orders/${id}/cancel`);
};
export const getAllOrders = (params) => {
    return api.get("/orders/all-orders", {
        params,
    });
};

// export const getOrderById = (id) => {
//     return api.get(`/orders/${id}`);
// };

export const updateOrderStatus = (id, data) => {
    return api.put(`/orders/${id}/status`, data);
};