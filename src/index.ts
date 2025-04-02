import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import nodemailer from "nodemailer";
import { z } from "zod";

// 创建服务器实例
const email_server = new McpServer({
  name: "email",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
}

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST ?? "smtp.gmail.com", // 替换为你的 SMTP 服务器
  port: process.env.EMAIL_PORT ?? 587,
  secure: true,
  auth: {
    user: process.env.EMAIL_ACCOUNT, // 替换为你的邮箱
    pass: process.env.EMAIL_PASSWORD, // 替换为你的密码或应用专用密码
  },
});

// 发送邮件的辅助函数
async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_ACCOUNT, // 替换为你的邮箱
      to: options.to,
      subject: options.subject,
      text: options.text,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

// 注册发送邮件工具
email_server.tool(
  "send-email",
  "发送邮件",
  {
    to: z.string().describe("邮件收件人"),
    subject: z.string().describe("邮件主题"),
    text: z.string().describe("邮件内容"),
  },
  async ({ to, subject, text }) => {
    if (!to || !subject || !text) {
      return {
        content: [
          {
            type: "text",
            text: "邮件参数不完整，请提供收件人、主题和内容",
          },
        ],
      };
    }

    const success = await sendEmail({ to, subject, text });

    return {
      content: [
        {
          type: "text",
          text: success ? "邮件发送成功" : "邮件发送失败",
        },
      ],
    };
  }
);

export default email_server;
