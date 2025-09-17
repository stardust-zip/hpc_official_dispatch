import { Response } from "express";
import { AuthenticatedRequest } from "../../core/middleware/auth.middleware";
import { documentService } from "./document.service";
import { matchedData } from "express-validator";
import { UpdateDocumentData } from "./document.repository";

// The file hanld http request and response
// It calls the service to perform actual work
// then format the repsonse

// Handles incoming HTTP requests for the documents module.
export const documentController = {
  async createDocument(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = matchedData(req);
      const authorId = req.user!.id; // From our auth middleware

      const documentData = {
        ...validatedData,
        authorId,
      };

      const newDocument = await documentService.createNewDocument(
        documentData as any,
      );
      res.status(201).json(newDocument);
    } catch (error) {
      res.status(500).json({
        message: "Failed to create document.",
        error: (error as Error).message,
      });
    }
  },

  async getDocumentById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const document = await documentService.getDocumentDetails(id);
      res.status(200).json(document);
    } catch (error) {
      // If the service threw our "Not Found" error
      if ((error as Error).message === "Document not found") {
        return res.status(404).json({ message: (error as Error).message });
      }
      res.status(500).json({ message: "Failed to retrieve document." });
    }
  },

  async getAllDocuments(req: AuthenticatedRequest, res: Response) {
    try {
      const documents = await documentService.listAllDocuments();
      res.status(200).json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve documents." });
    }
  },

  async updateDocument(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;
      const validatedData = matchedData(req) as UpdateDocumentData;

      const updatedDocument = await documentService.updateDocument(
        id,
        userId,
        validatedData,
      );
      res.status(200).json(updatedDocument);
    } catch (error) {
      const err = error as Error;
      if (err.message === "Document not found") {
        return res.status(404).json({ message: err.message });
      }
      if (err.message === "Forbidden") {
        return res.status(403).json({
          message: "You do not have permission to edit this document.",
        });
      }
      res.status(500).json({ message: "Failed to update document." });
    }
  },

  async deleteDocument(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      await documentService.deleteDocument(id);

      res.status(204).send();
    } catch (error) {
      const err = error as Error;
      if (err.message === "Document not found") {
        return res.status(404).json({ message: err.message });
      }

      res.status(500).json({ message: "Failed to delete document" });
    }
  },

  async performAction(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const actorId = req.user!.id;
      const payload = req.body;

      const updatedDocument = await documentService.performWorkflowAction(
        id,
        actorId,
        payload,
      );
      res.status(200).json(updatedDocument);
    } catch (error) {
      const err = error as Error;
      if (err.message.startsWith("Forbidden"))
        return res.status(403).json({ message: err.message });
      if (
        err.message.startsWith("Invalid state") ||
        err.message.startsWith("Bad Request")
      ) {
        return res.status(400).json({ message: err.message });
      }
      if (err.message === "Document not found")
        return res.status(404).json({ message: err.message });

      res.status(500).json({ message: "Failed to perform action." });
    }
  },
};
