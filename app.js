const express = require("express");
const app = express();

const dotenv = require("dotenv");

const connectDB = require("./config/database");

// Setting up config.env file variables
dotenv.config({ path: "./config/config.env" });

//Connecting to database
connectDB();

// Setup bodypaser
app.use(express.json());

// Importing routes
const jobs = require("./routes/jobs");

app.use("/api/v1", jobs);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
