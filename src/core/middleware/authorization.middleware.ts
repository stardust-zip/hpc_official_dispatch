import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";

/**
 * Creates a middleware function that checks if the authenticated user has one of the allowed roles.
 * @param allowedRoles - An array of role strings that are permitted to access the route.
 */
export const authorize = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !Array.isArray(user.roles)) {
      // Return 403 because this is an issue with the user's permissions/token structure.
      return res
        .status(403)
        .json({ message: "Forbidden: Invalid user permissions." });
    }
    // Check if the user's roles array has at least one role that is in the allowedRoles array.
    const hasPermission = user.roles.some((role) =>
      allowedRoles.includes(role),
    );

    if (hasPermission) {
      return next();
    }

    return res.status(403).json({
      message: "Forbidden: You do not have permission to perform this action.",
    });
  };
};
