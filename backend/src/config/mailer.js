import nodemailer from "nodemailer";
import { env } from "./env.js";

export const mailer = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: env.smtp.user
    ? {
        user: env.smtp.user,
        pass: env.smtp.password
      }
    : undefined
});

export async function sendOtpMail(to, code, purpose) {
  if (!env.smtp.host || !env.smtp.user) {
    return;
  }

  const subject =
    purpose === "password_reset" ? "Password Reset OTP" : "Account Verification OTP";

  await mailer.sendMail({
    from: env.smtp.user,
    to,
    subject,
    text: `Your OTP code is ${code}. It will expire in 10 minutes.`
  });
}
