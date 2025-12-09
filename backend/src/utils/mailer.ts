// src/utils/mailer.ts
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpMail = async (to: string, otp: string) => {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #10b981;">Grocer OTP Verification</h2>
      <p>Hello,</p>
      <p>Your one-time password is:</p>
      
      <div style="
        background: #10b981; 
        color: white; 
        padding: 10px 20px; 
        font-size: 28px; 
        font-weight: bold; 
        display: inline-block;
        border-radius: 10px;
        letter-spacing: 5px;
      ">
        ${otp}
      </div>

      <p>This OTP will expire in 5 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>

      <br/>
      <p style="color: gray; font-size: 12px;">
        — Grocer App Team
      </p>
    </div>
  `;

  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Your Grocer Login OTP",
    html,
  });
};
