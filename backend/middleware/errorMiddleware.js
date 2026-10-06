const {
    ValidationError,
    UniqueConstraintError,
    ForeignKeyConstraintError,
    DatabaseError,
} = require("sequelize");

const logger = require("../utils/logger");

const errorHandler = (
    err,
    req,
    res,
    next
) => {
    let statusCode =
        err.statusCode || 500;

    let message =
        err.message ||
        "Internal server error";

    // Sequelize validation error
    if (err instanceof ValidationError) {
        statusCode = 400;

        message =
            err.errors
                ?.map(
                    (error) =>
                        error.message
                )
                .join(", ") ||
            "Validation failed";
    }

    // Sequelize duplicate entry
    if (
        err instanceof
        UniqueConstraintError
    ) {
        statusCode = 409;

        message =
            "A record with the same value already exists";
    }

    // Sequelize foreign key error
    if (
        err instanceof
        ForeignKeyConstraintError
    ) {
        statusCode = 400;

        message =
            "Invalid related record";
    }

    // Sequelize database error
    if (
        err instanceof DatabaseError
    ) {
        statusCode = 500;

        message =
            "Database operation failed";
    }

    logger.error({
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl,
        statusCode,
        userId:
            req.user?.id || null,
    });

    const response = {
        success: false,
        message,
    };

    if (
        process.env.NODE_ENV ===
        "development"
    ) {
        response.stack = err.stack;
    }

    return res
        .status(statusCode)
        .json(response);
};

module.exports = errorHandler;