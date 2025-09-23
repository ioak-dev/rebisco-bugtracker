require("dotenv").config({ path: `.env.api.${process.env.NODE_ENV || "dev"}` });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const { auth } = require("express-oauth2-jwt-bearer");
const nodemailer = require("nodemailer");

const app = express();

app.use((req, res, next) => {
  next();
});

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "authorization"],
    credentials: false,
    optionsSuccessStatus: 204,
  })
);

app.options(/.*/, cors());

app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

const checkJwt = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const defectRoutes = require("./routes/defect.routes");
app.use("/api/defects", defectRoutes);

app.get("/api/public", (req, res) => {
  res.send(
    "Hello from a public endpoint! You don't need to be authenticated to see this."
  );
});

app.get("/api/private", checkJwt, (req, res) => {
  res.send(
    "Hello from a private endpoint! You need to be authenticated to see this."
  );
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: "support@ioak.org",
    pass: "qNWHvTRpJFWs",
  },
});

app.post("/api/text-mail", (req, res) => {
  const { to, subject, text } = req.body;
  const mailData = {
    from: "support@ioak.org",
    to: to,
    subject: subject,
    html: text,
  };

  transporter.sendMail(mailData, (error, info) => {
    if (error) {
      return console.log(error);
    }
    res.status(200).send({ message: "Mail send", message_id: info.messageId });
  });
});
