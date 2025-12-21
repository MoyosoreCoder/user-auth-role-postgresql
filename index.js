import express from "express";
import { dbconnect } from "./db/dbconnect.js";
import apiRouter from "./routes/authRoute.js";

const app = express();

app.use("/api", apiRouter);
dbconnect();

app.listen(8081, () => {
  console.log("server is running at port 8081");
});
