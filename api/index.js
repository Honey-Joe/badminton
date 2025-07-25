const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const { initCompletedBookingsJob } = require("./services/cronJobs");
dotenv.config();
const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:5174", 
  "http://localhost:5173",
  "https://badminton-project-client.vercel.app",
  "https://badminton-project-admin.vercel.app",
  "https://badminton-project-api.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed origins or is a subdomain of allowed origins
    if (
      allowedOrigins.includes(origin) || 
      allowedOrigins.some(domain => origin.endsWith(domain.replace('https://', '').replace('http://', '')))
    ) {
      callback(null, true);
    } else {
      console.error(`CORS blocked for origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization", 
    "X-Requested-With",
    "Accept"
  ],
  optionsSuccessStatus: 200,
  maxAge: 86400,
  preflightContinue: false
};


app.use(cors(corsOptions));

initCompletedBookingsJob();
app.use(cookieParser());
app.use(express.json());
connectDB();

app.get("/", async (req, res) => {
  res.send("Hello test api");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/admin",adminRoutes)
app.use("/api/v1/stats", require("./routes/statsRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server Running on " + PORT);
});
