import { pgTable, serial, text, varchar, boolean } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
})

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  image: varchar("image", { length: 255 }),
  isLatest: boolean("is_latest").default(false),
})

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
})

export const projectCategories = pgTable("project_categories", {
  id: serial("id").primaryKey(),
  projectId: serial("project_id").references(() => projects.id),
  categoryId: serial("category_id").references(() => categories.id),
})

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  authorName: varchar("author_name", { length: 255 }).notNull(),
  authorCompany: varchar("author_company", { length: 255 }),
  authorImage: varchar("author_image", { length: 255 }),
  content: text("content").notNull(),
})

// Types for API responses
export type Project = typeof projects.$inferSelect
export type Category = typeof categories.$inferSelect
export type ProjectCategory = typeof projectCategories.$inferSelect
export type Testimonial = typeof testimonials.$inferSelect
