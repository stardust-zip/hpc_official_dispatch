import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config";

// This file verifies the JWT sent with request
// This gonna be issued by hpc_user upon login
// It
// 1. validates tokens
// 2. attches user ID to the request

// Extend the Express Request type to include our user payload
export interface AuthenticatedRequest extends Request {
  user?: { id: string; roles: string[] }; // Payload from the JWT
}

// Middleware to authenticate requests by validating a JWT.
// The token is expected to be provided by the hpc_user service.
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Authentication token is required." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using the shared secret key
    const decoded = jwt.verify(token, config.jwtSecret!) as {
      id: string;
      roles: string[];
    };
    req.user = decoded; // Attach user payload to the request object
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
