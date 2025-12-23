import jwt from "jsonwebtoken";
const generateAccessToken = (user) => {
  const token = jwt.sign(
    { username: user.username, id: user.id },
    process.env.ACCESS_TOKEN_SECRET,
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
const authenticateToken = async (req, res, next) => {
  //console.log("authenticate");
  //const token = req.headers;
  // console.log(token);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // safer way
  console.log(token);
  if (!token) {
    return res.status(401).json("access token missinng");
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json("Forbidden token");
    }

    // 👇 Only runs when token is valid
    req.user = decoded;

    next(); // go to the next middleware / controller
  });
};

export { generateAccessToken, generateRefreshToken, authenticateToken };
