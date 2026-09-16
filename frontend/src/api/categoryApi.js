import api from "./axios";

export const createCategory = (data) => {
return api.post("/categories", data);
};

export const getCategories = (params) => {
return api.get("/categories", {
params,
});
};

export const getCategoryById = (id) => {
return api.get(`/categories/${id}`);
};

export const updateCategory = (id, data) => {
return api.put(`/categories/${id}`, data);
};

export const deleteCategory = (id) => {
return api.delete(`/categories/${id}`);
};
