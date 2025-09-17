import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { documentController } from "./document.controller";
import { authenticate } from "../../core/middleware/auth.middleware";
import { authorize } from "../../core/middleware/authorization.middleware";
import { createDocumentValidator } from "./document.validator";
import { handleValidationErrors } from "../../core/middleware/validation.middleware";
import { updateDocumentValidator } from "./document.validator";
import { CreateDocumentSchema, DocumentSchema } from "./document.schema";

// This file defines API endpoitns for documents
// It connects the routes to authentication middleware and controller function

const router = Router();

// All document routes require authentication
// router.use(authenticate);

export const createDocumentRouter = (registry: OpenAPIRegistry): Router => {
  const router = Router();

  // Register the OpenAPI path
  registry.registerPath({
    method: "post",
    path: "/documents",
    summary: "Create a new document",
    tags: ["Documents"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: CreateDocumentSchema.shape.body,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Document created successfully",
        content: {
          "application/json": {
            schema: DocumentSchema,
          },
        },
      },
      // Add other responses for better documentation
      400: { description: "Bad Request" },
      401: { description: "Unauthorized" },
      403: { description: "Forbidden" },
    },
  });

  // Define routes
  router.post(
    "/",
    authenticate,
    authorize(["admin", "teacher"]),
    createDocumentValidator, // 1. Validate input
    handleValidationErrors, // 2. Handle any validation errors
    documentController.createDocument, // 3. Pass to controller
  );

  router.get(
    "/",
    authenticate,
    authorize(["admin", "teacher"]),
    documentController.getAllDocuments,
  );

  router.get(
    "/:id",
    authenticate,
    authorize(["admin", "teacher"]),
    documentController.getDocumentById,
  );

  router.put(
    "/:id",
    authenticate,
    authorize(["admin", "teacher"]),
    updateDocumentValidator,
    handleValidationErrors,
    documentController.updateDocument,
  );

  router.delete(
    "/:id",
    authenticate,
    authorize(["admin"]),
    documentController.deleteDocument,
  );

  return router;
};
