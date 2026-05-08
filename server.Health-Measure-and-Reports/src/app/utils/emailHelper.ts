import * as fs from "fs";
import nodemailer from "nodemailer";
import * as path from "path";
import config from "../config";
const Util = require("util");
const ReadFile = Util.promisify(fs.readFile);
const Handlebars = require("handlebars");

interface Attachment {
  filename: string;
  content: Buffer;
  encoding: string;
}

const sendEmail = async (
  to: string,
  html: string,
  subject: string,
  attachment?: Attachment
) => {
  try {
    // Log configuration (without password)
    console.log("📧 Email Configuration:");
    console.log("  Host:", config.mail_host);
    console.log("  Port:", config.mail_port);
    console.log("  Username:", config.mail_username);
    console.log("  From:", config.mail_from_address);
    console.log("  To:", to);

    // Determine secure based on env port
    const secure = Number(config.mail_port) === 465;

    // Validate configuration
    if (!config.mail_host || !config.mail_username || !config.mail_password) {
      throw new Error("Email configuration is incomplete. Please check your .env file for MAIL_HOST, MAIL_USERNAME, and MAIL_PASSWORD");
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: config.mail_host,
      port: Number(config.mail_port),
      secure: secure, // true for 465, false for 587 STARTTLS
      auth: {
        user: config.mail_username,
        pass: config.mail_password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Mail options
    const mailOptions: any = {
      from: `"${config.mail_from_name}" <${config.mail_from_address}>`,
      to,
      subject,
      html,
    };

    if (attachment) {
      mailOptions.attachments = [attachment];
    }

    // Verify transporter configuration before sending
    await transporter.verify();

    // Send email
    const info = await transporter.sendMail(mailOptions);

    // Log email sending details for debugging
    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    console.log("From:", mailOptions.from);
    console.log("To:", mailOptions.to);
    console.log("Response:", info.response);

    return info;
  } catch (error: any) {
    console.error("❌ Error sending email:", error.message || error);
    console.error("Error code:", error.code);
    console.error("Error command:", error.command);
    console.error("Full error:", JSON.stringify(error, null, 2));
    
    // More specific error messages
    if (error.code === "EAUTH") {
      throw new Error("Email authentication failed. Please check your email credentials and App Password.");
    } else if (error.code === "ECONNECTION") {
      throw new Error("Could not connect to email server. Please check your SMTP settings.");
    }
    
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

const createEmailContent = async (data: object, templateType: string) => {
  try {
    const templatePath = path.join(
      process.cwd(),
      `/src/templates/${templateType}.template.hbs`
    );
    const content = await ReadFile(templatePath, "utf8");
    const template = Handlebars.compile(content);
    return template(data);
  } catch (error) {
    console.error("Error creating email content:", error);
    throw new Error("Failed to create email content");
  }
};

export const EmailHelper = {
  sendEmail,
  createEmailContent,
};

