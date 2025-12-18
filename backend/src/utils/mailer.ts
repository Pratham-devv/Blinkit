import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendOtpMail = async (to: string, otp: string) => {
  return resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject: "Your Grocer OTP",
    html: `
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
  });
};
