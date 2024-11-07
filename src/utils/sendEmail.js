import nodemailer from "nodemailer";
import ApplicationError from "./applicationErrors.js";
import { keys } from "../config/keys.js";

const transporter = nodemailer.createTransport({
  host: keys.nodeMailer.emailHost,
  port: keys.nodeMailer.emailPort,
  secure: keys.nodeMailer.secure,
  auth: {
    user: keys.nodeMailer.emailUser,
    pass: keys.nodeMailer.emailPassword,
  },
});

const sendEmail = async (email, token) => {
  try {
    const result = await transporter.sendMail({
      from: keys.nodeMailer.emailUser,
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
