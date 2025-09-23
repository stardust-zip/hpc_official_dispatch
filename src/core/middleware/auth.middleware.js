"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var config_1 = require("../../config");
// Middleware to authenticate requests by validating a JWT.
// The token is expected to be provided by the hpc_user service.
var authenticate = function (req, res, next) {
    var authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
            .status(401)
            .json({ message: "Authentication token is required." });
    }
    var token = authHeader.split(" ")[1];
    try {
        // Verify the token using the shared secret key
        var decoded = jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};
exports.authenticate = authenticate;
