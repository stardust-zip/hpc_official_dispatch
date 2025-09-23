"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDocumentValidator = exports.createDocumentValidator = void 0;
var express_validator_1 = require("express-validator");
exports.createDocumentValidator = [
    (0, express_validator_1.body)("title").isString().notEmpty().withMessage("Title is required."),
    (0, express_validator_1.body)("serialNumber")
        .isString()
        .notEmpty()
        .withMessage("Serial number is required."),
    (0, express_validator_1.body)("contentSummary")
        .isString()
        .notEmpty()
        .withMessage("Content summary is required."),
    (0, express_validator_1.body)("type")
        .isIn(["INCOMING", "OUTGOING"])
        .withMessage("Invalid document type."),
];
exports.updateDocumentValidator = [
    (0, express_validator_1.body)("title").isString().notEmpty().withMessage("Title is required."),
    (0, express_validator_1.body)("serialNumber")
        .isString()
        .notEmpty()
        .withMessage("Serial number is required."),
    (0, express_validator_1.body)("contentSummary")
        .isString()
        .notEmpty()
        .withMessage("Content summary is required."),
    (0, express_validator_1.body)("type")
        .isIn(["INCOMING", "OUTGOING"])
        .withMessage("Invalid document type."),
];
