const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// const crypto = require("crypto");
const transporter = require("../config/mailer");
const fs = require("fs");
const createToken = (user) =>
  jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  mobileNumber: user.mobileNumber,
  status: user.status,
  role: user.role,
  createdAt: user.createdAt,
   profileImage: user.profileImage,
});

const register = async (req, res, next) => {
  try {
    const { name, email, password, mobileNumber, status } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      status: status || "active"
    });

    const token = createToken(user);

    return res.status(201).json({
      message: "Registration successful.",
      token,
      user: safeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (user.status !== "active") {
      return res.status(403).json({ message: "Your account is inactive." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken(user);

    return res.json({
      message: "Login successful.",
      token,
      user: safeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ user: safeUser(user) });
  } catch (error) {
    next(error);
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    // Security: user exist karta hai ya nahi,
    // exact information expose mat karo.
    if (!user) {
      return res.status(200).json({
        message:
          "If an account exists with this email, a reset link has been sent.",
      });
    }

    // Secure random token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // DB mein plain token nahi,
    // token ka hash store karo
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token 15 minutes valid
    const expiry = new Date(Date.now() + 15 * 60 * 1000);

    await user.update({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: expiry,
    });

    const resetUrl =
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: `"My App" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Password Reset Request</h2>

          <p>Hello ${user.name},</p>

          <p>
            We received a request to reset your password.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#0d6efd;
              color:white;
              text-decoration:none;
              border-radius:5px;
            "
          >
            Reset Password
          </a>

          <p style="margin-top:20px;">
            This link will expire in 15 minutes.
          </p>

          <p>
            If you did not request a password reset,
            you can safely ignore this email.
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      message:
        "If an account exists with this email, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Unable to process password reset request.",
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required.",
      });
    }

    // Password validation
    if (
      password.length < 8 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return res.status(422).json({
        message:
          "Password must contain at least 8 characters, uppercase, lowercase and number.",
      });
    }

    // Incoming token ko hash karo
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
      },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token.",
      });
    }

    // Expiry check
    if (
      !user.resetPasswordExpires ||
      new Date() > new Date(user.resetPasswordExpires)
    ) {
      return res.status(400).json({
        message: "Reset token has expired.",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    await user.update({
      password: hashedPassword,

      // Token ko invalidate kar do
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return res.status(200).json({
      message: "Password reset successfully. You can now login.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Unable to reset password.",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    // 1. Required fields validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message:
          "Current password, new password and confirm password are required.",
      });
    }

    // 2. New password confirmation
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match.",
      });
    }

    // 3. Password strength validation
    if (
      newPassword.length < 8 ||
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword)
    ) {
      return res.status(422).json({
        message:
          "Password must contain at least 8 characters, uppercase, lowercase and number.",
      });
    }

    // 4. Get logged-in user's ID from JWT middleware
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // 5. Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Current password is incorrect.",
      });
    }

    // 6. Prevent same password
    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        message:
          "New password must be different from current password.",
      });
    }

    // 7. Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // 8. Update password
    await user.update({
      password: hashedPassword,
    });

    return res.status(200).json({
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      message: "Unable to change password.",
    });
  }
};


module.exports = { register, login, me,
  forgotPassword,
  resetPassword, changePassword };
