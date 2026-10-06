const express = require("express");

const router = express.Router();

const {
    addToCart,
    getMyCart,
    updateCartItem,
    // deleteCart,
    deleteCart,
    getAllCarts,removeCartItem
    // getCartById,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
router.use(authMiddleware);

router.post("/", addToCart);

// router.get("/", getCart);
router.get("/", getAllCarts);

router.put("/item/:itemId", updateCartItem);
router.delete(
    "/item/:id",
    authMiddleware,
    removeCartItem
);

router.delete("/:cartId",  authMiddleware,adminMiddleware,deleteCart);

// router.delete("/", clearCart);
router.get("/my-cart", authMiddleware, getMyCart);
module.exports = router;