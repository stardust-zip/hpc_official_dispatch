import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config";
import documentRoutes from "./modules/documents/document.routes";

const app: Application = express();
const PORT = config.port;

function setupMiddleware() {
  app.use(cors()); // Enable Cross-Origin Resource Sharing
  app.use(helmet()); // Set various security HTTP headers
  app.use(express.json()); // Parse JSON request bodies
  app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
}

function registerRoutes() {
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "UP", service: "hpc_official_dispatch" });
  });

  app.use("/api/v1/documents", documentRoutes);
}

setupMiddleware();
registerRoutes();

function startServer() {
  app.listen(PORT, () => {
    console.log(`hpc_official_dispatch service is running on port ${PORT}`);
  });
}

if (process.env.NODE_ENV !== "test") {
  startServer();
}

export { app };
