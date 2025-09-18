import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

const RecipientInfoSchema = z
  .object({
    name: z.string(),
    address: z.string().optional(),
    department: z.string().optional(),
    email: z.email().optional(),
  })
  .openapi("RecipientInfo");

export const DocumentSchema = z.object({
  id: z.cuid().openapi({ example: "clx3x8y7z0000a4b0d1e2f3g4" }),
  serialNumber: z.string().openapi({ example: "2025/CV-HPC" }),
  title: z.string().openapi({ example: "Official Letter of Introduction" }),
  contentSummary: z.string().openapi({ example: "Summary of the letter..." }),
  type: z.enum(["INCOMING", "OUTGOING"]),
  securityLevel: z.enum(["PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET"]),
  authorId: z.cuid().openapi({ example: "user-cuid-12345" }),
  assigneeId: z.cuid().nullable().openapi({ example: "user-cuid-67890" }),
  status: z.enum([
    "DRAFT",
    "PENDING_APPROVAL",
    "APPROVED",
    "REJECTED",
    "ISSUED",
  ]),
  createdAt: z.iso.datetime().openapi({ example: "2025-09-17T13:30:00Z" }),
  updatedAt: z.iso.datetime().openapi({ example: "2025-09-17T14:00:00Z" }),
  recipientInfo: RecipientInfoSchema.nullable(),
});

export const CreateDocumentSchema = z.object({
  body: z.object({
    serialNumber: z.string().openapi({ example: "2025/CV-HPC/NEW" }),
    title: z.string().openapi({ example: "New Official Dispatch" }),
    contentSummary: z
      .string()
      .openapi({ example: "Details about the new dispatch." }),
    type: z.enum(["INCOMING", "OUTGOING"]),
    recipientInfo: RecipientInfoSchema.optional(),
  }),
});

export const UpdateDocumentSchema = CreateDocumentSchema;

const SubmitActionSchema = z.object({
  action: z.literal("SUBMIT_FOR_APPROVAL"),
  assigneeId: z.cuid(),
  comment: z.string().optional(),
});

const ApproveActionSchema = z.object({
  action: z.literal("APPROVE"),
  comment: z.string().optional(),
});

const RejectActionSchema = z.object({
  action: z.literal("REJECT"),
  comment: z.string().optional(),
});

const IssueActionSchema = z.object({
  action: z.literal("ISSUE"),
  comment: z.string().optional(),
});

const ActionBodySchema = z.discriminatedUnion("action", [
  SubmitActionSchema,
  ApproveActionSchema,
  RejectActionSchema,
  IssueActionSchema,
]);

export const ActionSchema = z.object({
  body: ActionBodySchema,
});
