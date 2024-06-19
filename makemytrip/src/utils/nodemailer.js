import nodemailer, { Transporter } from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.example.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false, // Adjust based on your SMTP server configuration
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export default transporter;
