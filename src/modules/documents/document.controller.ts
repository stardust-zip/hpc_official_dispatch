import { Response } from "express";
import { AuthenticatedRequest } from "../../core/middleware/auth.middleware";
import { documentService } from "./document.service";
import { matchedData } from "express-validator";

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
};
