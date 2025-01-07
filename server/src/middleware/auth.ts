import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

interface AuthRequest extends Request {
  user?: {
    id: number
    username: string
  }
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" })
    }
    req.user = user
    next()
  })
} 