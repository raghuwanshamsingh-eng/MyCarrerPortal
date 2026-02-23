import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";

export const Resume = sequelize.define(
  "Resume",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
      field: "user_id",
      references: {
        model: User,
        key: "id"
      }
    },
    filePath: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "file_path"
    },
    uploadedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "uploaded_at"
    }
  },
  {
    tableName: "resumes",
    timestamps: false
  }
);

Resume.belongsTo(User, { foreignKey: "user_id" });
