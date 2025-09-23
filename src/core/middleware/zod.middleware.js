"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
var zod_1 = require("zod");
var validate = function (schema) { return function (req, res, next) {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({
                errors: error.issues.map(function (e) { return ({
                    message: e.message,
                    path: e.path,
                }); }),
            });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
}; };
exports.validate = validate;
