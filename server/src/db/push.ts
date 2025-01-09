import { db } from "./index"
import { projects, categories, projectCategories, testimonials } from "./schema"
import { initialProjects, initialCategories, initialTestimonials } from "../data/initial-data"
import { eq } from "drizzle-orm"

async function main() {
  console.log("🌱 Seeding database...")

  // Clear existing data (in correct order due to foreign key constraints)
  console.log("Clearing existing data...")
  await db.delete(projectCategories)  // Delete junction table first
  await db.delete(projects)           // Then delete main tables
  await db.delete(categories)
  await db.delete(testimonials)
  console.log("✅ Existing data cleared!")

  // Insert projects
  for (const project of initialProjects) {
    await db.insert(projects).values({
      title: project.title,
      slug: project.id,
      isLatest: project.isLatest || false,
    })
  }

  // Insert categories
  for (const category of initialCategories) {
    await db.insert(categories).values({
      title: category.title,
      slug: category.id,
    })
  }

  // Insert project categories relationships
  for (const project of initialProjects) {
    if (project.categories) {
      const projectResult = await db.select().from(projects).where(eq(projects.slug, project.id))
      if (!projectResult[0]) continue

      for (const categoryTitle of project.categories) {
        const categoryResult = await db.select().from(categories).where(eq(categories.title, categoryTitle))
        if (!categoryResult[0]) continue

        await db.insert(projectCategories).values({
          projectId: projectResult[0].id,
          categoryId: categoryResult[0].id,
        })
      }
    }
  }

  // Insert testimonials
  for (const testimonial of initialTestimonials) {
    await db.insert(testimonials).values({
      authorName: testimonial.author.name,
      authorCompany: testimonial.author.company || "",
      authorImage: testimonial.author.image || null,
      content: testimonial.content,
    })
  }

  console.log("✅ Database seeded successfully!")
  process.exit(1)

}

main().catch((error) => {
  console.error("Error seeding database:", error)
  process.exit(1)
})
