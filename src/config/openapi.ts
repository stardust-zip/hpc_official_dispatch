import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { documentRoutes } from "../modules/documents/document.routes";

export function generateOpenApiDocumentation() {
  const registry = new OpenAPIRegistry();

  // We need to tell our registry about our routes
  // This function will now do more than just return a router
  documentRoutes(registry);

  const generator = new OpenApiGeneratorV3(registry.definitions);

  return generator.generateDocument({
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "HPC Official Dispatch Service",
      description:
        "API for managing official college documents and dispatches.",
    },
    servers: [{ url: "/api/v1" }],
    // Add security scheme for JWT
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  });
}
