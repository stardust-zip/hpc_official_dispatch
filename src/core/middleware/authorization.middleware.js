"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
var authorize = function (allowedRoles) {
    return function (req, res, next) {
        var user = req.user;
        if (!user) {
            return res.status(401).json({ message: "Not authenticated." });
        }
        var effectivePermissions = [];
        if (user.role) {
            effectivePermissions.push(user.role);
        }
        if (user.isAdmin === true) {
            effectivePermissions.push("admin");
        }
        var hasPermission = effectivePermissions.some(function (permission) {
            return allowedRoles.includes(permission);
        });
        if (hasPermission) {
            return next();
        }
        return res.status(403).json({
            message: "Forbidden: You do not have permission to perform this action.",
        });
    };
};
exports.authorize = authorize;
