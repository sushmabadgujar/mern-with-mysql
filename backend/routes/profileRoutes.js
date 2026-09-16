const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validationResult");
const upload = require("../middleware/upload");

const {
    getProfile,
    updateProfile
} = require("../controllers/userController");

const {
    profileUpdateValidation
} = require("../validators/userValidator");

router.use(authMiddleware);


/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Authentication token is required
 *       404:
 *         description: User profile not found
 */
router.get("/", getProfile);


/**
 * @swagger
 * /api/profile:
 *   put:
 *     summary: Update logged-in user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@gmail.com
 *               mobileNumber:
 *                 type: string
 *                 example: "9876543210"
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication token is required
 *       404:
 *         description: User profile not found
 */
router.put(
    "/",
    upload.single("profileImage"),
    profileUpdateValidation,
    validate,
    updateProfile
);

module.exports = router;