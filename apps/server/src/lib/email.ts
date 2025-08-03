import nodemailer from "nodemailer";

function VerificationEmail({
  username,
  purpose,
  url,
}: {
  username: string;
  purpose: string;
  url: string;
}) {
  return `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Hello ${username},</h2>
            <p>
                You requested to ${purpose}. Please click the link below to proceed:
            </p>
            <p>
                <a href="${url}" style="color: #1a73e8;">Verify your account</a>
            </p>
            <p>
                If you did not request this, please ignore this email.
            </p>
            <br/>
            <p>Best regards,<br/>PDF-RAG Team</p>
        </div>
    `;
}

export interface VerificationParameters {
  email: string;
  username: string;
  purpose: string;
  url: string;
}
export async function SendVerificationCode({
  username,
  email,
  purpose,
  url,
}: VerificationParameters) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USERNAME, // sender address
    to: email, // list of receivers
    subject: "Verification Code", // Subject line
    html: VerificationEmail({ username, purpose, url }),
  });
}
