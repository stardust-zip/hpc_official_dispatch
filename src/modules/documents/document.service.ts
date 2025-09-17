import {
  documentRepository,
  CreateDocumentData,
  UpdateDocumentData,
} from "./document.repository";

// core business logic
// It calls to the repo and performs logic before
// returning data to controller

interface ActionPayload {
  action: string;
  comment?: string;
  assigneeId?: string;
}

// Encapsulates the business logic for managing documents.
export const documentService = {
  async createNewDocument(data: CreateDocumentData) {
    // Business rule: Check if a document with the same serial number already exists.
    // (This is also enforced by the DB, but it's good practice to check here).
    // More complex rules like checking user permissions would go here.

    console.log(`Creating document for author: ${data.authorId}`);
    return documentRepository.create(data);
  },

  async getDocumentDetails(id: string) {
    const document = await documentRepository.findById(id);
    if (!document) {
      throw new Error("Document not found");
    }
    return document;
  },

  async listAllDocuments() {
    return documentRepository.findAll();
  },

  async updateDocument(
    documentId: string,
    userId: string,
    data: UpdateDocumentData,
  ) {
    const existingDocument = await documentRepository.findById(documentId);
    if (!existingDocument) {
      throw new Error("Document not found");
    }

    // checking if user own the document
    if (existingDocument.authorId != userId) {
      throw new Error("Forbidden");
    }

    return documentRepository.update(documentId, data);
  },

  async deleteDocument(documentId: string) {
    const existingDocument = await documentRepository.findById(documentId);
    if (!existingDocument) {
      throw new Error("Document not found");
    }

    await documentRepository.remove(documentId);
  },

  async performWorkflowAction(
    documentId: string,
    actorId: string,
    payload: ActionPayload,
  ) {
    const document = await documentRepository.findById(documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    const { action, comment, assigneeId } = payload;

    switch (action) {
      case "SUBMIT_FOR_APPROVAL":
        if (document.status !== "DRAFT") {
          throw new Error(
            "Invalid state transition: Can only submit a DRAFT document.",
          );
        }
        if (document.authorId !== actorId) {
          throw new Error(
            "Forbidden: Only the author can submit for approval.",
          );
        }
        const [updatedDoc] = await documentRepository.updateStatusAndLog(
          documentId,
          {
            status: "PENDING_APPROVAL",
            assigneeId: assigneeId,
            actorId,
            action,
            comment,
          },
        );
        return updatedDoc;

      case "APPROVE":
        if (document.status !== "PENDING_APPROVAL") {
          throw new Error(
            "Invalid state transition: Can only approve a PENDING_APPROVAL document.",
          );
        }
        if (document.assigneeId !== actorId) {
          throw new Error("Forbidden: You are not the assigned approver.");
        }
        const [approvedDoc] = await documentRepository.updateStatusAndLog(
          documentId,
          {
            status: "APPROVED",
            assigneeId: null, // Clear the assignee
            actorId,
            action,
            comment,
          },
        );
        return approvedDoc;

      default:
        throw new Error("Bad Request: Unknown action");
    }
  },
};
