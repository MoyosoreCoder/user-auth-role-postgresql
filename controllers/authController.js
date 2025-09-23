import { User } from "../db/dbconnect.js";
import bcrypt from "bcryptjs";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../auth/authToken.js";
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
    //res.status(200).json(exist);
    //clear cookie

    exist.update({ refreshToken: refreshToken });
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
