import { Router } from "express";
import {
  login,
  logout,
  profile,
  register,
  resetPassword,
  updatePassword,
} from "../controllers/authController.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", authRequired, profile);
router.get("/updatePassword", authRequired, updatePassword);
router.get("/resetPassword", authRequired, resetPassword);

export default router;
