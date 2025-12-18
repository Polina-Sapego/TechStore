import { NextFunction, Request, Response } from 'express';
import { type JwtUserPayload, verifyToken } from '../utils/jwt';

export interface RequestWithUser extends Request {
  user?: JwtUserPayload;
}

export const authCheck = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      login: decoded.login,
      role: decoded.role,
    };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
