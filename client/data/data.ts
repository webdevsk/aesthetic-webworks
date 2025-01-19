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

    export interface Testimonial {
      id: string;
      author: {
        name: string;
        company?: string;
        image?: string;
      };
      content: string;
    }
    
    export const testimonials: Testimonial[] = [
      {
        id: "1",
        author: {
          name: "Steven Glibbery",
          company: "TGA Mobility",
        },
        content: "We have worked with Aesthetic Webworks to build a complete new website with quite complex connections with our CRM and accounting functions. The end product is brilliant, a really first class blend of design and functionality and the speed and depth of understanding about our business was remarkable. I'd highly recommend them.",
      },
      {
        id: "2",
        author: {
          name: "Jane Smith", 
          company: "Tech Solutions",
        },
        content: "Working with the team has been an absolute pleasure. Their attention to detail and innovative approach to problem-solving has transformed our digital presence.",
      },
      {
        id: "3",
        author: {
          name: "Michael Chen",
          company: "E-Commerce Plus",
        },
        content: "The e-commerce platform they built for us exceeded all expectations. Our conversion rates have increased by 45% since launch. Their expertise in both design and technical implementation is outstanding.",
      },
      {
        id: "4",
        author: {
          name: "Sarah Williams",
          company: "Brand Forward",
        },
        content: "Their approach to brand identity development was refreshing. They took the time to truly understand our values and translated them into a cohesive digital presence that resonates with our target audience.",
      },
      {
        id: "5",
        author: {
          name: "David Thompson",
          company: "Property Partners",
        },
        content: "The property portal they developed for us streamlined our entire operation. The user interface is intuitive, and the backend integration with our existing systems was seamless. A truly professional team.",
      }
    ];
    
    