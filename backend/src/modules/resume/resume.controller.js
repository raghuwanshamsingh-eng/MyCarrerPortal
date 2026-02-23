import fs from "fs";
import path from "path";
import axios from "axios";
import { Resume } from "../../models/Resume.js";
import { ResumeAnalysis } from "../../models/ResumeAnalysis.js";
import { env } from "../../config/env.js";

const uploadDir = path.join(process.cwd(), "uploads", "resumes");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const handleResumeUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: { code: "NO_FILE", message: "Resume file is required" }
      });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext !== ".pdf") {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_FILE_TYPE", message: "Only PDF resumes are supported" }
      });
    }

    const relativePath = path.join("uploads", "resumes", req.file.filename);
    const resume = await Resume.create({
      userId: req.user.id,
      filePath: relativePath
    });

    const fileBuffer = fs.readFileSync(req.file.path);

    const aiResponse = await axios.post(
      `${env.services.resume}/analyze`,
      fileBuffer,
      {
        headers: {
          "Content-Type": "application/pdf"
        },
        timeout: 30000
      }
    );

    const payload = aiResponse.data;

    const analysis = await ResumeAnalysis.create({
      resumeId: resume.id,
      resumeScore: payload.resume_score,
      skillRelevance: payload.skill_relevance,
      projectDepth: payload.project_depth,
      experienceScore: payload.experience_score,
      structureScore: payload.structure_score,
      missingSkills: payload.missing_skills,
      suggestions: payload.suggestions
    });

    res.status(201).json({
      success: true,
      data: {
        resumeId: resume.id,
        analysis: {
          resumeScore: analysis.resumeScore,
          skillRelevance: analysis.skillRelevance,
          projectDepth: analysis.projectDepth,
          experienceScore: analysis.experienceScore,
          structureScore: analysis.structureScore,
          missingSkills: analysis.missingSkills,
          suggestions: analysis.suggestions
        }
      },
      error: null
    });
  } catch (err) {
    next(err);
  }
};

export const getLatestResumeAnalysis = async (req, res, next) => {
  try {
    const latestResume = await Resume.findOne({
      where: { userId: req.user.id },
      order: [["uploadedAt", "DESC"]]
    });

    if (!latestResume) {
      return res.json({
        success: true,
        data: null,
        error: null
      });
    }

    const analysis = await ResumeAnalysis.findOne({
      where: { resumeId: latestResume.id },
      order: [["analyzedAt", "DESC"]]
    });

    res.json({
      success: true,
      data: analysis
        ? {
            resumeScore: analysis.resumeScore,
            skillRelevance: analysis.skillRelevance,
            projectDepth: analysis.projectDepth,
            experienceScore: analysis.experienceScore,
            structureScore: analysis.structureScore,
            missingSkills: analysis.missingSkills,
            suggestions: analysis.suggestions
          }
        : null,
      error: null
    });
  } catch (err) {
    next(err);
  }
};
