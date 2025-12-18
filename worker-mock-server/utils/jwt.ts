import jwt, { type JwtPayload } from 'jsonwebtoken';
import { UserDB } from '../routes/authRoutes.ts';

export interface JwtUserPayload extends JwtPayload {
  id: number;
  login: string;
  role: 'ADMIN' | 'USER';
}

const JWT_SECRET = 'my_secret_key';

export const generateToken = (user: UserDB) => {
  return jwt.sign(
    {
      id: user.id,
      login: user.login,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '24h' },
  );
};

export const verifyToken = (token: string): JwtUserPayload => {
  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded === 'string') {
    throw new Error('Invalid token format');
  }

  return decoded as JwtUserPayload;
};
