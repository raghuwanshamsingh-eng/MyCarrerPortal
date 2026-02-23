import { Router } from "express";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { authMiddleware } from "../middleware/auth.js";
import {
  registerStep1,
  registerStep2,
  login,
  forgotPassword,
  resetPassword,
  me
} from "../modules/auth/auth.controller.js";

const router = Router();

router.post("/register/step1", authRateLimiter, registerStep1);
router.post("/register/step2", authRateLimiter, registerStep2);
router.post("/login", authRateLimiter, login);
router.post("/forgot-password", authRateLimiter, forgotPassword);
router.post("/reset-password", authRateLimiter, resetPassword);
router.get("/me", authMiddleware, me);

export default router;
