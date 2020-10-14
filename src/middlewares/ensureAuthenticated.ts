import { Response, Request, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/authConfig';

interface TokenPayload {
  user: string;
  iat: number;
  exp: number;
  sub: string;
}

export default function esnureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw Error('JWT is missing');
  }
  const [, token] = authHeader.split(' ');
  try {
    const decodedToken = verify(token, authConfig.jwt.secret);

    const { sub, user } = decodedToken as TokenPayload;

    request.user = {
      id: sub,
      name: user,
    };

    return next();
  } catch (err) {
    throw new Error('Invalid JWT Token');
  }
}
