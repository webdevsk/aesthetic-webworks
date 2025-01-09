import multer from "multer"
import path from "path"
import fs from "fs/promises"

// Helper function to ensure upload directory exists
async function ensureUploadDir(uploadPath: string) {
  try {
    await fs.access(uploadPath)
  } catch {
    await fs.mkdir(uploadPath, { recursive: true })
  }
}

// Get the absolute path for uploads
const getUploadPath = () => {
  // If UPLOAD_DIR is absolute, use it directly
  if (process.env.UPLOAD_DIR && path.isAbsolute(process.env.UPLOAD_DIR)) {
    return process.env.UPLOAD_DIR
  }

  // Otherwise, resolve relative to project root
  const projectRoot = path.resolve(__dirname, "..", "..")
  return path.join(projectRoot, process.env.UPLOAD_DIR || "uploads")
}

const uploadPath = getUploadPath()

// Ensure upload directory exists
ensureUploadDir(uploadPath).catch(console.error)

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadPath)
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
    const fullPath = path.join(uploadPath, imagePath.replace(/^\/uploads\//, ""))
    await fs.unlink(fullPath)
  } catch (error) {
    // Just log the error without throwing
    console.error("Failed to delete image file:", error)
  }
} 