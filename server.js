import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.post("/send-email", async (req, res) => {
    const { to, subject, text, html } = req.body;
    console.log("Incoming body: ", req.body);

    if (!to || !subject || (!text && !html)) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: `"HealthBuddy" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text,
            html,
        });

        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email", error: error.message });
    }
});

app.listen(process.env.PORT, () =>
    console.log(`✅ Email service running on port ${process.env.PORT}`)
);