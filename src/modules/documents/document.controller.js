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
exports.documentController = void 0;
var express_validator_1 = require("express-validator");
var document_service_1 = require("./document.service");
exports.documentController = {
    createDocument: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var validatedData, authorId, documentData, newDocument, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        validatedData = (0, express_validator_1.matchedData)(req);
                        authorId = req.user.id;
                        documentData = __assign(__assign({}, validatedData), { authorId: authorId });
                        return [4 /*yield*/, document_service_1.documentService.createNewDocument(documentData)];
                    case 1:
                        newDocument = _a.sent();
                        res.status(201).json(newDocument);
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        res.status(500).json({ message: "Failed to create document." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getDocumentById: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, document_1, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, document_service_1.documentService.getDocumentDetails(id)];
                    case 1:
                        document_1 = _a.sent();
                        res.status(200).json(document_1);
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        if (error_2.message === "Document not found") {
                            return [2 /*return*/, res.status(404).json({ message: error_2.message })];
                        }
                        res.status(500).json({ message: "Failed to retrieve document." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    getAllDocuments: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var documents, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, document_service_1.documentService.listAllDocuments()];
                    case 1:
                        documents = _a.sent();
                        res.status(200).json(documents);
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        res.status(500).json({ message: "Failed to retrieve documents." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    updateDocument: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, userId, validatedData, updatedDocument, error_4, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        userId = req.user.id;
                        validatedData = (0, express_validator_1.matchedData)(req);
                        return [4 /*yield*/, document_service_1.documentService.updateDocument(id, userId, validatedData)];
                    case 1:
                        updatedDocument = _a.sent();
                        res.status(200).json(updatedDocument);
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        err = error_4;
                        if (err.message === "Document not found")
                            return [2 /*return*/, res.status(404).json({ message: err.message })];
                        if (err.message === "Forbidden")
                            return [2 /*return*/, res
                                    .status(403)
                                    .json({
                                    message: "You do not have permission to edit this document.",
                                })];
                        res.status(500).json({ message: "Failed to update document." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    deleteDocument: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, error_5, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, document_service_1.documentService.deleteDocument(id)];
                    case 1:
                        _a.sent();
                        res.status(204).send();
                        return [3 /*break*/, 3];
                    case 2:
                        error_5 = _a.sent();
                        err = error_5;
                        if (err.message === "Document not found")
                            return [2 /*return*/, res.status(404).json({ message: err.message })];
                        res.status(500).json({ message: "Failed to delete document." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    performAction: function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var id, actorId, payload, updatedDocument, error_6, err;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        actorId = req.user.id;
                        payload = req.body;
                        return [4 /*yield*/, document_service_1.documentService.performWorkflowAction(id, actorId, payload)];
                    case 1:
                        updatedDocument = _a.sent();
                        res.status(200).json(updatedDocument);
                        return [3 /*break*/, 3];
                    case 2:
                        error_6 = _a.sent();
                        err = error_6;
                        if (err.message.startsWith("Forbidden"))
                            return [2 /*return*/, res.status(403).json({ message: err.message })];
                        if (err.message.startsWith("Invalid state") ||
                            err.message.startsWith("Bad Request")) {
                            return [2 /*return*/, res.status(400).json({ message: err.message })];
                        }
                        if (err.message === "Document not found")
                            return [2 /*return*/, res.status(404).json({ message: err.message })];
                        res.status(500).json({ message: "Failed to perform action." });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
};
