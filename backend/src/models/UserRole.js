import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";
import { Role } from "./Role.js";

export const UserRole = sequelize.define(
  "UserRole",
  {
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      field: "user_id",
      references: {
        model: User,
        key: "id"
      }
    },
    roleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      field: "role_id",
      references: {
        model: Role,
        key: "id"
      }
    }
  },
  {
    tableName: "user_roles",
    timestamps: false
  }
);

User.belongsToMany(Role, { through: UserRole, foreignKey: "user_id" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "role_id" });
