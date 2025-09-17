import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const DocumentSchema = z.object({
  id: z.string().openapi({ example: "clx3x8y7z0000a4b0d1e2f3g4" }),
  serialNumber: z.string().openapi({ example: "2025/CV-HPC" }),
  title: z.string().openapi({ example: "Official Letter of Introduction" }),
  contentSummary: z.string().openapi({ example: "Summary of the letter..." }),
  type: z.enum(["INCOMING", "OUTGOING"]),
  securityLevel: z.enum(["PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET"]),
  authorId: z.string().openapi({ example: "user-cuid-12345" }),
  assigneeId: z.string().nullable().openapi({ example: "user-cuid-67890" }),
  createdAt: z.iso.datetime().openapi({ example: "2025-09-17T13:30:00Z" }),
  updatedAt: z.iso.datetime().openapi({ example: "2025-09-17T14:00:00Z" }),
});

export const CreateDocumentSchema = z.object({
  body: z.object({
    serialNumber: z.string().openapi({ example: "2025/CV-HPC/NEW" }),
    title: z.string().openapi({ example: "New Official Dispatch" }),
    contentSummary: z
      .string()
      .openapi({ example: "Details about the new dispatch." }),
    type: z.enum(["INCOMING", "OUTGOING"]),
  }),
});

// Schema for the data required to UPDATE a document
export const UpdateDocumentSchema = CreateDocumentSchema;
