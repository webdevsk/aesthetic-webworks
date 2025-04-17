import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface AuthUser {
  id: number;
  username: string;
}

/**
 * Authenticate a JWT from request headers (Next.js API route/server action).
 * Throws an error if authentication fails.
 * Usage: await authenticateToken(headers)
 */
export async function authenticateToken(headers: Headers): Promise<AuthUser> {
  const authHeader = headers.get("authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET) as AuthUser;
    return user;
  } catch (err) {
    throw new Response(JSON.stringify({ error: "Invalid token" }), { status: 403 });
  }
}
