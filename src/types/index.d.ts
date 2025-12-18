import { JwtUserPayload } from '@worker-mock-server/utils/jwt.ts';

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtUserPayload;
  }
}
