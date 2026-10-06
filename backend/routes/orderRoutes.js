const express = require("express");
const router = express.Router();

const {
    placeOrder,
    // getOrderDetails,
    getMyOrders, getOrderById,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    // cancelOrder,
    // updateOrderStatus,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware =  require("../middleware/adminMiddleware");
router.post("/", authMiddleware, placeOrder);

router.get("/my-orders", authMiddleware, getMyOrders);
router.get(
    "/all-orders",
    authMiddleware,
    adminMiddleware,
    getAllOrders
);
router.get(
    "/:id",
    authMiddleware,
    getOrderById
);
router.put(
    "/:id/cancel",
    authMiddleware,
    cancelOrder
);


// Admin - Update Order Status
router.put(
    "/:id/status",
    authMiddleware,
    adminMiddleware,
    updateOrderStatus
);
// router.get("/:id", authMiddleware, getOrderDetails);

// router.put("/:id/cancel", authMiddleware, cancelOrder);

// router.put(
//     "/:id/status",
//     authMiddleware,
//     updateOrderStatus
// );

module.exports = router;