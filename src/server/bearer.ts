export const readBearer = (req: Request): string | null => {
  const auth = req.headers.get("Authorization");
  if (!auth) return null;

  // "Bearer {token}"
  const token = auth.split(" ")[1];
  return token || null;
};
