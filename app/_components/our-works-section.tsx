"use client"

import { useRef } from "react"
import Image from "next/image"
import { HorizontalScrollTrigger } from "@/components/horizontal-scroll-trigger"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion, useInView } from "motion/react"
import Link from "next/link"

interface Project {
  id: string
  title: string
  image: string
  categories: string[]
  isLatest?: boolean
}
const projects: Project[] = [
  {
    id: "romans-partners",
    title: "Romans & Partners",
    image: "/01_Estate-Agency-Web-Design-London.jpg", // Replace with actual image URL
    categories: ["UI/UX Design", "Property Portal"],
    isLatest: true,
  },
  {
    id: "alveena-casa",
    title: "Alveena Casa",
    image: "/01_Estate-Agency-Web-Design-London.jpg", // Replace with actual image URL
    categories: ["UI/UX Design", "E-Commerce"],
  },
  {
    id: "alveena-casa2",
    title: "Alveena Casa",
    image: "/01_Estate-Agency-Web-Design-London.jpg", // Replace with actual image URL
    categories: ["UI/UX Design", "E-Commerce"],
  },
  {
    id: "alveena-casa3",
    title: "Alveena Casa",
    image: "/01_Estate-Agency-Web-Design-London.jpg", // Replace with actual image URL
    categories: ["UI/UX Design", "E-Commerce"],
  },
]

export const OurWorksSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  return (
    <HorizontalScrollTrigger>
      <div className="flex h-dvh items-center">
        <div ref={ref} className="flex flex-nowrap space-x-[2.5vw] px-[5.625rem]">
          <Heading />
          {projects.map((project, index) => (
            <motion.a
              href={`/projects/${project.id}`}
              className=""
              key={project.id}
              initial={{ opacity: 0, x: 100 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}>
              <Card className="relative aspect-[1.25] min-w-[43.125vw] overflow-hidden bg-transparent text-primary-foreground ring-0 ring-primary hover:ring-4 transition-shadow duration-300">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="inset-0 -z-10 object-cover"
                  priority={index === 0}
                />
                <div className="flex size-full flex-col gap-4">
                  <div className="self-end">{project.isLatest && <Badge>Latest</Badge>}</div>
                  <h3 className="variant-h3 mt-auto">{project.title}</h3>
                  <div className="flex flex-wrap gap-4">
                    {project.categories.map((category) => (
                      <Badge key={category} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.a>
          ))}
          <Ending />
        </div>
      </div>
    </HorizontalScrollTrigger>
  )
}

const Heading = () => {
  return (
    <div className="flex min-w-[32.5625vw] flex-col">
      <div className="flex items-center gap-4">
        <h2 className="variant-h2">Work</h2>
        <div className="grid aspect-square size-[70px] place-items-center rounded-full border border-muted">
          <h5 className="variant-h5">13</h5>
        </div>
      </div>
      <h4 className="variant-h4 mt-12 max-w-[20vw]">
        A selection of our crafted work, built from scratch by our talented in-house team.
      </h4>
      <div className="mt-auto">
      <Link href="#">
            <Button variant="outline">Case Studies</Button>
            </Link>
      </div>
    </div>
  )
}

const Ending = () => {
    return (
        <div className="flex flex-col min-w-[32.5625vw] aspect-[1.25] items-center gap-5 justify-center">
            <h2 className="variant-h2">View More</h2>
            <Link href="#">
            <Button variant="outline">Case Studies</Button>
            </Link>
        </div>
    )
}
