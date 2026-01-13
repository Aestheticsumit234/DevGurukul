import User from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  const { name, email, password, image, role } = req.body;
  try {
    const existingUser = await User.findOne({ email }).select("+password");
    if (existingUser) {
      return res
        .status(400)
        .json({ sucess: false, message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      image,
      role,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      sucess: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        image: newUser.image,
      },
    });
  } catch (error) {
    console.log("Error in register user", error);
    res.status(500).json({ sucess: false, message: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ sucess: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ sucess: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      sucess: true,
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.log("Error in loging User", error);
    res.status(500).json({ sucess: false, message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
    });

    res
      .status(200)
      .json({ message: "User logged out successfully", sucess: true });
  } catch (error) {}
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(userId);
    const user = await User.findById(userId).select(
      "-password -__v -createdAt -updatedAt"
    );
    res.status(200).json({ sucess: true, user });
  } catch (error) {
    console.log("Error in getMe", error);
    res.status(500).json({ sucess: false, message: "Internal Server Error" });
  }
};

export const check = async (req, res) => {
  try {
    res.status(200).json({
      sucess: true,
      message: "User authenticated successfully!",
      user: req.user,
    });
  } catch (error) {
    console.log("Error in getMe", error);
    res.status(500).json({ sucess: false, message: "Internal Server Error" });
  }
};
