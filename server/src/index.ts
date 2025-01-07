import express from "express"
import cors from "cors"
import multer from "multer"
import path from "path"
import { db } from "./db"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import {
  projects,
  categories,
  projectCategories,
  testimonials,
  users,
  type Project,
  type Category,
  type Testimonial,
} from "./db/schema"
import { eq } from "drizzle-orm"
import "dotenv/config"

type ExtendedRequest = express.Request & {
  user?: {
    id: number
    username: string
  }
}

const app = express()
const port = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Middleware
app.use(cors())
app.use(express.json())
app.use("/uploads", express.static(path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads")))

// Auth middleware
const authenticateToken = (req: ExtendedRequest, res: express.Response, next: express.NextFunction) => {
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

// Protected route example
app.get("/api/auth/me", authenticateToken, async (req:ExtendedRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" })
    }
    const user = await db.select().from(users).where(eq(users.id, req.user.id))
    res.json(user[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch user" })
  }
})

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "..", process.env.UPLOAD_DIR || "uploads"))
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024, // 1MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Invalid file type. Only JPEG, PNG and WebP are allowed"))
      return
    }
    cb(null, true)
  },
})

// API Routes
app.get("/api/projects", async (_req, res) => {
  try {
    const projectsList = await db.select().from(projects)
    const result = await Promise.all(
      projectsList.map(async (project) => {
        const projectCategoriesResult = await db
          .select({
            categoryTitle: categories.title,
          })
          .from(categories)
          .innerJoin(projectCategories, eq(categories.id, projectCategories.categoryId))
          .where(eq(projectCategories.projectId, project.id))

        return {
          ...project,
          categories: projectCategoriesResult.map((pc) => pc.categoryTitle),
        }
      })
    )
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" })
  }
})

app.get("/api/categories", async (_req, res) => {
  try {
    const result = await db.select().from(categories)
    res.json(result)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch categories" })
  }
})

app.get("/api/testimonials", async (_req, res) => {
  try {
    const result = await db.select().from(testimonials)
    const formattedResult = result.map((testimonial: Testimonial) => ({
      id: testimonial.id.toString(),
      author: {
        name: testimonial.authorName,
        company: testimonial.authorCompany,
        image: testimonial.authorImage,
      },
      content: testimonial.content,
    }))
    res.json(formattedResult)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to fetch testimonials" })
  }
})

// POST routes with image upload
app.post("/api/projects", upload.single("image"), async (req, res) => {
  try {
    const { title, categories: categoryTitles, isLatest } = req.body
    const slug = title.toLowerCase().replace(/\s+/g, "-")
    const image = req.file ? `/uploads/${req.file.filename}` : undefined

    const [project] = await db
      .insert(projects)
      .values({
        title,
        slug,
        image,
        isLatest: isLatest === "true",
      })
      .returning()

    if (categoryTitles) {
      const categoryIds = await Promise.all(
        categoryTitles.split(",").map(async (categoryTitle: string) => {
          const [category] = await db.select().from(categories).where(eq(categories.title, categoryTitle.trim()))
          return category?.id
        })
      )

      await Promise.all(
        categoryIds.filter(Boolean).map((categoryId) =>
          db.insert(projectCategories).values({
            projectId: project.id,
            categoryId: categoryId!,
          })
        )
      )
    }

    res.status(201).json(project)
  } catch (error) {
    console.error(error)
        res.status(500).json({ error: "Failed to create project" })
  }
})

app.post("/api/categories", async (req, res) => {
  try {
    const { title } = req.body
    const slug = title.toLowerCase().replace(/\s+/g, "-")

    const [category] = await db.insert(categories).values({ title, slug }).returning()

    res.status(201).json(category)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to create category" })
  }
})

app.post("/api/testimonials", upload.single("authorImage"), async (req, res) => {
  try {
    const { authorName, authorCompany, content } = req.body
    const authorImage = req.file ? `/uploads/${req.file.filename}` : undefined

    const [testimonial] = await db
      .insert(testimonials)
      .values({
        authorName,
        authorCompany,
        authorImage,
        content,
      })
      .returning()

    // Format response to match client-side type
    const formattedTestimonial = {
      id: testimonial.id.toString(),
      author: {
        name: testimonial.authorName,
        company: testimonial.authorCompany,
        image: testimonial.authorImage,
      },
      content: testimonial.content,
    }

    res.status(201).json(formattedTestimonial)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to create testimonial" })
  }
})

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})