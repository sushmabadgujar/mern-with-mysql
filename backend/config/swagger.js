const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",

        info: {
            title: "User CRUD API",
            version: "1.0.0",
            description:
                "API documentation for User CRUD Development application",
        },

        servers: [
            {
                url: "http://localhost:5000",
                description: "Local Development Server",
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },

        tags: [
            {
                name: "Authentication",
                description: "Authentication APIs",
            },
            {
                name: "Users",
                description: "User management APIs",
            },
            {
                name: "Profile",
                description: "User profile APIs",
            },
            {
                name: "Products",
                description: "Product management APIs",
            },
            {
                name: "Categories",
                description: "Categories management APIs",
            },
        ],
    },

    apis: [
        "./routes/*.js",
        "./controllers/*.js",
    ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;