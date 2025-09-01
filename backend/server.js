const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator'); 
const rateLimit = require('express-rate-limit'); 
const fs = require("fs");
const nodemailer = require("nodemailer"); 
require("dotenv").config();

const app = express();

// ✅ Use deployment port OR fallback to local 5000
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// ⭐ CORS (update this with your frontend domain later)
app.use(cors({
  origin: [
    "http://localhost:3000",             // local frontend (React, etc.)
    "https://your-frontend-domain.com"   // replace with Netlify/Vercel domain
  ],
  methods: ["GET", "POST"],
}));

// ⭐ Rate Limiter (max 5 requests/min per IP)
const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 5,
  message: { error: "Too many requests. Please try again later." }
});
app.use(limiter);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('✅ Backend is working online!');
});

// ✅ Contact form route
app.post(
  '/contact',
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("message").trim().isLength({ min: 10 }).withMessage("Message must be at least 10 characters long"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, message } = req.body;

    try {
      // ⭐ Save message locally (for testing)
      const newMessage = { name, email, message, date: new Date() };
      let messages = [];
      if (fs.existsSync("messages.json")) {
        messages = JSON.parse(fs.readFileSync("messages.json"));
      }
      messages.push(newMessage);
      fs.writeFileSync("messages.json", JSON.stringify(messages, null, 2));

      // ⭐ Send email using nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail", 
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`, // safer sender
        replyTo: email,  // so you can reply directly to visitor
        to: process.env.EMAIL_USER,
        subject: `📩 New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
      });

      console.log("📧 Email sent successfully!");
      res.json({ success: true, msg: "Message received & email sent! ✅" });

    } catch (err) {
      console.error("❌ Error:", err.message);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT} (or online when deployed)`);
});
