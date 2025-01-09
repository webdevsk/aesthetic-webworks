"use client"

import Link from "next/link"
import { TextSlideUpByText, TextSlideUpByWord } from "@/components/higher-order-text-animate-components"
import { AnimatedButton as Button } from "@/components/ui/animated-button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { motion } from "motion/react"

const MotionCard = motion.create(Card)

export function ServicesSection() {
  return (
    <section className="container py-huge">
      <TextSlideUpByWord as="h2" className="variant-h2">
        We’re good at
      </TextSlideUpByWord>
      <div className="grid grid-cols-[1fr_50.75vw] items-end">
        <div>
          <div className="mt-6 space-y-4">
            <p>Services</p>
            {[
              "E-Commerce",
              "Website Design",
              "Web Development",
              "Digital Products",
              "Brand Identities",
              "SEO Optimisation",
            ].map((item) => (
              <Link href={`/services/#`} key={item} className="variant-h3 block overflow-hidden text-[2vw]">
                <TextSlideUpByText>{item}</TextSlideUpByText>
              </Link>
            ))}
          </div>
        </div>
        <MotionCard
          whileInView="visible"
          initial="hidden"
          transition={{ duration: 0.5, delay: 0.3 }}
          variants={{ visible: { scaleY: 1 }, hidden: { scaleY: 0 } }}
          viewport={{ once: true }}
          className="origin-top bg-primary p-0 text-primary-foreground">
          <motion.div
            transition={{ delay: 0.9 }}
            variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
            className="p-16">
            <h3 className="variant-h3">
              Let's start with a conversation about how we can help you! Get in touch, we're a nice bunch.
            </h3>
            <div className="mt-8 flex items-center gap-4">
              <Button variant="ghost" className="py-4">
                Let's talk
              </Button>
              <Badge size="lg" variant="outline" className="border-current py-4">
                999999999
              </Badge>
            </div>
          </motion.div>
        </MotionCard>
      </div>
    </section>
  )
}
