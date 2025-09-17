import { Router } from "express";
import { documentController } from "./document.controller";
import { authenticate } from "../../core/middleware/auth.middleware";
import { createDocumentValidator } from "./document.validator";
import { handleValidationErrors } from "../../core/middleware/validation.middleware";

// This file defines API endpoitns for documents
// It connects the routes to authentication middleware and controller function

const router = Router();

// All document routes require authentication
router.use(authenticate);

// Define routes
router.post(
  "/",
  createDocumentValidator, // 1. Validate input
  handleValidationErrors, // 2. Handle any validation errors
  documentController.createDocument, // 3. Pass to controller
);
router.get("/", documentController.getAllDocuments);
router.get("/:id", documentController.getDocumentById);

export default router;
