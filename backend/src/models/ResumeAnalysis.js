import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Resume } from "./Resume.js";

export const ResumeAnalysis = sequelize.define(
  "ResumeAnalysis",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    resumeId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: "resume_id",
      references: {
        model: Resume,
        key: "id"
      }
    },
    resumeScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: "resume_score"
    },
    skillRelevance: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: "skill_relevance"
    },
    projectDepth: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: "project_depth"
    },
    experienceScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: "experience_score"
    },
    structureScore: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      field: "structure_score"
    },
    missingSkills: {
      type: DataTypes.JSON,
      allowNull: true,
      field: "missing_skills"
    },
    suggestions: {
      type: DataTypes.JSON,
      allowNull: true
    },
    analyzedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "analyzed_at"
    }
  },
  {
    tableName: "resume_analysis",
    timestamps: false
  }
);

ResumeAnalysis.belongsTo(Resume, { foreignKey: "resume_id" });
