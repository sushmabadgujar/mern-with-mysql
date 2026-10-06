const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");
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

const getUsers = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 5,
      search = "",
      sortBy = "id",
      sortOrder = "DESC"
    } = req.query;

    page = Math.max(parseInt(page) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit) || 5, 1), 100);

    const allowedSortFields = ["id", "name", "email", "mobileNumber", "status", "createdAt"];
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : "id";
    const safeSortOrder = String(sortOrder).toUpperCase() === "ASC" ? "ASC" : "DESC";

    const offset = (page - 1) * limit;

    const where = search
      ? {
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } }
        ]
      }
      : {};

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ["password", "updatedAt"] },
      order: [[safeSortBy, safeSortOrder]],
      limit,
      offset
    });

    return res.json({
      users: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password", "updatedAt"] }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.json({ user });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
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
    await createActivityLog({
          userId: req.user.id,
          action: "CREATE",
          module: "USER",
          description: `Register User "${user.name}".`,
          referenceId: user.id,
          req,
        });
    return res.status(201).json({
      message: "User created successfully.",
      user: safeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { name, email, mobileNumber, status, password } = req.body;

    const duplicate = await User.findOne({
      where: {
        email,
        id: { [Op.ne]: req.params.id }
      }
    });

    if (duplicate) {
      return res.status(409).json({ message: "Email already exists." });
    }

    user.name = name;
    user.email = email;
    user.mobileNumber = mobileNumber;
    user.status = status || user.status;

    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }
      // --------------------------------
    if (req.file) {
      console.log("New file =>", req.file);

      // Old image path from database
      if (user.profileImage) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          user.profileImage
        );

        console.log("Old image path =>", oldImagePath);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Old image deleted");
        }
      }

      // Save new image path
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    return res.json({
      message: "User updated successfully.",
      user: safeUser(user)
    });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (Number(req.params.id) === Number(req.user.id)) {
      return res.status(400).json({ message: "You cannot delete your own account." });
    }
    
    if (user.profileImage) {
      console.log(user.profileImage);
      const fileName = path.basename(user.profileImage);

      const filePath = path.join(
        process.cwd(),
        "uploads",
        fileName
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Profile image deleted:", filePath);
      }
    }
    await user.destroy();

    return res.json({ message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password", "updatedAt"] }
    });

    if (!user) {
      return res.status(404).json({ message: "Profile not found." });
    }

    return res.json({ user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    console.log("req.file dsfdfsdf =>", req.file);
    console.log("req.body =>", req.body);

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "Profile not found.",
      });
    }

    const { name, email, mobileNumber } = req.body;

    // Check duplicate email
    const duplicate = await User.findOne({
      where: {
        email,
        id: {
          [Op.ne]: req.user.id,
        },
      },
    });

    if (duplicate) {
      return res.status(409).json({
        message: "Email already exists.",
      });
    }

    // --------------------------------
    // Delete old image if new image uploaded
    // --------------------------------
    if (req.file) {
      console.log("New file =>", req.file);

      // Old image path from database
      if (user.profileImage) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          user.profileImage
        );

        console.log("Old image path =>", oldImagePath);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Old image deleted");
        }
      }

      // Save new image path
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    user.name = name;
    user.email = email;
    user.mobileNumber = mobileNumber;

    await user.save();

    return res.json({
      message: "Profile updated successfully.",
      user: safeUser(user),
    });

  } catch (error) {
    next(error);
  }
};


module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile,
};
