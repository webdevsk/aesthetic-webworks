"use client"

import { useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Testimonial, testimonials } from "@/data/data"
import { LoaderCircle } from "lucide-react"
import { motion, MotionValue, useScroll, useTransform } from "motion/react"

export function TestimonialsSection() {
  const target = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: target,
    offset: ["start end", "end start"],
  })
  return (
    <section
      style={{
        backgroundImage:
          "radial-gradient(circle at -30% 21%,hsl(var(--primary)) 0,transparent 30%),radial-gradient(circle at 120% 80%,hsl(var(--primary)) 0,transparent 30%)",
      }}
      className="relative min-h-screen bg-foreground text-background">
      <div className="container max-w-[84.375vw] py-huge">
        <Heading />
        <div ref={target} className="mt-8 space-y-12 relative">
          {testimonials.map((testimonial) => (
            <TestimonialComponent key={testimonial.id} {...testimonial} />
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="container relative flex h-full justify-end pt-[30rem] pb-[16rem]">
          <div className="sticky right-0 h-max top-1/2 -translate-y-1/2">
            <ProgressBar progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Heading() {
  const target = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: target,
    offset: ["start end", "end start"],
  })
  return (
    <motion.div
      ref={target}
      style={{ ["--progress" as string]: scrollYProgress }}
      className="scale-[calc(100%_-_(var(--progress)_*_10%))] space-y-8">
      <h2 className="variant-h2">Client Feedback</h2>
      <div className="flex items-end justify-between gap-4">
        <h4 className="variant-h4">We’re collaborators - We build tight-knit partnerships with our clients.</h4>
        <div className="variant-h4 inline-flex items-center gap-4 text-muted">
          <LoaderCircle className="animate-spin" size={40} />
          <span>Keep scrolling</span>
        </div>
      </div>
    </motion.div>
  )
}

function TestimonialComponent({ id, author: { name, company, image }, content }: Testimonial) {
  const target = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: target,
    offset: ["start end", "start start"],
  })
  return (
    <motion.div
      ref={target}
      style={{ ["--progress" as string]: scrollYProgress }}
      className="scale-[calc(0.8_+_(var(--progress)_*_0.2))] rounded-[32px] bg-transparent p-[4vw] text-background ring-1 ring-[#fff3]">
      <div className="mb-8 mt-10">
        <p className="variant-h2 text-[2vw]">"{content}"</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Avatar className="variant-h5">
            <AvatarImage src={image} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h5 className="variant-h5 text-muted">{name}</h5>
        </div>
        <h4 className="variant-h4 text-primary">{company}</h4>
      </div>
    </motion.div>
  )
}

function ProgressBar({ progress }: { progress: MotionValue<number> })   {
  return (
    <div className="relative w-2 h-[200px] overflow-hidden rounded-full bg-secondary">
      <motion.div style={{ ["--progress" as string]: progress }} className="h-full w-full flex-1 bg-primary translate-y-[calc((var(--progress)_*_100%)_-_100%)]"></motion.div>
    </div>
  )
}
