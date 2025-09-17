import { User } from "../db/dbconnect.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    //console.log(req.body);
    const { username, email, password } = req.body;
    // checks for one of the existing data in the database
    const checkUserExist = await User.findOne({ where: { username } });

    if (checkUserExist) {
      res.status(400).json("User already exits");
    } else {
      //create user after hashing password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await User.create({
        //just create without hashing password
        // ...req.body
        username,
        email,
        password: hashedPassword,
      });
      return res.status(201).json({ user });
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
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    res.json({ message: "Login successful", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
