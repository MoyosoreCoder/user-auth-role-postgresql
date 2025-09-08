//DataTypes is used insequelize
import { DataTypes } from "sequelize";

// Define user data,create a function
const createUserModel = (sequelize) => {
  const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100], // password length between 6–100 chars
      },
    },
    refreshToken: { type: DataTypes.TEXT, allowNull: true },
  });
  return User;
};
export default createUserModel;
