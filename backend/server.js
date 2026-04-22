require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database connection & sync
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL Connected successfully.");
    // Sync models
    await sequelize.sync({ alter: true }); // Automatically updates the table schema
    console.log("MySQL Database & tables synced.");
  } catch (error) {
    console.log(`Unable to connect to MySQL: ${error.message}`);
  }
};

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5001;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
