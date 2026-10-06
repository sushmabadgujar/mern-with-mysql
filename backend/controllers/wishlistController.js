const {Wishlist,Product,User} = require("../models");
const addWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required",
            });
        }

        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        const existingWishlist = await Wishlist.findOne({
            where: {
                userId,
                productId,
            },
        });

        if (existingWishlist) {
            return res.status(409).json({
                message: "Product already exists in wishlist",
            });
        }

        const wishlist = await Wishlist.create({
            userId,
            productId,
        });

        return res.status(201).json({
            message: "Product added to wishlist",
            wishlist,
        });
    } catch (error) {
        console.error("Add Wishlist Error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
const removeWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId } = req.params;

        const wishlist = await Wishlist.findOne({
            where: {
                userId,
                productId,
            },
        });

        if (!wishlist) {
            return res.status(404).json({
                message: "Wishlist item not found",
            });
        }

        await wishlist.destroy();

        return res.status(200).json({
            message: "Product removed from wishlist",
        });
    } catch (error) {
        console.error("Remove Wishlist Error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
const getMyWishlist = async (req, res) => {
    try {
        const userId = req.user.id;

        const wishlist = await Wishlist.findAll({
            where: {
                userId,
            },
            include: [
                {
                    model: Product,
                    as: "product",
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return res.status(200).json({
            wishlist,
        });
    } catch (error) {
        console.error("Get Wishlist Error:", error);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
const getAllWishlists = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 5,
            search = "",
            sortBy = "id",
            sortOrder = "DESC",
        } = req.query;

        const offset = (page - 1) * limit;

        const { count, rows } = await Wishlist.findAndCountAll({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email"],
                },
                {
                    model: Product,
                    as: "product",
                    attributes: ["id", "name", "price", "productImage"],
                },
            ],
            order: [[sortBy, sortOrder]],
            limit: Number(limit),
            offset: Number(offset),
            distinct: true,
        });

        res.status(200).json({
            message: "Wishlists fetched successfully.",
            data: rows,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(count / limit),
                totalItems: count,
                limit: Number(limit),
            },
        });
    } catch (error) {
        console.error("Get all wishlists error:", error);

        res.status(500).json({
            message: "Unable to fetch wishlists.",
            error: error.message,
        });
    }
};

const deleteWishlist = async (req, res) => {
    try {
        console.log("req is",req);
        const { id } = req.params;
        console.log("parameter id is",id);
        const wishlist = await Wishlist.findByPk(id);

        if (!wishlist) {
            return res.status(404).json({
                message: "Wishlist item not found.",
            });
        }

        await wishlist.destroy();

        res.status(200).json({
            message: "Wishlist item deleted successfully.",
        });
    } catch (error) {
        console.error("Delete wishlist error:", error);

        res.status(500).json({
            message: "Unable to delete wishlist item.",
            error: error.message,
        });
    }
};

module.exports = {
 addWishlist,removeWishlist,getMyWishlist, getAllWishlists,
    deleteWishlist,
};
