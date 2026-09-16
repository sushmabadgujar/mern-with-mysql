const express = require("express");

const router = express.Router();

const {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.post("/", addToCart);

router.get("/", getCart);

router.put("/:itemId", updateCartItem);

// router.delete("/:itemId", removeFromCart);

router.delete("/", clearCart);

module.exports = router;