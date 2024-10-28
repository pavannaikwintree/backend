import nodemailer from "nodemailer";
import ApplicationError from "./applicationErrors.js";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.SECURE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (email, token) => {
  try {
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password link",
      html: `<p>Please use below link to reset your password <br></br> ${token} <br></br>This link is only valid for 10 minutes.</p>`,
    });
    if (!result) {
      throw new ApplicationError("Error while sending email", error.code);
    }
    return result;
  } catch (error) {
    throw new ApplicationError(error.message, error.code || 500);
  } finally {
    transporter.close();
  }
};

export default sendEmail;
