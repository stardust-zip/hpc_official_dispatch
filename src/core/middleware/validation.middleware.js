"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = void 0;
var express_validator_1 = require("express-validator");
var handleValidationErrors = function (req, res, next) {
    var errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
