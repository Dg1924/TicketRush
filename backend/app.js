const path = require('path');
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const compression = require("compression");
const globalErrorHandler = require("./controller/errorController");
const AppError = require("./utils/appError");

const AdminRouter = require("./routes/adminRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 2. SECURITY & CORS
app.use(helmet({
  crossOriginResourcePolicy: false, // Quan trọng: Cho phép trình duyệt load ảnh từ server khác
}));

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. LOGGING
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 4. RATE LIMITING
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again late!",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// 5. BODY PARSER (Chỉ dùng 1 lần duy nhất)
app.use(express.json({ limit: "10mb" })); // Tăng limit lên để nhận được FormData/Ảnh
app.use(cookieParser());

// 6. TRIM MIDDLEWARE
app.use((req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach((key) => {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
});

// 7. ROUTES
app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is working fine",
  });
});

// 8. 404 HANDLER (Phải để sau cùng của các Route)
app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// 9. GLOBAL ERROR HANDLING
app.use(globalErrorHandler);

module.exports = app;