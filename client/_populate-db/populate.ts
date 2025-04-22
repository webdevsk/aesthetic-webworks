import { db } from "@/db"
import { categories, projectCategories, projects, testimonials } from "@/db/schema"
import { initialCategories, initialProjects, initialTestimonials } from "./initial-data"

async function main() {
  console.log("🌱 Seeding database...")

  // Clear existing data (in correct order due to foreign key constraints)
  console.log("Clearing existing data...")
  await db.delete(projectCategories) // Delete junction table first
  await db.delete(projects) // Then delete main tables
  await db.delete(categories)
  await db.delete(testimonials)
  console.log("✅ Existing data cleared!")

  // Insert projects
  await db.insert(projects).values(initialProjects)

  // Insert categories
  await db.insert(categories).values(initialCategories)

  // Insert project categories relationships
  // for (const project of initialProjects) {
  //   if (project.categories) {
  //     const projectResult = await db.select().from(projects).where(eq(projects.slug, project.id))
  //     if (!projectResult[0]) continue

  //     for (const categoryTitle of project.categories) {
  //       const categoryResult = await db.select().from(categories).where(eq(categories.title, categoryTitle))
  //       if (!categoryResult[0]) continue

  //       await db.insert(projectCategories).values({
  //         projectId: projectResult[0].id,
  //         categoryId: categoryResult[0].id,
  //       })
  //     }
  //   }
  // }

  // Insert project categories relationships (untested)
  const projectCategoryValues = initialProjects
    .flatMap(
      (project) =>
        project.categories?.flatMap((categoryTitle) => ({
          projectId: project.id,
          categoryId: initialCategories.find((category) => category.title === categoryTitle)?.id,
        })) ?? []
    )
    .filter((value) => value.projectId && value.categoryId)

  await db.insert(projectCategories).values(projectCategoryValues)

  // Insert testimonials
  await db.insert(testimonials).values(initialTestimonials)

  console.log("✅ Database seeded successfully!")
  process.exit(1)
}

main().catch((error) => {
  console.error("Error seeding database:", error)
  process.exit(1)
})
