import { User } from "../db/dbconnect.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
  authenticateToken,
} from "../auth/authToken.js";
import jwt from "jsonwebtoken";

import { json } from "sequelize";

export const registerUser = async (req, res) => {
  try {
    //console.log(req.body);
    const { username, email, password } = req.body;
    // checks for one of the existing data in the database
    const checkUserExist = await User.findOne({ where: { username } });

    if (checkUserExist) {
      res.status(400).json("User already exits");
    } else {
      //hashing password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      //create user
      const user = await User.create({
        // ...req.body
        username,
        email,
        password: hashedPassword,
      });
      // const token = generateAccessToken(user);
      return res.status(201).json({
        message: "User registered successfully",
        userInfo: {
          username,
          email,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    //login with email and password
    const { email, password } = req.body;

    // Find user by email
    const exist = await User.findOne({ where: { email } });
    if (!exist) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, exist.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log(exist);
    //res.status(200).json(exist);
    //cosole.log(dataValues);
    const accessToken = generateAccessToken(exist.dataValues);
    const refreshToken = generateRefreshToken(exist.dataValues);

    //update DB
    await exist.update({ refreshToken: refreshToken });

    //clear cookie
    //res.clearCookie("refreshToken");

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

    res.status(200).json({
      message: "User logged in",
      username: exist.dataValues.username,
      userInfo: { accessToken: accessToken, refreshToken: refreshToken },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "refresh token not found" });
    }
    //check DB for refresh token from log in route using exist.update
    const user = await User.findOne({ where: { refreshToken: refreshToken } });
    console.log(user);
    if (!user) {
      res.status(403).json({ message: "forbidden token or token not valid" });
    }
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          res.status(403).json({ message: "Invalid token or expired" });
        }
        const token = generateAccessToken(user.dataValues);
        return res.status(200).json({ newAccessToken: token });
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutController = async (req, res) => {
  try {
    //use cookies to logout
    const loginRefreshToken = req.cookies.refreshToken;
    if (!loginRefreshToken) {
      return res.status(401).json("refresh token not found");
    }
    const userDB = await User.findOne({
      where: { refreshToken: loginRefreshToken },
    });
    if (userDB != null) {
      await userDB.update({ refreshToken: null });
    }
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "user logout successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const profileController = async (req, res) => {
 try {
    // `req.user` comes from your decoded JWT
    res.status(200).json({
      message: "Dashboard",
      user: req.user, // send user data decoded from token
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};