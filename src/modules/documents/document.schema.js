"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionSchema = exports.UpdateDocumentSchema = exports.CreateDocumentSchema = exports.DocumentSchema = void 0;
var zod_1 = require("zod");
var zod_to_openapi_1 = require("@asteasolutions/zod-to-openapi");
(0, zod_to_openapi_1.extendZodWithOpenApi)(zod_1.z);
var RecipientInfoSchema = zod_1.z
    .object({
    name: zod_1.z.string(),
    address: zod_1.z.string().optional(),
    department: zod_1.z.string().optional(),
    email: zod_1.z.email().optional(),
})
    .openapi("RecipientInfo");
exports.DocumentSchema = zod_1.z.object({
    id: zod_1.z.cuid().openapi({ example: "clx3x8y7z0000a4b0d1e2f3g4" }),
    serialNumber: zod_1.z.string().openapi({ example: "2025/CV-HPC" }),
    title: zod_1.z.string().openapi({ example: "Official Letter of Introduction" }),
    contentSummary: zod_1.z.string().openapi({ example: "Summary of the letter..." }),
    type: zod_1.z.enum(["INCOMING", "OUTGOING"]),
    securityLevel: zod_1.z.enum(["PUBLIC", "INTERNAL", "CONFIDENTIAL", "SECRET"]),
    authorId: zod_1.z.cuid().openapi({ example: "user-cuid-12345" }),
    assigneeId: zod_1.z.cuid().nullable().openapi({ example: "user-cuid-67890" }),
    status: zod_1.z.enum([
        "DRAFT",
        "PENDING_APPROVAL",
        "APPROVED",
        "REJECTED",
        "ISSUED",
    ]),
    createdAt: zod_1.z.iso.datetime().openapi({ example: "2025-09-17T13:30:00Z" }),
    updatedAt: zod_1.z.iso.datetime().openapi({ example: "2025-09-17T14:00:00Z" }),
    recipientInfo: RecipientInfoSchema.nullable(),
});
exports.CreateDocumentSchema = zod_1.z.object({
    body: zod_1.z.object({
        serialNumber: zod_1.z.string().openapi({ example: "2025/CV-HPC/NEW" }),
        title: zod_1.z.string().openapi({ example: "New Official Dispatch" }),
        contentSummary: zod_1.z
            .string()
            .openapi({ example: "Details about the new dispatch." }),
        type: zod_1.z.enum(["INCOMING", "OUTGOING"]),
        recipientInfo: RecipientInfoSchema.optional(),
    }),
});
exports.UpdateDocumentSchema = exports.CreateDocumentSchema;
var SubmitActionSchema = zod_1.z.object({
    action: zod_1.z.literal("SUBMIT_FOR_APPROVAL"),
    assigneeId: zod_1.z.cuid(),
    comment: zod_1.z.string().optional(),
});
var ApproveActionSchema = zod_1.z.object({
    action: zod_1.z.literal("APPROVE"),
    comment: zod_1.z.string().optional(),
});
var RejectActionSchema = zod_1.z.object({
    action: zod_1.z.literal("REJECT"),
    comment: zod_1.z.string().optional(),
});
var IssueActionSchema = zod_1.z.object({
    action: zod_1.z.literal("ISSUE"),
    comment: zod_1.z.string().optional(),
});
var ActionBodySchema = zod_1.z.discriminatedUnion("action", [
    SubmitActionSchema,
    ApproveActionSchema,
    RejectActionSchema,
    IssueActionSchema,
]);
exports.ActionSchema = zod_1.z.object({
    body: ActionBodySchema,
});
