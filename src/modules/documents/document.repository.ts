import { PrismaClient } from "@prisma/client";

// The repository abstracts all database interactions using Prisma.
// It's the only place that should directly touch the database client.
// This follows the Dependency Inversion Principle,
// as services will depend on this abstraction, not Prisma itself.

export const prisma = new PrismaClient();

// Simple DTOs (Data Transfer Objects) for type safety
export interface CreateDocumentData {
  serialNumber: string;
  title: string;
  contentSummary: string;
  type: "INCOMING" | "OUTGOING";
  authorId: string;
}

export interface UpdateDocumentData {
  serialNumber: string;
  title: string;
  contentSummary: string;
  type: "INCOMING" | "OUTGOING";
}

interface WorkflowUpdateParams {
  status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "REJECTED" | "ISSUED";
  assigneeId?: string | null;
  actorId: string;
  action: string;
  comment?: string;
}

// Manages all database operations for the Document model.
export const documentRepository = {
  async create(data: CreateDocumentData) {
    return prisma.document.create({
      data: {
        ...data,
        workflowHistory: {
          create: {
            actorId: data.authorId,
            action: "CREATE",
            comments: "Document created.",
          },
        },
      },
    });
  },

  async findById(id: string) {
    return prisma.document.findUnique({
      where: { id },
      include: { workflowHistory: true }, // Include related workflow steps
    });
  },

  async findAll() {
    return prisma.document.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async update(id: string, data: UpdateDocumentData) {
    return prisma.document.update({
      where: { id },
      data,
    });
  },

  async remove(id: string) {
    return prisma.document.delete({
      where: { id },
    });
  },

  async updateStatusAndLog(documentId: string, params: WorkflowUpdateParams) {
    return prisma.$transaction([
      // Create a document
      prisma.document.update({
        where: { id: documentId },
        data: {
          status: params.status,
          assigneeId: params.assigneeId,
        },
      }),
      // Create a log entry for this action
      prisma.workflowStep.create({
        data: {
          documentId: documentId,
          actorId: params.actorId,
          action: params.action,
          comments: params.comment,
        },
      }),
    ]);
  },
};
