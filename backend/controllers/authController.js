const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const createActivityLog = require("../config/createActivityLog");
const env = require("../config/env");

const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const {
    sendSuccess,
} = require("../utils/apiResponse");

const {
    sendWelcomeEmail,
    sendPasswordResetEmail,
} = require("../utils/emailService");

// ==========================================
// CREATE JWT TOKEN
// ==========================================

const createToken = (user) =>
    jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        env.jwt.secret,
        {
            expiresIn: env.jwt.expiresIn,
        }
    );

// ==========================================
// SAFE USER
// ==========================================

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

// ==========================================
// REGISTER
// ==========================================

const register = asyncHandler(
    async (req, res) => {
        const {
            name,
            email,
            password,
            mobileNumber,
            status,
        } = req.body;

        if (!name || !email || !password) {
            throw new AppError(
                "Name, email and password are required.",
                400
            );
        }

        const existingUser =
            await User.findOne({
                where: { email },
            });

        if (existingUser) {
            throw new AppError(
                "Email already exists.",
                409
            );
        }

        const hashedPassword =
            await bcrypt.hash(
                password,
                12
            );

        const user =
            await User.create({
                name,
                email,
                password: hashedPassword,
                mobileNumber,
                status: status || "active",
                role: "user",
            });

        await sendWelcomeEmail(user);

        const token =
            createToken(user);

        return sendSuccess(
            res,
            {
                statusCode: 201,
                message:
                    "Registration successful.",
                data: {
                    token,
                    user: safeUser(user),
                },
            }
        );
    }
);

// ==========================================
// LOGIN
// ==========================================

const login = asyncHandler(
    async (req, res) => {
        const {
            email,
            password,
        } = req.body;

        if (!email || !password) {
            throw new AppError(
                "Email and password are required.",
                400
            );
        }

        const user =
            await User.findOne({
                where: { email },
            });

        if (!user) {
            throw new AppError(
                "Invalid email or password.",
                401
            );
        }

        if (user.status !== "active") {
            throw new AppError(
                "Your account is inactive.",
                403
            );
        }

        const isPasswordValid =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordValid) {
            throw new AppError(
                "Invalid email or password.",
                401
            );
        }

        const token =
            createToken(user);

        await createActivityLog({
            userId: user.id,
            action: "LOGIN",
            module: "USER",
            description:
                `Login User "${user.name}".`,
            referenceId: user.id,
            req,
            token
        });

        return sendSuccess(
            res,
            {
                statusCode: 200,
                message:
                    "Login successful.",
                data: {
                    token,
                    user: safeUser(user),
                },
            }
        );
    }
);

// ==========================================
// GET LOGGED-IN USER
// ==========================================

const me = asyncHandler(
    async (req, res) => {
        const user =
            await User.findByPk(
                req.user.id
            );

        if (!user) {
            throw new AppError(
                "User not found.",
                404
            );
        }

        return sendSuccess(
            res,
            {
                statusCode: 200,
                message:
                    "User fetched successfully.",
                data: {
                    user: safeUser(user),
                },
            }
        );
    }
);

// ==========================================
// FORGOT PASSWORD
// ==========================================

const forgotPassword =
    asyncHandler(
        async (req, res) => {
            const { email } =
                req.body;

            if (!email) {
                throw new AppError(
                    "Email is required.",
                    400
                );
            }

            const user =
                await User.findOne({
                    where: { email },
                });

            if (!user) {
                return sendSuccess(
                    res,
                    {
                        statusCode: 200,
                        message:
                            "If an account exists with this email, a reset link has been sent.",
                        data: null,
                    }
                );
            }

            const resetToken =
                crypto
                    .randomBytes(32)
                    .toString("hex");

            const hashedToken =
                crypto
                    .createHash("sha256")
                    .update(resetToken)
                    .digest("hex");

            const expiry =
                new Date(
                    Date.now() +
                        15 * 60 * 1000
                );

            await user.update({
                resetPasswordToken:
                    hashedToken,
                resetPasswordExpires:
                    expiry,
            });

            await sendPasswordResetEmail(
                user,
                resetToken
            );

            return sendSuccess(
                res,
                {
                    statusCode: 200,
                    message:
                        "If an account exists with this email, a reset link has been sent.",
                    data: null,
                }
            );
        }
    );

// ==========================================
// RESET PASSWORD
// ==========================================

const resetPassword =
    asyncHandler(
        async (req, res) => {
            const { token } =
                req.params;

            const { password } =
                req.body;

            if (!password) {
                throw new AppError(
                    "Password is required.",
                    400
                );
            }

            if (
                password.length < 8 ||
                !/[A-Z]/.test(password) ||
                !/[a-z]/.test(password) ||
                !/[0-9]/.test(password)
            ) {
                throw new AppError(
                    "Password must contain at least 8 characters, uppercase, lowercase and number.",
                    422
                );
            }

            const hashedToken =
                crypto
                    .createHash("sha256")
                    .update(token)
                    .digest("hex");

            const user =
                await User.findOne({
                    where: {
                        resetPasswordToken:
                            hashedToken,
                    },
                });

            if (!user) {
                throw new AppError(
                    "Invalid or expired reset token.",
                    400
                );
            }

            if (
                !user.resetPasswordExpires ||
                new Date() >
                    new Date(
                        user.resetPasswordExpires
                    )
            ) {
                throw new AppError(
                    "Reset token has expired.",
                    400
                );
            }

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    12
                );

            await user.update({
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            });

            return sendSuccess(
                res,
                {
                    statusCode: 200,
                    message:
                        "Password reset successfully. You can now login.",
                    data: null,
                }
            );
        }
    );

// ==========================================
// CHANGE PASSWORD
// ==========================================

const changePassword =
    asyncHandler(
        async (req, res) => {
            const {
                currentPassword,
                newPassword,
                confirmPassword,
            } = req.body;

            if (
                !currentPassword ||
                !newPassword ||
                !confirmPassword
            ) {
                throw new AppError(
                    "Current password, new password and confirm password are required.",
                    400
                );
            }

            if (
                newPassword !==
                confirmPassword
            ) {
                throw new AppError(
                    "New password and confirm password do not match.",
                    400
                );
            }

            if (
                newPassword.length < 8 ||
                !/[A-Z]/.test(newPassword) ||
                !/[a-z]/.test(newPassword) ||
                !/[0-9]/.test(newPassword)
            ) {
                throw new AppError(
                    "Password must contain at least 8 characters, uppercase, lowercase and number.",
                    422
                );
            }

            const user =
                await User.findByPk(
                    req.user.id
                );

            if (!user) {
                throw new AppError(
                    "User not found.",
                    404
                );
            }

            const isPasswordValid =
                await bcrypt.compare(
                    currentPassword,
                    user.password
                );

            if (!isPasswordValid) {
                throw new AppError(
                    "Current password is incorrect.",
                    401
                );
            }

            const isSamePassword =
                await bcrypt.compare(
                    newPassword,
                    user.password
                );

            if (isSamePassword) {
                throw new AppError(
                    "New password must be different from current password.",
                    400
                );
            }

            const hashedPassword =
                await bcrypt.hash(
                    newPassword,
                    12
                );

            await user.update({
                password:
                    hashedPassword,
            });

            await createActivityLog({
                userId: user.id,
                action: "PASSWORD CHANGE",
                module: "USER",
                description:
                    `Change password of User "${user.name}".`,
                referenceId: user.id,
                req,
            });

            return sendSuccess(
                res,
                {
                    statusCode: 200,
                    message:
                        "Password changed successfully.",
                    data: null,
                }
            );
        }
    );

module.exports = {
    register,
    login,
    me,
    forgotPassword,
    resetPassword,
    changePassword,
};
