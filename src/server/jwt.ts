import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error(
  "Please define the JWT_SECRET environment variable inside .env"
);

export const sign = (payload: object, expiresIn = "1h"): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export const verify = (token: string): JwtPayload | null => {
  try {
    // casting is done since we never sign strings.
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  }
  catch {
    return null;
  }
}
