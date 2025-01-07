import { db } from "./index"
import { projects, categories, projectCategories, testimonials } from "./schema"
import { initialProjects, initialCategories, initialTestimonials } from "../data/initial-data"
import { eq } from "drizzle-orm"

async function main() {
  console.log("🌱 Seeding database...")

  // Insert projects
  for (const project of initialProjects) {
    await db.insert(projects).values({
      title: project.title,
      slug: project.id,
      image: project.image,
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
}

main().catch((error) => {
  console.error("Error seeding database:", error)
  process.exit(1)
})
