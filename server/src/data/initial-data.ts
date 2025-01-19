export const initialProjects = [
  {
    id: "romans-partners",
    title: "Romans & Partners",
    categories: ["UI/UX Design", "Property Portal"],
    isLatest: true,
  },
  {
    id: "alveena-casa",
    title: "Alveena Casa",
    categories: ["UI/UX Design", "E-Commerce"],
  },
  {
    id: "foodi-app",
    title: "Foodi App",
    categories: ["Digital Products", "E-Commerce"],
  },
  {
    id: "re-core-pilates",
    title: "Re-Core Pilates",
    categories: ["Digital Products", "E-Commerce"],
  },
  {
    id: "tech-superpowers",
    title: "Tech SuperPowers",
    categories: ["UI/UX Design", "Website Design"],
  },
]

export const initialCategories = [
  { id: "e-commerce", title: "E-commerce" },
  { id: "website-design", title: "Website Design" },
  { id: "digital-products", title: "Digital Products" },
  { id: "brand-identities", title: "Brand Identities" },
  { id: "business-branding", title: "Business Branding" },
  { id: "ui-ux-design", title: "UI/UX Design" },
  { id: "property-portal", title: "Property Portal" },
]

export interface TestimonialAuthor {
  name: string
  company?: string
  image?: string
}

export interface TestimonialData {
  id: string
  author: TestimonialAuthor
  content: string
}

export const initialTestimonials: TestimonialData[] = [
  {
    id: "1",
    author: {
      name: "Steven Glibbery",
      company: "TGA Mobility",
    },
    content:
      "We have worked with Aesthetic Webworks to build a complete new website with quite complex connections with our CRM and accounting functions. The end product is brilliant, a really first class blend of design and functionality and the speed and depth of understanding about our business was remarkable. I'd highly recommend them.",
  },
  {
    id: "2",
    author: {
      name: "Jane Smith",
      company: "Tech Solutions",
    },
    content:
      "Working with the team has been an absolute pleasure. Their attention to detail and innovative approach to problem-solving has transformed our digital presence.",
  },
  {
    id: "3",
    author: {
      name: "Michael Chen",
      company: "E-Commerce Plus",
    },
    content:
      "The e-commerce platform they built for us exceeded all expectations. Our conversion rates have increased by 45% since launch. Their expertise in both design and technical implementation is outstanding.",
  },
  {
    id: "4",
    author: {
      name: "Sarah Williams",
      company: "Brand Forward",
    },
    content:
      "Their approach to brand identity development was refreshing. They took the time to truly understand our values and translated them into a cohesive digital presence that resonates with our target audience.",
  },
  {
    id: "5",
    author: {
      name: "David Thompson",
      company: "Property Partners",
    },
    content:
      "The property portal they developed for us streamlined our entire operation. The user interface is intuitive, and the backend integration with our existing systems was seamless. A truly professional team.",
  },
]
