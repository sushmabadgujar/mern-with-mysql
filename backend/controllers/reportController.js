const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");
const Report = require("../models/Report");

const reportsDirectory = path.join(
    __dirname,
    "../uploads/reports"
);

if (!fs.existsSync(reportsDirectory)) {
    fs.mkdirSync(reportsDirectory, {
        recursive: true,
    });
}

// ==========================================
// DATE FILTER HELPER
// ==========================================

const getDateFilter = (startDate, endDate) => {
    if (!startDate || !endDate) {
        return null;
    }

    return {
        [Op.between]: [
            new Date(`${startDate} 00:00:00`),
            new Date(`${endDate} 23:59:59`),
        ],
    };
};

// ==========================================
// USER REPORT
// ==========================================

const getUserReport = async (req, res) => {
    try {
        const {
            search,
            status,
            role,
            startDate,
            endDate,
        } = req.query;

        const where = {};

        if (search) {
            where[Op.or] = [
                {
                    name: {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    email: {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    mobileNumber: {
                        [Op.like]: `%${search}%`,
                    },
                },
            ];
        }

        if (status) {
            where.status = status;
        }

        if (role) {
            where.role = role;
        }

        const dateFilter = getDateFilter(
            startDate,
            endDate
        );

        if (dateFilter) {
            where.createdAt = dateFilter;
        }

        const users = await User.findAll({
            where,
            attributes: [
                "id",
                "name",
                "email",
                "mobileNumber",
                "status",
                "role",
                "createdAt",
            ],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        console.error(
            "Get User Report Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to generate user report",
        });
    }
};

// ==========================================
// PRODUCT REPORT
// ==========================================

const getProductReport = async (req, res) => {
    try {
        const {
            search,
            categoryId,
            minStock,
            maxStock,
        } = req.query;

        const where = {};

        if (search) {
            where.name = {
                [Op.like]: `%${search}%`,
            };
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (
            minStock !== undefined ||
            maxStock !== undefined
        ) {
            where.stock = {};

            if (minStock !== undefined) {
                where.stock[Op.gte] = Number(minStock);
            }

            if (maxStock !== undefined) {
                where.stock[Op.lte] = Number(maxStock);
            }
        }

        const products = await Product.findAll({
            where,
            attributes: [
                "id",
                "name",
                "price",
                "stock",
                "categoryId",
                "createdAt",
            ],
            include: [
                {
                    model: Category,
                    as: "category",
                    attributes: [
                        "id",
                        "name",
                    ],
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            success: true,
            count: products.length,
            products,
        });
    } catch (error) {
        console.error(
            "Get Product Report Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to generate product report",
        });
    }
};

// ==========================================
// ORDER REPORT
// ==========================================

const getOrderReport = async (req, res) => {
    try {
        const {
            status,
            userId,
            startDate,
            endDate,
        } = req.query;

        const where = {};

        if (status) {
            where.status = status;
        }

        if (userId) {
            where.userId = userId;
        }

        const dateFilter = getDateFilter(
            startDate,
            endDate
        );

        if (dateFilter) {
            where.createdAt = dateFilter;
        }

        const orders = await Order.findAll({
            where,

            attributes: [
                "id",
                "userId",
                "totalAmount",
                "status",
                "createdAt",
            ],

            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "name",
                        "email",
                    ],
                },

                {
                    model: OrderItem,
                    as: "items",
                    attributes: [
                        "id",
                        "productId",
                        "quantity",
                        "price",
                        "subtotal",
                    ],

                    include: [
                        {
                            model: Product,
                            as: "product",
                            attributes: [
                                "id",
                                "name",
                            ],
                        },
                    ],
                },
            ],

            order: [["createdAt", "DESC"]],
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });
    } catch (error) {
        console.error(
            "Get Order Report Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to generate order report",
        });
    }
};

// ==========================================
// SALES REPORT
// ==========================================

const getSalesReport = async (req, res) => {
    try {
        const {
            startDate,
            endDate,
        } = req.query;

        const where = {};

        const dateFilter = getDateFilter(
            startDate,
            endDate
        );

        if (dateFilter) {
            where.createdAt = dateFilter;
        }

        const orders = await Order.findAll({
            where,

            attributes: [
                "id",
                "userId",
                "totalAmount",
                "status",
                "createdAt",
            ],

            include: [
                {
                    model: User,
                    as: "user",
                    attributes: [
                        "id",
                        "name",
                        "email",
                    ],
                },
            ],

            order: [["createdAt", "DESC"]],
        });

        const totalOrders = orders.length;

        const completedOrders =
            orders.filter(
                (order) =>
                    order.status === "Delivered"
            );

        const cancelledOrders =
            orders.filter(
                (order) =>
                    order.status === "Cancelled"
            );

        const totalSales =
            completedOrders.reduce(
                (total, order) =>
                    total +
                    Number(order.totalAmount),
                0
            );

        const cancelledAmount =
            cancelledOrders.reduce(
                (total, order) =>
                    total +
                    Number(order.totalAmount),
                0
            );

        const averageOrderValue =
            completedOrders.length > 0
                ? totalSales /
                  completedOrders.length
                : 0;

        res.status(200).json({
            success: true,

            summary: {
                totalOrders,

                completedOrders:
                    completedOrders.length,

                cancelledOrders:
                    cancelledOrders.length,

                totalSales:
                    Number(
                        totalSales.toFixed(2)
                    ),

                cancelledAmount:
                    Number(
                        cancelledAmount.toFixed(2)
                    ),

                averageOrderValue:
                    Number(
                        averageOrderValue.toFixed(2)
                    ),
            },

            orders,
        });
    } catch (error) {
        console.error(
            "Get Sales Report Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Failed to generate sales report",
        });
    }
};

// ==========================================
// SAVE REPORT HISTORY
// ==========================================

const saveReportHistory = async ({
    reportType,
    format,
    filters,
    fileName,
    filePath,
    generatedBy,
}) => {
    try {
        await Report.create({
            reportType,
            generatedBy,
            format,
            filters,
            fileName,
            filePath,
        });
    } catch (error) {
        console.error(
            "Save Report History Error:",
            error
        );
    }
};

// ==========================================
// EXCEL HELPER
// ==========================================

const createExcelFile = async ({
    reportType,
    rows,
    columns,
    generatedBy,
    filters,
}) => {
    const workbook = new ExcelJS.Workbook();

    const worksheet =
        workbook.addWorksheet(
            `${reportType} Report`
        );

    worksheet.columns = columns;

    rows.forEach((row) => {
        worksheet.addRow(row);
    });

    worksheet.getRow(1).font = {
        bold: true,
    };

    worksheet.columns.forEach(
        (column) => {
            let maxLength = 10;

            column.eachCell(
                {
                    includeEmpty: true,
                },
                (cell) => {
                    const length =
                        cell.value
                            ? String(
                                  cell.value
                              ).length
                            : 0;

                    if (
                        length >
                        maxLength
                    ) {
                        maxLength =
                            length;
                    }
                }
            );

            column.width =
                Math.min(
                    maxLength + 2,
                    40
                );
        }
    );

    const timestamp =
        Date.now();

    const fileName =
        `${reportType.toLowerCase()}-report-${timestamp}.xlsx`;

    const filePath =
        path.join(
            reportsDirectory,
            fileName
        );

    await workbook.xlsx.writeFile(
        filePath
    );

    await saveReportHistory({
        reportType,
        format: "EXCEL",
        filters,
        fileName,
        filePath,
        generatedBy,
    });

    return {
        fileName,
        filePath,
    };
};

// ==========================================
// USER EXCEL
// ==========================================

const exportUsersExcel = async (
    req,
    res
) => {
    try {
        const {
            search,
            status,
            role,
            startDate,
            endDate,
        } = req.query;

        const where = {};

        if (search) {
            where[Op.or] = [
                {
                    name: {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    email: {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    mobileNumber: {
                        [Op.like]: `%${search}%`,
                    },
                },
            ];
        }

        if (status) {
            where.status = status;
        }

        if (role) {
            where.role = role;
        }

        const dateFilter =
            getDateFilter(
                startDate,
                endDate
            );

        if (dateFilter) {
            where.createdAt =
                dateFilter;
        }

        const users =
            await User.findAll({
                where,
                attributes: [
                    "id",
                    "name",
                    "email",
                    "mobileNumber",
                    "status",
                    "role",
                    "createdAt",
                ],
                order: [
                    [
                        "createdAt",
                        "DESC",
                    ],
                ],
            });

        const rows =
            users.map(
                (user) => ({
                    ID: user.id,
                    Name: user.name,
                    Email: user.email,
                    Mobile:
                        user.mobileNumber,
                    Status: user.status,
                    Role: user.role,
                    "Created Date":
                        user.createdAt,
                })
            );

        const columns = [
            {
                header: "ID",
                key: "ID",
            },
            {
                header: "Name",
                key: "Name",
            },
            {
                header: "Email",
                key: "Email",
            },
            {
                header: "Mobile",
                key: "Mobile",
            },
            {
                header: "Status",
                key: "Status",
            },
            {
                header: "Role",
                key: "Role",
            },
            {
                header: "Created Date",
                key: "Created Date",
            },
        ];

        const file =
            await createExcelFile({
                reportType: "USER",
                rows,
                columns,
                generatedBy:
                    req.user.id,
                filters: req.query,
            });

        res.download(
            file.filePath,
            file.fileName
        );
    } catch (error) {
        console.error(
            "Export Users Excel Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to export user report",
        });
    }
};

// ==========================================
// PRODUCT EXCEL
// ==========================================

const exportProductsExcel = async (
    req,
    res
) => {
    try {
        const {
            search,
            categoryId,
            minStock,
            maxStock,
        } = req.query;

        const where = {};

        if (search) {
            where.name = {
                [Op.like]: `%${search}%`,
            };
        }

        if (categoryId) {
            where.categoryId =
                categoryId;
        }

        if (
            minStock !== undefined ||
            maxStock !== undefined
        ) {
            where.stock = {};

            if (
                minStock !==
                undefined
            ) {
                where.stock[Op.gte] =
                    Number(minStock);
            }

            if (
                maxStock !==
                undefined
            ) {
                where.stock[Op.lte] =
                    Number(maxStock);
            }
        }

        const products =
            await Product.findAll({
                where,

                attributes: [
                    "id",
                    "name",
                    "price",
                    "stock",
                    "categoryId",
                    "createdAt",
                ],

                include: [
                    {
                        model: Category,
                        as: "category",
                        attributes: [
                            "name",
                        ],
                    },
                ],

                order: [
                    [
                        "createdAt",
                        "DESC",
                    ],
                ],
            });

        const rows =
            products.map(
                (product) => ({
                    ID: product.id,
                    Product:
                        product.name,
                    Category:
                        product.category
                            ? product
                                  .category
                                  .name
                            : "",
                    Price:
                        Number(
                            product.price
                        ),
                    Stock:
                        product.stock,
                    "Created Date":
                        product.createdAt,
                })
            );

        const columns = [
            {
                header: "ID",
                key: "ID",
            },
            {
                header: "Product",
                key: "Product",
            },
            {
                header: "Category",
                key: "Category",
            },
            {
                header: "Price",
                key: "Price",
            },
            {
                header: "Stock",
                key: "Stock",
            },
            {
                header: "Created Date",
                key: "Created Date",
            },
        ];

        const file =
            await createExcelFile({
                reportType: "PRODUCT",
                rows,
                columns,
                generatedBy:
                    req.user.id,
                filters: req.query,
            });

        res.download(
            file.filePath,
            file.fileName
        );
    } catch (error) {
        console.error(
            "Export Products Excel Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to export product report",
        });
    }
};

// ==========================================
// ORDER EXCEL
// ==========================================

const exportOrdersExcel = async (
    req,
    res
) => {
    try {
        const {
            status,
            userId,
            startDate,
            endDate,
        } = req.query;

        const where = {};

        if (status) {
            where.status = status;
        }

        if (userId) {
            where.userId = userId;
        }

        const dateFilter =
            getDateFilter(
                startDate,
                endDate
            );

        if (dateFilter) {
            where.createdAt =
                dateFilter;
        }

        const orders =
            await Order.findAll({
                where,

                attributes: [
                    "id",
                    "userId",
                    "totalAmount",
                    "status",
                    "createdAt",
                ],

                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: [
                            "name",
                            "email",
                        ],
                    },
                ],

                order: [
                    [
                        "createdAt",
                        "DESC",
                    ],
                ],
            });

        const rows =
            orders.map(
                (order) => ({
                    "Order ID":
                        order.id,

                    Customer:
                        order.user
                            ? order.user
                                  .name
                            : "",

                    Email:
                        order.user
                            ? order.user
                                  .email
                            : "",

                    Amount:
                        Number(
                            order.totalAmount
                        ),

                    Status:
                        order.status,

                    "Order Date":
                        order.createdAt,
                })
            );

        const columns = [
            {
                header: "Order ID",
                key: "Order ID",
            },
            {
                header: "Customer",
                key: "Customer",
            },
            {
                header: "Email",
                key: "Email",
            },
            {
                header: "Amount",
                key: "Amount",
            },
            {
                header: "Status",
                key: "Status",
            },
            {
                header: "Order Date",
                key: "Order Date",
            },
        ];

        const file =
            await createExcelFile({
                reportType: "ORDER",
                rows,
                columns,
                generatedBy:
                    req.user.id,
                filters: req.query,
            });

        res.download(
            file.filePath,
            file.fileName
        );
    } catch (error) {
        console.error(
            "Export Orders Excel Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to export order report",
        });
    }
};

// ==========================================
// SALES EXCEL
// ==========================================

const exportSalesExcel = async (
    req,
    res
) => {
    try {
        const {
            startDate,
            endDate,
        } = req.query;

        const where = {};

        const dateFilter =
            getDateFilter(
                startDate,
                endDate
            );

        if (dateFilter) {
            where.createdAt =
                dateFilter;
        }

        const orders =
            await Order.findAll({
                where,

                attributes: [
                    "id",
                    "userId",
                    "totalAmount",
                    "status",
                    "createdAt",
                ],

                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: [
                            "name",
                            "email",
                        ],
                    },
                ],

                order: [
                    [
                        "createdAt",
                        "DESC",
                    ],
                ],
            });

        const completedOrders =
            orders.filter(
                (order) =>
                    order.status ===
                    "Delivered"
            );

        const rows =
            completedOrders.map(
                (order) => ({
                    "Order ID":
                        order.id,

                    Customer:
                        order.user
                            ? order.user
                                  .name
                            : "",

                    Email:
                        order.user
                            ? order.user
                                  .email
                            : "",

                    Amount:
                        Number(
                            order.totalAmount
                        ),

                    Status:
                        order.status,

                    "Order Date":
                        order.createdAt,
                })
            );

        const totalSales =
            completedOrders.reduce(
                (total, order) =>
                    total +
                    Number(
                        order.totalAmount
                    ),
                0
            );

        const worksheetRows = [
            {
                "Order ID":
                    "TOTAL SALES",
                Customer: "",
                Email: "",
                Amount:
                    Number(
                        totalSales.toFixed(
                            2
                        )
                    ),
                Status: "",
                "Order Date": "",
            },
            ...rows,
        ];

        const columns = [
            {
                header: "Order ID",
                key: "Order ID",
            },
            {
                header: "Customer",
                key: "Customer",
            },
            {
                header: "Email",
                key: "Email",
            },
            {
                header: "Amount",
                key: "Amount",
            },
            {
                header: "Status",
                key: "Status",
            },
            {
                header: "Order Date",
                key: "Order Date",
            },
        ];

        const file =
            await createExcelFile({
                reportType: "SALES",
                rows: worksheetRows,
                columns,
                generatedBy:
                    req.user.id,
                filters: req.query,
            });

        res.download(
            file.filePath,
            file.fileName
        );
    } catch (error) {
        console.error(
            "Export Sales Excel Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to export sales report",
        });
    }
};

// ==========================================
// PDF HELPER
// ==========================================

const createPDFFile = ({
    title,
    headers,
    rows,
    reportType,
    generatedBy,
    filters,
    res,
}) => {
    const timestamp =
        Date.now();

    const fileName =
        `${reportType.toLowerCase()}-report-${timestamp}.pdf`;

    const filePath =
        path.join(
            reportsDirectory,
            fileName
        );

    const document =
        new PDFDocument({
            margin: 40,
            size: "A4",
        });

    const stream =
        fs.createWriteStream(
            filePath
        );

    document.pipe(stream);

    document
        .fontSize(18)
        .text(title, {
            align: "center",
        });

    document.moveDown();

    document
        .fontSize(9)
        .text(
            `Generated: ${new Date().toLocaleString()}`
        );

    document.moveDown();

    headers.forEach(
        (header) => {
            document
                .fontSize(9)
                .text(
                    `${header}:`,
                    {
                        continued: true,
                    }
                );
        }
    );

    document.moveDown();

    rows.forEach((row) => {
        document
            .fontSize(9)
            .text(
                row.join(" | ")
            );

        document.moveDown(
            0.3
        );
    });

    document.end();

    stream.on(
        "finish",
        async () => {
            await saveReportHistory({
                reportType,
                format: "PDF",
                filters,
                fileName,
                filePath,
                generatedBy,
            });

            res.download(
                filePath,
                fileName
            );
        }
    );

    stream.on(
        "error",
        (error) => {
            console.error(
                "PDF Stream Error:",
                error
            );

            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message:
                        "Failed to generate PDF",
                });
            }
        }
    );
};

// ==========================================
// USERS PDF
// ==========================================

const exportUsersPDF = async (
    req,
    res
) => {
    try {
        const {
            search,
            status,
            role,
            startDate,
            endDate,
        } = req.query;

        const where = {};

        if (search) {
            where[Op.or] = [
                {
                    name: {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    email: {
                        [Op.like]: `%${search}%`,
                    },
                },
            ];
        }

        if (status) {
            where.status = status;
        }

        if (role) {
            where.role = role;
        }

        const dateFilter =
            getDateFilter(
                startDate,
                endDate
            );

        if (dateFilter) {
            where.createdAt =
                dateFilter;
        }

        const users =
            await User.findAll({
                where,
                attributes: [
                    "id",
                    "name",
                    "email",
                    "status",
                    "role",
                ],
                order: [
                    [
                        "createdAt",
                        "DESC",
                    ],
                ],
            });

        const rows =
            users.map(
                (user) => [
                    user.id,
                    user.name,
                    user.email,
                    user.status,
                    user.role,
                ]
            );

        createPDFFile({
            title: "User Report",
            headers: [
                "ID | Name | Email | Status | Role",
            ],
            rows,
            reportType: "USER",
            generatedBy:
                req.user.id,
            filters: req.query,
            res,
        });
    } catch (error) {
        console.error(
            "Export Users PDF Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to export user PDF",
        });
    }
};

// ==========================================
// PRODUCTS PDF
// ==========================================

const exportProductsPDF = async (
    req,
    res
) => {
    try {
        const {
            search,
            categoryId,
        } = req.query;

        const where = {};

        if (search) {
            where.name = {
                [Op.like]: `%${search}%`,
            };
        }

        if (categoryId) {
            where.categoryId =
                categoryId;
        }

        const products =
            await Product.findAll({
                where,
                attributes: [
                    "id",
                    "name",
                    "price",
                    "stock",
                ],
                order: [
                    [
                        "createdAt",
                        "DESC",
                    ],
                ],
            });

        const rows =
            products.map(
                (product) => [
                    product.id,
                    product.name,
                    Number(
                        product.price
                    ),
                    product.stock,
                ]
            );

        createPDFFile({
            title: "Product Report",
            headers: [
                "ID | Product | Price | Stock",
            ],
            rows,
            reportType: "PRODUCT",
            generatedBy:
                req.user.id,
            filters: req.query,
            res,
        });
    } catch (error) {
        console.error(
            "Export Products PDF Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to export product PDF",
        });
    }
};

// ==========================================
// ORDERS PDF
// ==========================================

const exportOrdersPDF = async (
    req,
    res
) => {
    try {
        const {
            status,
            userId,
            startDate,
            endDate,
        } = req.query;

        const where = {};

        if (status) {
            where.status = status;
        }

        if (userId) {
            where.userId = userId;
        }

        const dateFilter =
            getDateFilter(
                startDate,
                endDate
            );

        if (dateFilter) {
            where.createdAt =
                dateFilter;
        }

        const orders =
            await Order.findAll({
                where,
                attributes: [
                    "id",
                    "userId",
                    "totalAmount",
                    "status",
                    "createdAt",
                ],
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: [
                            "name",
                        ],
                    },
                ],
                order: [
                    [
                        "createdAt",
                        "DESC",
                    ],
                ],
            });

        const rows =
            orders.map(
                (order) => [
                    order.id,
                    order.user
                        ? order.user
                              .name
                        : "",
                    Number(
                        order.totalAmount
                    ),
                    order.status,
                    new Date(
                        order.createdAt
                    ).toLocaleDateString(),
                ]
            );

        createPDFFile({
            title: "Order Report",
            headers: [
                "ID | Customer | Amount | Status | Date",
            ],
            rows,
            reportType: "ORDER",
            generatedBy:
                req.user.id,
            filters: req.query,
            res,
        });
    } catch (error) {
        console.error(
            "Export Orders PDF Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to export order PDF",
        });
    }
};

// ==========================================
// SALES PDF
// ==========================================

const exportSalesPDF = async (
    req,
    res
) => {
    try {
        const {
            startDate,
            endDate,
        } = req.query;

        const where = {};

        const dateFilter =
            getDateFilter(
                startDate,
                endDate
            );

        if (dateFilter) {
            where.createdAt =
                dateFilter;
        }

        const orders =
            await Order.findAll({
                where,
                attributes: [
                    "id",
                    "userId",
                    "totalAmount",
                    "status",
                    "createdAt",
                ],
                include: [
                    {
                        model: User,
                        as: "user",
                        attributes: [
                            "name",
                        ],
                    },
                ],
                order: [
                    [
                        "createdAt",
                        "DESC",
                    ],
                ],
            });

        const completedOrders =
            orders.filter(
                (order) =>
                    order.status ===
                    "Delivered"
            );

        const totalSales =
            completedOrders.reduce(
                (total, order) =>
                    total +
                    Number(
                        order.totalAmount
                    ),
                0
            );

        const rows =
            completedOrders.map(
                (order) => [
                    order.id,
                    order.user
                        ? order.user
                              .name
                        : "",
                    Number(
                        order.totalAmount
                    ),
                    order.status,
                    new Date(
                        order.createdAt
                    ).toLocaleDateString(),
                ]
            );

        rows.unshift([
            "TOTAL",
            "",
            Number(
                totalSales.toFixed(2)
            ),
            "",
            "",
        ]);

        createPDFFile({
            title: "Sales Report",
            headers: [
                "Order ID | Customer | Amount | Status | Date",
            ],
            rows,
            reportType: "SALES",
            generatedBy:
                req.user.id,
            filters: req.query,
            res,
        });
    } catch (error) {
        console.error(
            "Export Sales PDF Error:",
            error
        );

        res.status(500).json({
            success: false,
            message:
                "Failed to export sales PDF",
        });
    }
};

module.exports = {
    getUserReport,
    getProductReport,
    getOrderReport,
    getSalesReport,

    exportUsersExcel,
    exportProductsExcel,
    exportOrdersExcel,
    exportSalesExcel,

    exportUsersPDF,
    exportProductsPDF,
    exportOrdersPDF,
    exportSalesPDF,
};