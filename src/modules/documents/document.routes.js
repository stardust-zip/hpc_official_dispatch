"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentRouter = void 0;
var express_1 = require("express");
var zod_1 = require("zod");
var document_controller_1 = require("./document.controller");
var auth_middleware_1 = require("../../core/middleware/auth.middleware");
var authorization_middleware_1 = require("../../core/middleware/authorization.middleware");
var document_validator_1 = require("./document.validator");
var validation_middleware_1 = require("../../core/middleware/validation.middleware");
var document_schema_1 = require("./document.schema");
var zod_middleware_1 = require("../../core/middleware/zod.middleware");
var createDocumentRouter = function (registry) {
    var router = (0, express_1.Router)();
    var commonResponses = {
        401: { description: "Unauthorized" },
        403: { description: "Forbidden" },
        404: { description: "Resource not found" },
    };
    // POST /documents
    registry.registerPath({
        method: "post",
        path: "/documents",
        summary: "Create a new document",
        tags: ["Documents"],
        request: {
            body: {
                content: {
                    "application/json": {
                        schema: document_schema_1.CreateDocumentSchema.shape.body,
                    },
                },
            },
        },
        responses: __assign({ 201: {
                description: "Document created successfully",
                content: {
                    "application/json": { schema: document_schema_1.DocumentSchema },
                },
            }, 400: { description: "Bad Request" } }, commonResponses),
    });
    router.post("/", auth_middleware_1.authenticate, (0, authorization_middleware_1.authorize)(["admin", "teacher"]), document_validator_1.createDocumentValidator, validation_middleware_1.handleValidationErrors, document_controller_1.documentController.createDocument);
    // GET /documents/{id}
    registry.registerPath({
        method: "get",
        path: "/documents/{id}",
        summary: "Get a single document by ID",
        tags: ["Documents"],
        request: {
            params: zod_1.z.object({ id: zod_1.z.string().cuid() }),
        },
        responses: __assign({ 200: {
                description: "Document details",
                content: {
                    "application/json": { schema: document_schema_1.DocumentSchema },
                },
            } }, commonResponses),
    });
    router.get("/:id", auth_middleware_1.authenticate, (0, authorization_middleware_1.authorize)(["admin", "teacher"]), document_controller_1.documentController.getDocumentById);
    // PUT /documents/{id}
    registry.registerPath({
        method: "put",
        path: "/documents/{id}",
        summary: "Update an existing document",
        tags: ["Documents"],
        request: {
            params: zod_1.z.object({ id: zod_1.z.string().cuid() }),
            body: {
                content: {
                    "application/json": { schema: document_schema_1.UpdateDocumentSchema.shape.body },
                },
            },
        },
        responses: __assign({ 200: {
                description: "Document updated successfully",
                content: {
                    "application/json": { schema: document_schema_1.DocumentSchema },
                },
            }, 400: { description: "Bad Request" } }, commonResponses),
    });
    router.put("/:id", auth_middleware_1.authenticate, (0, authorization_middleware_1.authorize)(["admin", "teacher"]), document_validator_1.updateDocumentValidator, validation_middleware_1.handleValidationErrors, document_controller_1.documentController.updateDocument);
    // DELETE /documents/{id}
    registry.registerPath({
        method: "delete",
        path: "/documents/{id}",
        summary: "Delete a document (Admins only)",
        tags: ["Documents"],
        request: {
            params: zod_1.z.object({ id: zod_1.z.string().cuid() }),
        },
        responses: __assign({ 204: { description: "Document deleted successfully" } }, commonResponses),
    });
    router.delete("/:id", auth_middleware_1.authenticate, (0, authorization_middleware_1.authorize)(["admin"]), document_controller_1.documentController.deleteDocument);
    // POST /documents/{id}/actions
    registry.registerPath({
        method: "post",
        path: "/documents/{id}/actions",
        summary: "Perform a workflow action on a document",
        tags: ["Workflow"],
        request: {
            params: zod_1.z.object({ id: zod_1.z.cuid() }),
            body: {
                content: {
                    "application/json": { schema: document_schema_1.ActionSchema.shape.body },
                },
            },
        },
        responses: __assign({ 200: {
                description: "Action performed successfully",
                content: { "application/json": { schema: document_schema_1.DocumentSchema } },
            }, 400: { description: "Bad Request (e.g., invalid action or state)" } }, commonResponses),
    });
    router.post("/:id/actions", auth_middleware_1.authenticate, (0, authorization_middleware_1.authorize)(["admin", "teacher"]), (0, zod_middleware_1.validate)(document_schema_1.ActionSchema), document_controller_1.documentController.performAction);
    return router;
};
exports.createDocumentRouter = createDocumentRouter;
