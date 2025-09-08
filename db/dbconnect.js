//import Sequelize
import { Sequelize } from "sequelize";
import createUserModel from "../model/userModel.js";

export const dbconnect = async (database, username, password) => {
  const sequelize = new Sequelize(database, username, password, {
    host: "localhost",
    dialect: "postgres",
  });
  try {
    //these three await came later aftercreating model/usermodel.js
    await sequelize.authenticate();
    await createUserModel(sequelize);

    // sequelize.sync({ force: true }) drop off existing table
    // await sequelize.sync({ force: true });
    await sequelize.sync({ alter: true });
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
