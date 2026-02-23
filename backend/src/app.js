import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import { apiRateLimiter } from "./middleware/rateLimiter.js";
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { env } from "./config/env.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: env.frontendUrl,
      credentials: true
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

  app.use("/api", apiRateLimiter);

  app.use("/api/auth", authRoutes);
  app.use("/api/resume", resumeRoutes);

  app.use((req, res) => {
    res.status(404).json({
      success: false,
      data: null,
      error: { code: "NOT_FOUND", message: "Route not found" }
    });
  });

  app.use(errorHandler);

  return app;
}
