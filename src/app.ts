import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";

import { config } from "./config";
import { createDocumentRouter } from "./modules/documents/document.routes";

export const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a single registry for the entire app
const registry = new OpenAPIRegistry();

// Register the security component
registry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
});

const documentRouter = createDocumentRouter(registry);
app.use("/api/v1/documents", documentRouter);

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", service: "hpc_official_dispatch" });
});

function startServer() {
  // Generate the OpenAPI documentation from the fully configured registry
  const generator = new OpenApiGeneratorV3(registry.definitions);
  const openApiDocumentation = generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "HPC Official Dispatch Service",
    },
    servers: [{ url: "/api/v1" }],
    security: [{ bearerAuth: [] }],
  });

  // Serve the documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
  console.log("API documentation available at /api-docs");

  // Start listening for requests
  app.listen(config.port, () => {
    console.log(
      `hpc_official_dispatch service is running on port${config.port}`,
    );
  });
}

// This check ensures the server only starts when you run `pnpm dev`
if (process.env.NODE_ENV !== "test") {
  startServer();
}
