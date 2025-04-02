"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const nodemailer_1 = __importDefault(require("nodemailer"));
const zod_1 = require("zod");
// 创建服务器实例
const email_server = new mcp_js_1.McpServer({
    name: "email",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});
// 创建邮件传输器
const transporter = nodemailer_1.default.createTransport({
    host: (_a = process.env.EMAIL_HOST) !== null && _a !== void 0 ? _a : "smtp.gmail.com", // 替换为你的 SMTP 服务器
    port: (_b = process.env.EMAIL_PORT) !== null && _b !== void 0 ? _b : 587,
    secure: true,
    auth: {
        user: process.env.EMAIL_ACCOUNT, // 替换为你的邮箱
        pass: process.env.EMAIL_PASSWORD, // 替换为你的密码或应用专用密码
    },
});
// 发送邮件的辅助函数
function sendEmail(options) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield transporter.sendMail({
                from: process.env.EMAIL_ACCOUNT, // 替换为你的邮箱
                to: options.to,
                subject: options.subject,
                text: options.text,
            });
            return true;
        }
        catch (error) {
            console.error("Error sending email:", error);
            return false;
        }
    });
}
// 注册发送邮件工具
email_server.tool("send-email", "发送邮件", {
    to: zod_1.z.string().describe("邮件收件人"),
    subject: zod_1.z.string().describe("邮件主题"),
    text: zod_1.z.string().describe("邮件内容"),
}, (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, text }) {
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
    const success = yield sendEmail({ to, subject, text });
    return {
        content: [
            {
                type: "text",
                text: success ? "邮件发送成功" : "邮件发送失败",
            },
        ],
    };
}));
exports.default = email_server;
