const express = require("express");
const router = express.Router();

const {
  register,
  login,
  me,
  forgotPassword,
  resetPassword, changePassword, uploadProfileImage,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const validate = require("../middleware/validationResult");
const {
  createUserValidation,
  loginValidation
} = require("../validators/userValidator");

router.post("/register", createUserValidation, validate, register);
router.post("/login", loginValidation, validate, login);
router.get("/me", authMiddleware, me);
// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password/:token", resetPassword);
router.put("/change-password", authMiddleware, changePassword);
// router.put(
//   "/profile/image",
//   authMiddleware,
//   upload.single("profileImage"),
//   uploadProfileImage
// );
module.exports = router;
