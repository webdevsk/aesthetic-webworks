"use client"

import React, { useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Card } from "./ui/card"
import { motion, useScroll, useTransform } from "motion/react"

interface ParallaxImageProps {
  src: string
  alt: string
  className?: string
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({ src, alt, className }) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "0%"])

  return (
    <Card ref={ref} className={cn("relative overflow-hidden p-0 aspect-video", className)}>
      <motion.div style={{ y, ["--progress" as string]: scrollYProgress }} className="relative h-[120%] w-auto object-cover">
        <Image src={src} alt={alt} fill className="pointer-events-none object-cover" />
      </motion.div>
    </Card>
  )
}
