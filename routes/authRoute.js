import { Router } from "express";
import { registerUser } from "../controllers/authController.js";

const router = Router();
/*
router.get("/", (req, res) => {
  res.send("welcome to my api");
}); 
*/
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
