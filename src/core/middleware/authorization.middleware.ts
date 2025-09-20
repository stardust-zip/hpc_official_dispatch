import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";

export const authorize = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    const effectivePermissions: string[] = [];

    if (user.role) {
      effectivePermissions.push(user.role);
    }

    if (user.isAdmin === true) {
      effectivePermissions.push("admin");
    }

    const hasPermission = effectivePermissions.some((permission) =>
      allowedRoles.includes(permission),
    );

    if (hasPermission) {
      return next();
    }

    return res.status(403).json({
      message: "Forbidden: You do not have permission to perform this action.",
    });
  };
};
