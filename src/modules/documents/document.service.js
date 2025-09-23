"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentService = void 0;
var document_repository_1 = require("./document.repository");
exports.documentService = {
    createNewDocument: function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Creating document for author: ".concat(data.authorId));
                return [2 /*return*/, document_repository_1.documentRepository.create(data)];
            });
        });
    },
    getDocumentDetails: function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var document;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, document_repository_1.documentRepository.findById(id)];
                    case 1:
                        document = _a.sent();
                        if (!document)
                            throw new Error("Document not found");
                        return [2 /*return*/, document];
                }
            });
        });
    },
    listAllDocuments: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, document_repository_1.documentRepository.findAll()];
            });
        });
    },
    updateDocument: function (documentId, userId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var existingDocument;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, document_repository_1.documentRepository.findById(documentId)];
                    case 1:
                        existingDocument = _a.sent();
                        if (!existingDocument)
                            throw new Error("Document not found");
                        if (existingDocument.authorId !== userId)
                            throw new Error("Forbidden");
                        return [2 /*return*/, document_repository_1.documentRepository.update(documentId, data)];
                }
            });
        });
    },
    deleteDocument: function (documentId) {
        return __awaiter(this, void 0, void 0, function () {
            var existingDocument;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, document_repository_1.documentRepository.findById(documentId)];
                    case 1:
                        existingDocument = _a.sent();
                        if (!existingDocument)
                            throw new Error("Document not found");
                        return [4 /*yield*/, document_repository_1.documentRepository.remove(documentId)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    performWorkflowAction: function (documentId, actorId, payload) {
        return __awaiter(this, void 0, void 0, function () {
            var document, action, _a, updatedDoc, approvedDoc, rejectedDoc, issuedDoc;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, document_repository_1.documentRepository.findById(documentId)];
                    case 1:
                        document = _b.sent();
                        if (!document)
                            throw new Error("Document not found");
                        action = payload.action;
                        _a = action;
                        switch (_a) {
                            case "SUBMIT_FOR_APPROVAL": return [3 /*break*/, 2];
                            case "APPROVE": return [3 /*break*/, 4];
                            case "REJECT": return [3 /*break*/, 6];
                            case "ISSUE": return [3 /*break*/, 8];
                        }
                        return [3 /*break*/, 10];
                    case 2:
                        if (document.status !== "DRAFT")
                            throw new Error("Invalid state transition: Can only submit a DRAFT document.");
                        if (document.authorId !== actorId)
                            throw new Error("Forbidden: Only the author can submit for approval.");
                        return [4 /*yield*/, document_repository_1.documentRepository.updateStatusAndLog(documentId, {
                                status: "PENDING_APPROVAL",
                                assigneeId: payload.assigneeId,
                                actorId: actorId,
                                action: action,
                                comment: payload.comment,
                            })];
                    case 3:
                        updatedDoc = (_b.sent())[0];
                        return [2 /*return*/, updatedDoc];
                    case 4:
                        if (document.status !== "PENDING_APPROVAL")
                            throw new Error("Invalid state transition: Can only approve a PENDING_APPROVAL document.");
                        if (document.assigneeId !== actorId)
                            throw new Error("Forbidden: You are not the assigned approver.");
                        return [4 /*yield*/, document_repository_1.documentRepository.updateStatusAndLog(documentId, {
                                status: "APPROVED",
                                assigneeId: null,
                                actorId: actorId,
                                action: action,
                                comment: payload.comment,
                            })];
                    case 5:
                        approvedDoc = (_b.sent())[0];
                        return [2 /*return*/, approvedDoc];
                    case 6:
                        if (document.status !== "PENDING_APPROVAL")
                            throw new Error("Invalid state transition: Can only reject a PENDING_APPROVAL document.");
                        if (document.assigneeId !== actorId)
                            throw new Error("Forbidden: You are not the assigned approver.");
                        return [4 /*yield*/, document_repository_1.documentRepository.updateStatusAndLog(documentId, {
                                status: "REJECTED",
                                assigneeId: null,
                                actorId: actorId,
                                action: action,
                                comment: payload.comment,
                            })];
                    case 7:
                        rejectedDoc = (_b.sent())[0];
                        return [2 /*return*/, rejectedDoc];
                    case 8:
                        if (document.status !== "APPROVED")
                            throw new Error("Invalid state transition: Can only issue an APPROVED document.");
                        if (document.authorId !== actorId)
                            throw new Error("Forbidden: Only the author can issue the document.");
                        return [4 /*yield*/, document_repository_1.documentRepository.updateStatusAndLog(documentId, {
                                status: "ISSUED",
                                assigneeId: document.assigneeId,
                                actorId: actorId,
                                action: action,
                                comment: payload.comment,
                            })];
                    case 9:
                        issuedDoc = (_b.sent())[0];
                        return [2 /*return*/, issuedDoc];
                    case 10: throw new Error("Bad Request: Unknown action.");
                }
            });
        });
    },
};
