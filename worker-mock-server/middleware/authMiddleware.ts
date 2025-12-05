import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../utils/jwt';

export const authCheck = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: 'Authorization header missing' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      login: decoded.login,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
