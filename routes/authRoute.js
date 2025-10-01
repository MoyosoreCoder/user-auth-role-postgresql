import { Router } from "express";
import {
  registerUser,
  loginUser,
  refreshTokenController,
  logoutController,
  profileController,
} from "../controllers/authController.js";
import { authenticateToken } from "../auth/authToken.js";
const router = Router();
/*
router.get("/", (req, res) => {
  res.send("welcome to my api");
}); 
*/
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refreshtoken", refreshTokenController);
router.post("/logout", logoutController);
router.post("/profile", authenticateToken, profileController);

export default router;
