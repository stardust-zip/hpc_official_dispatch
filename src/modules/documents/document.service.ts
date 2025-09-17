import { z } from "zod";
import {
  documentRepository,
  CreateDocumentData,
  UpdateDocumentData,
} from "./document.repository";
import { ActionSchema } from "./document.schema";

type ActionPayload = z.infer<typeof ActionSchema.shape.body>;

export const documentService = {
  async createNewDocument(data: CreateDocumentData) {
    console.log(`Creating document for author: ${data.authorId}`);
    return documentRepository.create(data);
  },

  async getDocumentDetails(id: string) {
    const document = await documentRepository.findById(id);
    if (!document) throw new Error("Document not found");
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
    if (!existingDocument) throw new Error("Document not found");
    if (existingDocument.authorId !== userId) throw new Error("Forbidden");
    return documentRepository.update(documentId, data);
  },

  async deleteDocument(documentId: string) {
    const existingDocument = await documentRepository.findById(documentId);
    if (!existingDocument) throw new Error("Document not found");
    await documentRepository.remove(documentId);
  },

  async performWorkflowAction(
    documentId: string,
    actorId: string,
    payload: ActionPayload,
  ) {
    const document = await documentRepository.findById(documentId);
    if (!document) throw new Error("Document not found");

    const { action } = payload;

    switch (action) {
      case "SUBMIT_FOR_APPROVAL":
        if (document.status !== "DRAFT")
          throw new Error(
            "Invalid state transition: Can only submit a DRAFT document.",
          );
        if (document.authorId !== actorId)
          throw new Error(
            "Forbidden: Only the author can submit for approval.",
          );
        const [updatedDoc] = await documentRepository.updateStatusAndLog(
          documentId,
          {
            status: "PENDING_APPROVAL",
            assigneeId: payload.assigneeId,
            actorId,
            action,
            comment: payload.comment,
          },
        );
        return updatedDoc;

      case "APPROVE":
        if (document.status !== "PENDING_APPROVAL")
          throw new Error(
            "Invalid state transition: Can only approve a PENDING_APPROVAL document.",
          );
        if (document.assigneeId !== actorId)
          throw new Error("Forbidden: You are not the assigned approver.");
        const [approvedDoc] = await documentRepository.updateStatusAndLog(
          documentId,
          {
            status: "APPROVED",
            assigneeId: null,
            actorId,
            action,
            comment: payload.comment,
          },
        );
        return approvedDoc;

      case "REJECT":
        if (document.status !== "PENDING_APPROVAL")
          throw new Error(
            "Invalid state transition: Can only reject a PENDING_APPROVAL document.",
          );
        if (document.assigneeId !== actorId)
          throw new Error("Forbidden: You are not the assigned approver.");
        const [rejectedDoc] = await documentRepository.updateStatusAndLog(
          documentId,
          {
            status: "REJECTED",
            assigneeId: null,
            actorId,
            action,
            comment: payload.comment,
          },
        );
        return rejectedDoc;

      case "ISSUE":
        if (document.status !== "APPROVED")
          throw new Error(
            "Invalid state transition: Can only issue an APPROVED document.",
          );
        if (document.authorId !== actorId)
          throw new Error("Forbidden: Only the author can issue the document.");
        const [issuedDoc] = await documentRepository.updateStatusAndLog(
          documentId,
          {
            status: "ISSUED",
            assigneeId: document.assigneeId,
            actorId,
            action,
            comment: payload.comment,
          },
        );
        return issuedDoc;

      default:
        throw new Error("Bad Request: Unknown action.");
    }
  },
};
