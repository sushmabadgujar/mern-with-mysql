require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const sequelize = require("./config/database");
const env = require("./config/env");
const logger = require("./utils/logger");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const activityLogRoutes = require("./routes/activityLogRoutes");
const reportRoutes = require("./routes/reportRoutes");

const notFoundMiddleware = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorHandler");

const app = express();


// ==========================================
// CORS
// ==========================================

app.use(
    cors({
        origin: env.clientUrl,
        credentials: true,
    })
);


// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json());


// ==========================================
// SWAGGER
// ==========================================

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);


// ==========================================
// STATIC FILES
// ==========================================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/api/health", async (req, res, next) => {
    try {
        await sequelize.authenticate();

        res.status(200).json({
            success: true,
            message: "API and MySQL connection are working.",
        });
    } catch (error) {
        next(error);
    }
});


// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/profile", profileRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/activity-logs", activityLogRoutes);

app.use("/api/reports", reportRoutes);


// ==========================================
// 404 HANDLER
// ==========================================

app.use(notFoundMiddleware);


// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(errorHandler);


// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
    try {

        await sequelize.authenticate();

        logger.info(
            "Database connected successfully"
        );

        await sequelize.sync();

        app.listen(
            env.port,
            () => {
                logger.info(
                    `Server running on port ${env.port}`
                );
            }
        );

    } catch (error) {

        logger.error({
            message: "Server startup failed",
            error: error.message,
            stack: error.stack,
        });

        process.exit(1);
    }
};


startServer();
// // require("dotenv").config();
// const env = require("./config/env");
// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const swaggerUi = require("swagger-ui-express");
// const swaggerSpec = require("./config/swagger");

// const sequelize = require("./config/database");
// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const profileRoutes = require("./routes/profileRoutes");
// const errorHandler = require("./middleware/errorHandler");
// const dashboardRoutes = require("./routes/dashboardRoutes");
// const categoryRoutes = require("./routes/categoryRoutes");
// const productRoutes = require("./routes/productRoutes");
// const cartRoutes = require("./routes/cartRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const wishlistRoutes = require("./routes/wishlistRoutes");
// const notificationRoutes = require("./routes/notificationRoutes");
// const activityLogRoutes = require("./routes/activityLogRoutes");
// const reportRoutes = require("./routes/reportRoutes");
// const notFoundMiddleware = require("./middleware/notFoundMiddleware");
// const logger = require("./utils/logger");
// const errormiddleware = require("./middleware/errorMiddleware");
// const app = express();

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:5173"
//   })
// );

// app.use(express.json());
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.get("/api/health", async (req, res) => {
//   try {
//     await sequelize.authenticate();

//     res.json({
//       success: true,
//       message: "API and MySQL connection are working."
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Database connection failed."
//     });
//   }
// });

// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/dashboard", dashboardRoutes);


// app.use("/api/categories", categoryRoutes);
// app.use("/api/products", productRoutes);

// app.use("/api/cart", cartRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/wishlist", wishlistRoutes);
// app.use("/api/notifications", notificationRoutes);
// app.use("/api/activity-logs", activityLogRoutes);
// app.use("/api/reports", reportRoutes);

// // ==========================================
// // 404
// // ==========================================

// app.use(
//   notFoundMiddleware
// );
// app.use(errorHandler);
// // ==========================================
// // GLOBAL ERROR HANDLER
// // ==========================================

// app.use(
//   errormiddleware
// );

// const PORT = process.env.PORT || 5000;

// // const startServer = async () => {
// //   try {
// //     await sequelize.authenticate();
// //     console.log("MySQL connected successfully.");

// //     app.listen(PORT, () => {
// //       console.log(`Server running on http://localhost:${PORT}`);
// //     });
// //   } catch (error) {
// //     console.error("Unable to connect to MySQL:", error.message);
// //     process.exit(1);
// //   }
// // };
// const startServer = async () => {
//     try {
//         await sequelize.authenticate();

//         logger.info(
//             "Database connected successfully"
//         );

//         await sequelize.sync();

//         app.listen(
//             env.port,
//             () => {
//                 logger.info(
//                     `Server running on port ${env.port}`
//                 );
//             }
//         );
//     } catch (error) {
//         logger.error({
//             message:
//                 "Server startup failed",
//             error: error.message,
//             stack: error.stack,
//         });

//         process.exit(1);
//     }
// };

// startServer();
