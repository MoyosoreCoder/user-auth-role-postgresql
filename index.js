import express from "express";
import cookieParser from "cookie-parser"
import { dbconnect } from "./db/dbconnect.js";
import apiRouter from "./routes/authRoute.js";

const app = express();

app.use(cookieParser())

//middleware to allow json request
app.use(express.json());

app.use("/api", apiRouter);
dbconnect();

app.listen(8081, () => {
  console.log("server is running at port 8081");
});
