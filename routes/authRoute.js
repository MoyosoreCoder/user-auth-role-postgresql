import { Router } from "express";
import { registerUser } from "../controllers/authController.js";

const router = Router();
/*
router.get("/", (req, res) => {
  res.send("welcome to my api");
}); 
*/
router.get("/register", registerUser);

export default router;
