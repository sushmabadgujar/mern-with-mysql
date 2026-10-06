const { Op } = require("sequelize");
const Product = require("../models/Product");
const Category = require("../models/Category");
const fs = require("fs");
const path = require("path");
const createActivityLog = require("../config/createActivityLog");
const getProducts = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 5,
      search = "",
      sortBy = "id",
      sortOrder = "DESC",
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    const allowedSortFields = [
      "id",
      "name",
      "price",
      "stock",
      "createdAt",
    ];

    if (!allowedSortFields.includes(sortBy)) {
      sortBy = "id";
    }

    sortOrder = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";

    const whereCondition = {
      [Op.or]: [
        {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          description: {
            [Op.like]: `%${search}%`,
          },
        },
      ],
    };

    const { count, rows } = await Product.findAndCountAll({
      where: whereCondition,

      include: [
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],

      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: rows,
      pagination: {
        total: count,
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        limit,
      },
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      categoryId,
    } = req.body;

    const category = await Category.findByPk(
      categoryId
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      categoryId,
      productImage: req.file
        ? `/uploads/products/${req.file.filename}`
        : null,
    });
    await createActivityLog({
      userId: req.user.id,
      action: "CREATE",
      module: "PRODUCT",
      description: `Created product "${product.name}".`,
      referenceId: product.id,
      req,
    });
    return res.status(201).json({
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const {
      name,
      description,
      price,
      stock,
      categoryId,
    } = req.body;

    if (categoryId) {
      const category = await Category.findByPk(
        categoryId
      );

      if (!category) {
        return res.status(404).json({
          message: "Category not found.",
        });
      }
    }

    if (req.file) {
      if (product.productImage) {
        const oldFileName = path.basename(
          product.productImage
        );

        const oldFilePath = path.join(
          process.cwd(),
          "uploads",
          "products",
          oldFileName
        );

        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      product.productImage = `/uploads/products/${req.file.filename}`;
    }

    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.categoryId = categoryId;

    await product.save();
     await createActivityLog({
      userId: req.user.id,
      action: "UPDATE",
      module: "PRODUCT",
      description: `Updated product "${product.name}".`,
      referenceId: product.id,
      req,
    });
    return res.json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    if (product.productImage) {
      const fileName = path.basename(
        product.productImage
      );

      const filePath = path.join(
        process.cwd(),
        "uploads",
        "products",
        fileName
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await product.destroy();

    return res.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully.",
      data: product,
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);

    return res.status(500).json({
      message: "Unable to fetch product.",
      error: error.message,
    });
  }
};
module.exports = {
  getProducts, deleteProduct, createProduct, updateProduct, getProductById
};