"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var dotenv_1 = require("dotenv");
// This file loads and exports environment variables
dotenv_1.default.config(); // Load variables from .env file
// A central place for all environment variables
exports.config = {
    port: process.env.PORT || 3005, // Port for this microservice
    jwtSecret: process.env.JWT_SECRET, // Secret to verify tokens from hpc_user
    userServiceUrl: process.env.USER_SERVICE_URL, // URL for hpc_user service
};
// Validate that critical environment variables are set
if (!exports.config.jwtSecret || !exports.config.userServiceUrl) {
    throw new Error("Missing critical environment variables: JWT_SECRET, USER_SERVICE_URL");
}
