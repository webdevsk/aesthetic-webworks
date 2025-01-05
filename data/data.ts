type Project = {
  id: string
  title: string
  image?: string
  categories?: string[]
  categoryIds?: string[]
  isLatest?: boolean
}
export const projects: Project[] = [
  {
    title: "Romans & Partners",
    image: "/01_Estate-Agency-Web-Design-London.jpg", // Replace with actual image URL
    categories: ["UI/UX Design", "Property Portal"],
    isLatest: true,
  },
  {
    title: "Alveena Casa",
    image: "/01_Estate-Agency-Web-Design-London.jpg", // Replace with actual image URL
    categories: ["UI/UX Design", "E-Commerce"],
  },
  {
    title: "Foodi App",
    image: "/01_Estate-Agency-Web-Design-London.jpg", // Replace with actual image URL
    categories: ["Digital Products", "E-Commerce"],
  },
  {
    title: "Re-Core Pilates",
    image: "/01_Estate-Agency-Web-Design-London.jpg", // Replace with actual image URL
    categories: ["Digital Products", "E-Commerce"],
  },
  {
    title: "Tech SuperPowers",
    image: "/01_Estate-Agency-Web-Design-London.jpg", // Replace with actual image URL
    categories: ["UI/UX Design", "Website Design"],
  },
].map(project => ({...project, id: encodeURIComponent(project.title.toLowerCase().replace(/\s+/g, '-')), 
    categoryIds: project.categories.map(encodeURIComponent)
}))

type Category = {
    id: string
    title: string
    topProject?: Project
}

export const categories: Category[] = [
  { title: "E-commerce" },
  { title: "Website Design" },
  { title: "Digital Products" },
  { title: "Brand Identities" },
  { title: "Business Branding" },
  { title: "UI/UX Design" },
  { title: "Property Portal" },
].map(category => {
    const id = encodeURIComponent(category.title)
    return {...category, id,  topProject: projects.find(project => project.categoryIds?.some(cat => cat === id))}})
