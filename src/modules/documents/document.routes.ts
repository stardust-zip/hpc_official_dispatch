import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { z } from "zod";
import { documentController } from "./document.controller";
import { authenticate } from "../../core/middleware/auth.middleware";
import { authorize } from "../../core/middleware/authorization.middleware";
import {
  createDocumentValidator,
  updateDocumentValidator,
} from "./document.validator";
import { handleValidationErrors } from "../../core/middleware/validation.middleware";
import {
  CreateDocumentSchema,
  DocumentSchema,
  UpdateDocumentSchema,
} from "./document.schema";

export const createDocumentRouter = (registry: OpenAPIRegistry): Router => {
  const router = Router();
  const commonResponses = {
    401: { description: "Unauthorized" },
    403: { description: "Forbidden" },
    404: { description: "Resource not found" },
  };

  // POST /documents
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
          "application/json": { schema: DocumentSchema },
        },
      },
      400: { description: "Bad Request" },
      ...commonResponses,
    },
  });

  router.post(
    "/",
    authenticate,
    authorize(["admin", "teacher"]),
    createDocumentValidator,
    handleValidationErrors,
    documentController.createDocument,
  );

  // GET /documents/{id}
  registry.registerPath({
    method: "get",
    path: "/documents/{id}",
    summary: "Get a single document by ID",
    tags: ["Documents"],
    request: {
      params: z.object({ id: z.string().cuid() }),
    },
    responses: {
      200: {
        description: "Document details",
        content: {
          "application/json": { schema: DocumentSchema },
        },
      },
      ...commonResponses,
    },
  });

  router.get(
    "/:id",
    authenticate,
    authorize(["admin", "teacher"]),
    documentController.getDocumentById,
  );

  // PUT /documents/{id}
  registry.registerPath({
    method: "put",
    path: "/documents/{id}",
    summary: "Update an existing document",
    tags: ["Documents"],
    request: {
      params: z.object({ id: z.string().cuid() }),
      body: {
        content: {
          "application/json": { schema: UpdateDocumentSchema.shape.body },
        },
      },
    },
    responses: {
      200: {
        description: "Document updated successfully",
        content: {
          "application/json": { schema: DocumentSchema },
        },
      },
      400: { description: "Bad Request" },
      ...commonResponses,
    },
  });

  router.put(
    "/:id",
    authenticate,
    authorize(["admin", "teacher"]),
    updateDocumentValidator,
    handleValidationErrors,
    documentController.updateDocument,
  );

  // DELETE /documents/{id}
  registry.registerPath({
    method: "delete",
    path: "/documents/{id}",
    summary: "Delete a document (Admins only)",
    tags: ["Documents"],
    request: {
      params: z.object({ id: z.string().cuid() }),
    },
    responses: {
      204: { description: "Document deleted successfully" },
      ...commonResponses,
    },
  });

  router.delete(
    "/:id",
    authenticate,
    authorize(["admin"]),
    documentController.deleteDocument,
  );

  return router;
};
