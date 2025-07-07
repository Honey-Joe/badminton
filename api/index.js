const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes")
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();

app.use(cookieParser())
app.use(express.json())
connectDB();

app.get("/", async (req, res) => {
  res.send("Hello test api");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server Running on " + PORT);
});
