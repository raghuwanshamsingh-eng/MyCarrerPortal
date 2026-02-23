import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "mycareerportal"
  },
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER || "",
    password: process.env.SMTP_PASSWORD || ""
  },
  services: {
    resume: process.env.RESUME_SERVICE_URL || "http://localhost:8000",
    evaluator: process.env.EVALUATOR_SERVICE_URL || "http://localhost:8001",
    interview: process.env.INTERVIEW_SERVICE_URL || "http://localhost:8002"
  },
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173"
};
