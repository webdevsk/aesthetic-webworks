"use client"

import { TextSlideUpByWord } from "@/components/higher-order-text-animate-components"
import Counter from "@/components/ui/counter"
import { motion } from "motion/react"

export function AchievementsSection() {
  return (
    <section>
      <div className="container py-huge">
        <div className="flex items-end justify-between gap-8">
          <div>
            <TextSlideUpByWord as="h2" className="variant-h2 max-w-screen-lg">
              Let our experienced team elevate your digital goals
            </TextSlideUpByWord>
            <div className="mt-huge flex items-center gap-16">
              {(
                [
                  [250, "Five-Star Reviews"],
                  [10, "In-House Experts"],
                ] as const
              ).map(([q, d]) => (
                <motion.div
                  key={d}
                  whileInView="visible"
                  viewport={{ once: true }}
                  initial="hidden"
                  transition={{ staggerChildren: 0.1 }}
                  className="space-y-8">
                  <motion.h2
                    variants={{ visible: { translateY: 0 }, hidden: { translateY: 100 } }}
                    transition={{ duration: 0.3 }}
                    className="variant-h2 whitespace-nowrap">
                    <Counter
                      variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
                      value={q}
                      inViewOnce={true}
                    />
                  </motion.h2>
                  <motion.h4
                    variants={{ visible: { opacity: 1, translateY: 0 }, hidden: { opacity: 0, translateY: 100 } }}
                    transition={{ duration: 0.3 }}
                    className="variant-h4 whitespace-nowrap">
                    {d}
                  </motion.h4>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="max-w-[35.625vw]">
            <h4 className="variant-h4">
              We have successfully completed over 300+ projects from a variety of industries. In our team, designers
              work alongside developers and digital strategists, we believe this is our winning recipe for creating
              digital products that make an impact.
            </h4>
          </div>
        </div>
      </div>
    </section>
  )
}
