import { documentRepository, CreateDocumentData } from "./document.repository";

// core business logic
// It calls to the repo and performs logic before
// returning data to controller

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
};
