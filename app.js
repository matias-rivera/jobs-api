const express = require("express");
const app = express();

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const errorMiddleware = require("./middlewares/errors");
const ErrorHandler = require("./utils/errorHandler");

// Setting up config.env file variables
dotenv.config({ path: "./config/config.env" });

//Handling Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log(`Shutting down due to uncaught exception.`);
  process.exit(1);
});

//Connecting to database
connectDB();

// Setup bodypaser
app.use(express.json());

// Set cookie parser
app.use(cookieParser());

// Importing routes
const jobs = require("./routes/jobs");
const auth = require("./routes/auth");

app.use("/api/v1", jobs);
app.use("/api/v1", auth);

// Handle unhandled routes
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

//Middleware to handle errors
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} in ${process.env.NODE_ENV} mode`);
});

// Handling unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled promise rejection.`);
  server.close(() => {
    process.exit(1);
  });
});
