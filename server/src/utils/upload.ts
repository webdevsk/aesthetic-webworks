import multer from "multer"
import path from "path"
import fs from "fs/promises"

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "..", "..", process.env.UPLOAD_DIR || "uploads"))
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

export const upload = multer({
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

// Helper function to delete image file
export async function deleteImageFile(imagePath: string | undefined | null) {
  if (!imagePath) return
  try {
    const fullPath = path.join(__dirname, "..", "..", imagePath.replace(/^\//, ""))
    await fs.unlink(fullPath)
  } catch (error) {
    // Just log the error without throwing
    console.error("Failed to delete image file:", error)
  }
} 