import jwt from "jsonwebtoken";
const generateAccessToken =  (user) => {
  const token = jwt.sign(
    { username: user.username, id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "15min",
    }
  );
  return token;
};
const generateRefreshToken = (user) => {
  const token = jwt.sign(
    { username: user.username, id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  return token;
};
export { generateAccessToken, generateRefreshToken };
