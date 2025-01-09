import express from "express"
import cors from "cors"
import path from "path"
import { db } from "./db"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { users } from "./db/schema"
import { eq } from "drizzle-orm"
import "dotenv/config"

// Import routes
import projectsRouter from "./routes/projects"
import categoriesRouter from "./routes/categories"
import testimonialsRouter from "./routes/testimonials"

const app = express()
const port = process.env.PORT || 8000
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Middleware
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads")))

// Auth Routes
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, password } = req.body

    // Check if user exists
    const existingUser = await db.select().from(users).where(eq(users.username, username))
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Username already exists" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const [user] = await db
      .insert(users)
      .values({
        username,
        password: hashedPassword,
      })
      .returning()

    // Generate token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET)

    res.status(201).json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to create user" })
  }
})

app.post("/api/auth/signin", async (req, res) => {
  try {
    const { username, password } = req.body

    // Find user
    const [user] = await db.select().from(users).where(eq(users.username, username))
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET)

    res.json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to sign in" })
  }
})

// API Routes
app.use("/api/projects", projectsRouter)
app.use("/api/categories", categoriesRouter)
app.use("/api/testimonials", testimonialsRouter)

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})