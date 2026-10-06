const express = require("express");

const router = express.Router();

const {
    getUserReport,
    getProductReport,
    getOrderReport,
    getSalesReport,

    exportUsersExcel,
    exportProductsExcel,
    exportOrdersExcel,
    exportSalesExcel,

    exportUsersPDF,
    exportProductsPDF,
    exportOrdersPDF,
    exportSalesPDF,
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// ==========================================
// VIEW REPORTS
// ==========================================

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getUserReport
);

router.get(
    "/products",
    authMiddleware,
    adminMiddleware,
    getProductReport
);

router.get(
    "/orders",
    authMiddleware,
    adminMiddleware,
    getOrderReport
);

router.get(
    "/sales",
    authMiddleware,
    adminMiddleware,
    getSalesReport
);

// ==========================================
// EXCEL EXPORT
// ==========================================

router.get(
    "/users/export/excel",
    authMiddleware,
    adminMiddleware,
    exportUsersExcel
);

router.get(
    "/products/export/excel",
    authMiddleware,
    adminMiddleware,
    exportProductsExcel
);

router.get(
    "/orders/export/excel",
    authMiddleware,
    adminMiddleware,
    exportOrdersExcel
);

router.get(
    "/sales/export/excel",
    authMiddleware,
    adminMiddleware,
    exportSalesExcel
);

// ==========================================
// PDF EXPORT
// ==========================================

router.get(
    "/users/export/pdf",
    authMiddleware,
    adminMiddleware,
    exportUsersPDF
);

router.get(
    "/products/export/pdf",
    authMiddleware,
    adminMiddleware,
    exportProductsPDF
);

router.get(
    "/orders/export/pdf",
    authMiddleware,
    adminMiddleware,
    exportOrdersPDF
);

router.get(
    "/sales/export/pdf",
    authMiddleware,
    adminMiddleware,
    exportSalesPDF
);

module.exports = router;