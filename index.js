import express from "express";
import { dbconnect } from "./db/dbconnect.js";

const app = express();

dbconnect("auth1", "postgres", "mariamkel");

app.listen(8081, () => {
  console.log("server is running at port 8081");
});
