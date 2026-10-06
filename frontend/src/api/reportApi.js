import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// ==================== REPORT DATA ====================

export const getUserReport = async (params = {}) => {
  const response = await axios.get(`${API_URL}/api/reports/users`, {
    ...getAuthConfig(),
    params,
  });

  return response.data;
};

export const getProductReport = async (params = {}) => {
  const response = await axios.get(`${API_URL}/api/reports/products`, {
    ...getAuthConfig(),
    params,
  });

  return response.data;
};

export const getOrderReport = async (params = {}) => {
  const response = await axios.get(`${API_URL}/api/reports/orders`, {
    ...getAuthConfig(),
    params,
  });

  return response.data;
};

export const getSalesReport = async (params = {}) => {
  const response = await axios.get(`${API_URL}/api/reports/sales`, {
    ...getAuthConfig(),
    params,
  });

  return response.data;
};

// ==================== EXCEL EXPORT ====================

export const exportUsersExcel = async (params = {}) => {
  const response = await axios.get(`${API_URL}/api/reports/users/export/excel`, {
    ...getAuthConfig(),
    params,
    responseType: "blob",
  });

  return response;
};

export const exportProductsExcel = async (params = {}) => {
  const response = await axios.get(
    `${API_URL}/api/reports/products/export/excel`,
    {
      ...getAuthConfig(),
      params,
      responseType: "blob",
    }
  );

  return response;
};

export const exportOrdersExcel = async (params = {}) => {
  const response = await axios.get(`${API_URL}/api/reports/orders/export/excel`, {
    ...getAuthConfig(),
    params,
    responseType: "blob",
  });

  return response;
};

export const exportSalesExcel = async (params = {}) => {
  const response = await axios.get(`${API_URL}/api/reports/sales/export/excel`, {
    ...getAuthConfig(),
    params,
    responseType: "blob",
  });

  return response;
};

// ==================== PDF EXPORT ====================

export const exportUsersPDF = async (params = {}) => {
  const response = await axios.get(`${API_URL}/api/reports/users/export/pdf`, {
    ...getAuthConfig(),
    params,
    responseType: "blob",
  });

  return response;
};

export const exportProductsPDF = async (params = {}) => {
  const response = await axios.get(`${API_URL}/api/reports/products/export/pdf`, {
    ...getAuthConfig(),
    params,
    responseType: "blob",
  });

  return response;
};

export const exportOrdersPDF = async (params = {}) => {
  const response = await axios.get(`${API_URL}/api/reports/orders/export/pdf`, {
    ...getAuthConfig(),
    params,
    responseType: "blob",
  });

  return response;
};

export const exportSalesPDF = async (params = {}) => {
  const response = await axios.get(`${API_URL}/api/reports/sales/export/pdf`, {
    ...getAuthConfig(),
    params,
    responseType: "blob",
  });

  return response;
};