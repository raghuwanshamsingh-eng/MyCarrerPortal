import { User } from "../../models/User.js";
import { Role } from "../../models/Role.js";
import { UserRole } from "../../models/UserRole.js";
import { OtpToken } from "../../models/OtpToken.js";
import { hashPassword, comparePassword } from "../../utils/hashing.js";
import { signToken } from "../../utils/jwt.js";
import { sendOtpMail } from "../../config/mailer.js";
import crypto from "crypto";

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export const registerStep1 = async (req, res, next) => {
  try {
    const { email, password, fullName, phone } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Missing required fields" }
      });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: { code: "EMAIL_TAKEN", message: "Email already registered" } });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ email, passwordHash, fullName, phone });

    const [studentRole] = await Role.findOrCreate({
      where: { name: "student" },
      defaults: { name: "student" }
    });
    await UserRole.create({ userId: user.id, roleId: studentRole.id });

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OtpToken.create({ userId: user.id, code, purpose: "register", expiresAt });
    await sendOtpMail(user.email, code, "register");

    res.status(201).json({
      success: true,
      data: { userId: user.id },
      error: null
    });
  } catch (err) {
    next(err);
  }
};

export const registerStep2 = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    const token = await OtpToken.findOne({
      where: { userId, code: otp, purpose: "register", used: false }
    });

    if (!token || token.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_OTP", message: "OTP is invalid or expired" }
      });
    }

    token.used = true;
    await token.save();

    res.json({ success: true, data: { verified: true }, error: null });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Email and password required" }
      });
    }

    const user = await User.findOne({ where: { email }, include: Role });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" } });
    }

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) {
      return res
        .status(401)
        .json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid credentials" } });
    }

    const roles = user.Roles ? user.Roles.map(r => r.name) : [];

    const token = signToken({ userId: user.id, roles });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          roles
        }
      },
      error: null
    });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Email is required" }
      });
    }

    const user = await User.findOne({ where: { email } });
    if (user) {
      const code = generateOtp();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await OtpToken.create({ userId: user.id, code, purpose: "password_reset", expiresAt });
      await sendOtpMail(user.email, code, "password_reset");
    }

    res.json({ success: true, data: { sent: true }, error: null });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Missing required fields" }
      });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: "USER_NOT_FOUND", message: "User not found" }
      });
    }

    const token = await OtpToken.findOne({
      where: { userId: user.id, code: otp, purpose: "password_reset", used: false }
    });

    if (!token || token.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        error: { code: "INVALID_OTP", message: "OTP is invalid or expired" }
      });
    }

    token.used = true;
    await token.save();

    user.passwordHash = await hashPassword(newPassword);
    await user.save();

    res.json({ success: true, data: { reset: true }, error: null });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    res.json({ success: true, data: { user: req.user }, error: null });
  } catch (err) {
    next(err);
  }
};
