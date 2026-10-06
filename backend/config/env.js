const env = {
    nodeEnv:
        process.env.NODE_ENV || "development",

    port:
        Number(process.env.PORT) || 5000,

    database: {
        host:
            process.env.DB_HOST || "localhost",

        port:
            Number(process.env.DB_PORT) || 3306,

        name:
            process.env.DB_NAME,

        user:
            process.env.DB_USER,

        password:
            process.env.DB_PASSWORD || "",
    },

    jwt: {
        secret:
            process.env.JWT_SECRET,

        expiresIn:
            process.env.JWT_EXPIRES_IN || "1d",
    },

    clientUrl:
        process.env.CLIENT_URL ||
        "http://localhost:5173",

    mail: {
        host:
            process.env.MAIL_HOST,

        port:
            Number(process.env.MAIL_PORT) || 587,

        user:
            process.env.MAIL_USER,

        password:
            process.env.MAIL_PASSWORD,
    },

    frontendUrl:
        process.env.FRONTEND_URL ||
        "http://localhost:5173",
};

module.exports = env;