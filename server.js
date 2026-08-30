import path from "path";
import { fileURLToPath } from "url";

import "dotenv/config";
import morgan from "morgan";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import connectDB from "./config/mongodb.js";
import errorHandler from "./middlewares/error-middleware.js";
import ApiError from "./utils/api-error.js";
import mountRoutes from "./routes/mount-routes.js";
import sanitizeMiddleware from "./middlewares/sanitize-middleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app
const app = express();

// MiddleWare
app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.set("query parser", "extended");
app.use(sanitizeMiddleware);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const { NODE_ENV } = process.env;
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: '${NODE_ENV}'`);
} else {
  app.use(morgan("tiny"));
  console.log(`Mode: '${NODE_ENV}'`);
}

// Mount middleware
mountRoutes(app);

app.all(/.*/, (req, res, next) =>
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 404)),
);

app.use(errorHandler);

// DB connection and start server
const { PORT } = process.env;

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () =>
      console.log(`App running in PORT: ${PORT}`),
    );

    process.on("unhandledRejection", (err) => {
      console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
      server.close(() => {
        console.error("Shutting Down due to unhandled rejection...");
        process.exit(1);
      });
    });

    process.on("uncaughtException", (err) => {
      console.error(`Uncaught Exception: ${err.name} | ${err.message}`);
      server.close(() => {
        console.error("Shutting Down due to uncaught exception...");
        process.exit(1);
      });
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        console.log("Process terminated.");
        process.exit(0);
      });
    });
  } catch (err) {
    console.error(`Connection error: ${err.message}`);
    process.exit(1);
  }
};

startServer();
