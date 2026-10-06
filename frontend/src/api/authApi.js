import api from "./axios";

export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");

export const getProfile = () => api.get("/profile");
export const updateProfile = (data) => api.put("/profile", data);

export const changePassword = (data) => {
  return api.put("/auth/change-password", data);
};
