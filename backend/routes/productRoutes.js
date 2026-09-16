const express = require("express");

const router = express.Router();

const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const upload = require("../middleware/productUpload");
const productValidation = require("../middleware/productValidation");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *           minimum: 1
 *         description: Number of products per page
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name
 *
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter products by category ID
 *
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *
 *       401:
 *         description: Authentication token is required
 */
router.get("/", getProducts);


/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *               - categoryId
 *
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name
 *                 example: Premium T-Shirt
 *
 *               description:
 *                 type: string
 *                 description: Product description
 *                 example: High quality cotton t-shirt
 *
 *               price:
 *                 type: number
 *                 format: decimal
 *                 description: Product price
 *                 example: 999.99
 *
 *               stock:
 *                 type: integer
 *                 description: Available product stock
 *                 example: 50
 *
 *               categoryId:
 *                 type: integer
 *                 description: Category ID
 *                 example: 1
 *
 *               productImage:
 *                 type: string
 *                 format: binary
 *                 description: Product image
 *
 *     responses:
 *       201:
 *         description: Product created successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Authentication token is required
 *
 *       404:
 *         description: Category not found
 */
router.post(
    "/",
    upload.single("productImage"),
    productValidation,
    createProduct
);


/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *         example: 1
 *
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *
 *               name:
 *                 type: string
 *                 description: Product name
 *                 example: Updated T-Shirt
 *
 *               description:
 *                 type: string
 *                 description: Product description
 *                 example: Updated product description
 *
 *               price:
 *                 type: number
 *                 format: decimal
 *                 description: Product price
 *                 example: 1099.99
 *
 *               stock:
 *                 type: integer
 *                 description: Available product stock
 *                 example: 40
 *
 *               categoryId:
 *                 type: integer
 *                 description: Category ID
 *                 example: 2
 *
 *               productImage:
 *                 type: string
 *                 format: binary
 *                 description: Product image
 *
 *     responses:
 *       200:
 *         description: Product updated successfully
 *
 *       400:
 *         description: Validation error
 *
 *       401:
 *         description: Authentication token is required
 *
 *       404:
 *         description: Product not found
 */
router.put(
    "/:id",
    upload.single("productImage"),
    productValidation,
    updateProduct
);


/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *         example: 1
 *
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *
 *       401:
 *         description: Authentication token is required
 *
 *       404:
 *         description: Product not found
 */
router.delete(
    "/:id",
    deleteProduct
);


module.exports = router;