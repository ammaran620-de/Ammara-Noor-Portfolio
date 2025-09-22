const express = require('express');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://portfolio-fullstack-virid.vercel.app" // Your Vercel frontend URL
  ],
  methods: ["GET", "POST"],
}));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: "Too many requests. Please try again later." }
});
app.use(limiter);

// Test route
app.get('/', (req, res) => {
  res.send('✅ Backend is working online!');
});

// Contact form route
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
      // Send email using nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
        replyTo: email,
        to: process.env.EMAIL_USER,
        subject: `📩 New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<h3>New Contact Form Submission</h3>
               <ul>
                 <li><strong>Name:</strong> ${name}</li>
                 <li><strong>Email:</strong> ${email}</li>
               </ul>
               <p><strong>Message:</strong></p>
               <p>${message}</p>`,
      });

      console.log("📧 Email sent successfully!");
      res.json({ success: true, message: "Message received & email sent! ✅" });

    } catch (err) {
      console.error("❌ Error:", err.message);
      res.status(500).json({ error: "Server error. Please try again later." });
    }
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT} (or online when deployed)`);
});