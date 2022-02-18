const express = require("express");
const app = express();

const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const bodyParser = require("body-parser");

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

// Set up body parser
app.use(bodyParser.urlencoded({ extended: true }));

// Setup security headers
app.use(helmet());

// Setup bodypaser
app.use(express.json());

// Set cookie parser
app.use(cookieParser());

// Handle file uploads
app.use(fileUpload());

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xssClean());

// Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: ["positions"],
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Setup CORS
app.use(cors());

// Importing routes
const jobs = require("./routes/jobs");
const auth = require("./routes/auth");
const users = require("./routes/users");

app.use("/api/v1", jobs);
app.use("/api/v1", auth);
app.use("/api/v1", users);

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
