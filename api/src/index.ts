import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json";
import { connectDB } from "./service/db";
import { initAdminUser } from "./service/user";
import morgan from "morgan";
import logger from "./logger";
import dayjs from "dayjs";
import cors from "cors";

import authRoutes from "./route/auth";
import queryRoutes from "./route/query";

const app = express();
const port = process.env.PORT || 6435;

app.use(express.json());
app.use(cors());

const morganFormat = (tokens, req, res) => {
  const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
  return `[${timestamp}] info: ${tokens.method(req, res)} ${tokens.url(
    req,
    res
  )} ${tokens.status(req, res)} ${
    tokens.res(req, res, "content-length") || 0
  }b - ${tokens["response-time"](req, res)} ms`;
};

app.use(morgan(morganFormat));

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/auth", authRoutes);
app.use("/query", queryRoutes);

// Centralized error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, _next) => {
  logger.error("[Unhandled] %o", err);
  res.status(500).json({ message: "Internal server error" });
});

connectDB()
  .then(initAdminUser)
  .then(() => {
    app.listen(port, () => {
      const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");
      console.log(
        `[${timestamp}] info: API server listening at http://localhost:${port}`
      );
    });
  });
