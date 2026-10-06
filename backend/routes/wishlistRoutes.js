const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
    addWishlist,
    removeWishlist,
    getMyWishlist,getAllWishlists,deleteWishlist
} = require("../controllers/wishlistController");

router.post("/", authMiddleware, addWishlist);

router.delete("/:productId", authMiddleware, removeWishlist);

router.get("/", authMiddleware, getMyWishlist);

router.get(
    "/admin/all",
    authMiddleware,
    adminMiddleware,
    getAllWishlists
);

router.delete(
    "/admin/:id",
    authMiddleware,
    adminMiddleware,
    deleteWishlist
);
module.exports = router;