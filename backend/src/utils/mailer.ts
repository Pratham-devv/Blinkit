import dotenv from "dotenv";
import Mailjet from "node-mailjet";

dotenv.config();

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY!,
  process.env.MAILJET_API_SECRET!
);

export const sendOtpMail = async (to: string, otp: string) => {
  return mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: process.env.EMAIL_FROM!,
          Name: "Grocer",
        },
        To: [
          {
            Email: to,
          },
        ],
        Subject: "Your Grocer OTP",
        HTMLPart: `
          <div style="font-family: Arial; padding: 16px">
            <h2>Grocer Verification Code</h2>
            <p>Your OTP is:</p>
            <div style="
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 6px;
              margin: 16px 0;
            ">
              ${otp}
            </div>
            <p>This code expires in 5 minutes.</p>
          </div>
        `,
      },
    ],
  });
};