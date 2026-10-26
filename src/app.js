import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import errorHandler from "./middlewares/error-middleware.js";
import sanitizeMiddleware from "./middlewares/sanitize-middleware.js";
import ApiError from "./utils/api-error.js";
import mountRoutes from "./routes/mount-routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.set("query parser", "extended");

app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "tiny"));

app.use(express.json());
app.use(cookieParser());
app.use(sanitizeMiddleware);

app.use(
  "/uploads",
  helmet.crossOriginResourcePolicy({ policy: "cross-origin" }),
  express.static(path.join(__dirname, "..", "uploads")),
);

mountRoutes(app);

app.use((req, res, next) =>
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 404)),
);

app.use(errorHandler);

export default app;
