import { Router } from "express";
import multer from "multer";
import path from "path";
import { authMiddleware } from "../middleware/auth.js";
import { handleResumeUpload, getLatestResumeAnalysis } from "../modules/resume/resume.controller.js";

const router = Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads", "resumes"));
  },
  filename(req, file, cb) {
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${timestamp}-${random}${ext}`);
  }
});

const upload = multer({ storage });

router.post("/upload", authMiddleware, upload.single("file"), handleResumeUpload);
router.get("/latest", authMiddleware, getLatestResumeAnalysis);

export default router;
