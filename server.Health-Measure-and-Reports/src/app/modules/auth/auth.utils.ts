import jwt, { Secret } from "jsonwebtoken";

export const createToken = (
  payload: Record<string, any>,
  secret: Secret,
  expiresIn: string
): string => {
  return jwt.sign(payload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret);
};

