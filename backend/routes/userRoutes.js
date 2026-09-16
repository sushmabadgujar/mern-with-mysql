const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validationResult");
const upload = require("../middleware/upload");

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require("../controllers/userController");

const {
    createUserValidation,
    updateUserValidation,
    idValidation
} = require("../validators/userValidator");

router.use(authMiddleware);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *         description: Number of users per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by name or email
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: id
 *         description: Field used for sorting
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Sorting order
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       401:
 *         description: Authentication token is required
 */
router.get("/", getUsers);


/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Authentication token is required
 *       404:
 *         description: User not found
 */
router.get(
    "/:id",
    idValidation,
    validate,
    getUserById
);


/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - mobileNumber
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *               mobileNumber:
 *                 type: string
 *                 example: "9876543210"
 *               role:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - user
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication token is required
 *       409:
 *         description: Email already exists
 */
router.post(
    "/",
    createUserValidation,
    validate,
    createUser
);


/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Updated
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johnupdated@gmail.com
 *               mobileNumber:
 *                 type: string
 *                 example: "9876543210"
 *               role:
 *                 type: string
 *                 enum:
 *                   - admin
 *                   - user
 *                 example: user
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication token is required
 *       404:
 *         description: User not found
 */
router.put(
    "/:id",
    upload.single("profileImage"),
    idValidation,
    updateUserValidation,
    validate,
    updateUser
);


/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Invalid user ID
 *       401:
 *         description: Authentication token is required
 *       404:
 *         description: User not found
 */
router.delete(
    "/:id",
    idValidation,
    validate,
    deleteUser
);

module.exports = router;