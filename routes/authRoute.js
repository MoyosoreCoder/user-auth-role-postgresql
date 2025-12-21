import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshTokenController,
} from "../controllers/authController.js";

const router = Router();
/*
router.get("/", (req, res) => {
  res.send("welcome to my api");
}); 
*/
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refreshtoken", refreshTokenController);
export default router;
