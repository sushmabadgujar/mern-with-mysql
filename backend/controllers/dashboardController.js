const { Op } = require("sequelize");
const User = require("../models/User");

const getDashboardStats = async (req, res, next) => {
  try {
    // Total Users
    const totalUsers = await User.count();

    // Active Users
    const activeUsers = await User.count({
      where: {
        status: "active",
      },
    });

    // Inactive Users
    const inactiveUsers = await User.count({
      where: {
        status: "inactive",
      },
    });

    // New registrations - current month
    const startOfMonth = new Date();

    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newRegistrations = await User.count({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
    });

    return res.status(200).json({
      message: "Dashboard statistics fetched successfully.",
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        newRegistrations,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};