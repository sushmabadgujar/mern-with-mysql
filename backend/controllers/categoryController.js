const { Op } = require("sequelize");
const { Category, Product } = require("../models");

const createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;


        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }

        const existingCategory = await Category.findOne({
            where: {
                name: name.trim(),
            },
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists",
            });
        }

        const category = await Category.create({
            name: name.trim(),
            description: description?.trim() || null,
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category,
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create category",
            error: error.message,
        });
    }
};

const getCategories = async (req, res) => {
    try {
        let {
            page = 1,
            limit = 3,
            search = "",
            sortBy = "id",
            sortOrder = "DESC",
        } = req.query;


        page = parseInt(page);
        limit = parseInt(limit);

        if (page < 1) page = 1;
        if (limit < 1) limit = 3;

        const offset = (page - 1) * limit;

        const allowedSortFields = [
            "id",
            "name",
            "createdAt",
            "updatedAt",
        ];

        if (!allowedSortFields.includes(sortBy)) {
            sortBy = "id";
        }

        sortOrder =
            sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

        const where = {};

        if (search.trim()) {
            where.name = {
                [Op.like]: `%${search.trim()}%`,
            };
        }

        const { count, rows } = await Category.findAndCountAll({
            where,
            include: [
                {
                    model: Product,
                    as: "products",
                    attributes: ["id"],
                    required: false,
                },
            ],
            order: [[sortBy, sortOrder]],
            limit,
            offset,
            distinct: true,
        });

        const categories = rows.map((category) => ({
            id: category.id,
            name: category.name,
            description: category.description,
            productCount: category.products.length,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        }));

        return res.status(200).json({
            success: true,
            categories,
            pagination: {
                total: count,
                page,
                limit,
                totalPages: Math.ceil(count / limit),
            },
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message,
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;


        const category = await Category.findByPk(id, {
            include: [
                {
                    model: Product,
                    as: "products",
                },
            ],
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        return res.status(200).json({
            success: true,
            category,
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch category",
            error: error.message,
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;


        const category = await Category.findByPk(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Category name is required",
            });
        }

        const existingCategory = await Category.findOne({
            where: {
                name: name.trim(),
                id: {
                    [Op.ne]: id,
                },
            },
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists",
            });
        }

        category.name = name.trim();
        category.description = description?.trim() || null;

        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category,
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update category",
            error: error.message,
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;


        const category = await Category.findByPk(id, {
            include: [
                {
                    model: Product,
                    as: "products",
                    attributes: ["id"],
                },
            ],
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        if (category.products.length > 0) {
            return res.status(400).json({
                success: false,
                message:
                    "Cannot delete category because products are assigned to it",
            });
        }

        await category.destroy();

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete category",
            error: error.message,
        });
    }
};

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
