const nodemailer = require("nodemailer");

async function createTransporter() {
  if (process.env.NODE_ENV === "production") {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("EMAIL_USER and EMAIL_PASS must be set in production");
    }

    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Development: Use Ethereal test account
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
}

async function sendMail(to, subject, html) {
  const transporter = await createTransporter();

  const info = await transporter.sendMail({
    from: `"AroundMe" <${process.env.EMAIL_USER || "no-reply@example.com"}>`,
    to,
    subject,
    html,
  });

  // Always log the preview URL in dev
  if (nodemailer.getTestMessageUrl(info)) {
    console.log("📨 Dev email preview URL:", nodemailer.getTestMessageUrl(info));
  }

  // Also log the verification link (always)
  console.log("📨 Verification email content:", html);

  return info;
}

module.exports = { sendMail };
