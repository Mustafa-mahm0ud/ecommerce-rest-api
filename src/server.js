import "dotenv/config";
import mongoose from "mongoose";

import app from "./app.js";
import connectDB from "./config/mongodb.js";

const REQUIRED_ENV = [
  "DB_URI",
  "JWT_SECRET_KEY",
  "JWT_EXPIRE_TIME",
  "JWT_REFRESH_SECRET_KEY",
  "JWT_REFRESH_EXPIRE_TIME",
];

// The server does not start when any required environment key is missing
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`Missing required env variables: ${missingEnv.join(", ")}`);
  process.exit(1);
}

const { NODE_ENV } = process.env;
const PORT = process.env.PORT || 8000;
const SHUTDOWN_TIMEOUT_MS = 10_000;

let server;
let isShuttingDown = false;

// Close listening to server and Mongo connection
const shutdown = async (exitCode) => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  setTimeout(() => {
    console.error("Shutdown timed out, forcing exit");
    process.exit(exitCode);
  }, SHUTDOWN_TIMEOUT_MS).unref();

  try {
    if (server?.listening) {
      await new Promise((resolve) => {
        server.close(resolve);
      });
    }
    await mongoose.connection.close();
  } catch (err) {
    console.error(`Error during shutdown: ${err.message}`);
  } finally {
    process.exit(exitCode);
  }
};

// When a promise is rejected and not catch
process.on("unhandledRejection", (reason) => {
  console.error(
    "Unhandled Rejection:",
    reason instanceof Error ? reason.stack : reason,
  );
  shutdown(1);
});

// throw error and not catch
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.stack);
  shutdown(1);
});

// When closed the server like ctrl+c and docker close
["SIGTERM", "SIGINT"].forEach((signal) =>
  process.on(signal, () => {
    console.log(`${signal} received. Shutting down gracefully...`);
    shutdown(0);
  }),
);

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT);

    server.on("error", (err) => {
      console.error(`Failed to start server: ${err.message}`);
      shutdown(1);
    });

    server.on("listening", () => {
      console.log(`App running on port ${PORT} (mode: ${NODE_ENV})`);
    });
  } catch (err) {
    console.error(`Connection error: ${err.message}`);
    process.exit(1);
  }
};

startServer();
