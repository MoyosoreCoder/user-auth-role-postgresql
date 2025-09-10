// import Sequelize
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import createUserModel from "../model/userModel.js";

dotenv.config(); // loads environment variables from .env

// create sequelize instance using .env variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  }
);

export const dbconnect = async () => {
  try {
    await sequelize.authenticate();
    await createUserModel(sequelize);

    // await sequelize.sync({ force: true });
    //  // drops and recreates
    await sequelize.sync({ alter: true });
    console.log("✅ Connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};
