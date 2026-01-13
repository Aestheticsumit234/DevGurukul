import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid token",
      });
    }

    const user = await User.findById(decoded.id).select(
      "-__v -createdAt -updatedAt"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select("role");
    if (!user && user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Admins only can create problem",
      });
    }
    next();
  } catch (error) {
    console.error("Check admin middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking admin role",
    });
  }
};
