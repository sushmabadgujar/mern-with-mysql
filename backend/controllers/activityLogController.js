const { Op } = require("sequelize");
const { ActivityLog, User } = require("../models");
const getAllActivityLogs = async (req, res) => {
    try {
         console.log("Activity Logs API HIT");
        console.log("User:", req.user);
        console.log("Query:", req.query);

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.max(parseInt(req.query.limit) || 10, 1);
        const offset = (page - 1) * limit;

        const search = req.query.search?.trim() || "";
        const action = req.query.action || "";
        const module = req.query.module || "";

        const where = {};

        if (action) {
            where.action = action;
        }

        if (module) {
            where.module = module;
        }

        const userWhere = {};

        if (search) {
            userWhere[require("sequelize").Op.or] = [
                {
                    name: {
                        [require("sequelize").Op.like]: `%${search}%`,
                    },
                },
                {
                    email: {
                        [require("sequelize").Op.like]: `%${search}%`,
                    },
                },
            ];
        }

        const { count, rows } = await ActivityLog.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "name", "email", "role"],
                    where:
                        Object.keys(userWhere).length > 0
                            ? userWhere
                            : undefined,
                    required: Object.keys(userWhere).length > 0,
                },
            ],
            order: [["createdAt", "DESC"]],
            limit,
            offset,
        });
        console.log("Activity count:", count);
        console.log("Activity rows:", rows);
        res.status(200).json({
            activities: rows,
            currentPage: page,
            limit,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
        });
    } catch (error) {
        console.error("Get Activity Logs Error:", error);

        res.status(500).json({
            message: "Unable to fetch activity logs.",
            error: error.message,
        });
    }
};

const deleteActivityLog = async (req, res) => {
    try {
        const { id } = req.params;

        const activity = await ActivityLog.findByPk(id);

        if (!activity) {
            return res.status(404).json({
                message: "Activity log not found.",
            });
        }

        await activity.destroy();

        res.status(200).json({
            message: "Activity log deleted successfully.",
        });
    } catch (error) {
        console.error("Delete Activity Log Error:", error);

        res.status(500).json({
            message: "Unable to delete activity log.",
            error: error.message,
        });
    }
};

const clearActivityLogs = async (req, res) => {
    try {
        await ActivityLog.destroy({
            where: {},
        });

        res.status(200).json({
            message: "All activity logs deleted successfully.",
        });
    } catch (error) {
        console.error("Clear Activity Logs Error:", error);

        res.status(500).json({
            message: "Unable to clear activity logs.",
            error: error.message,
        });
    }
};

module.exports = {
    getAllActivityLogs,
    deleteActivityLog,
    clearActivityLogs,
};