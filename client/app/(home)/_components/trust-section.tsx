"use client"

import { TextSlideUpByLine, TextSlideUpByWord } from "@/components/higher-order-text-animate-components"
import { Card } from "@/components/ui/card"
import { motion } from "motion/react"

const MotionCard = motion.create(Card)

export function TrustSection() {
  return (
    <section>
      <div className="container py-huge">
        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-wrap gap-6">
            <TextSlideUpByWord as="h2" className="variant-h2">
              Your Digital Partner
            </TextSlideUpByWord>
            <TextSlideUpByLine as="h4" className="variant-h4">
              {`We partner with companies of all sizes to solve\ncomplex business challenges and define their digital\nstrategies and objectives that deliver results. We\nhelp bring ideas to life and create brands, websites\n& digital products that work.`}
            </TextSlideUpByLine>
            <div className="mt-huge">
              <div className="flex items-center gap-6">
                <div className="flex items-center -space-x-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="size-[72px] rounded-full bg-black"></div>
                  ))}
                </div>
                <h5 className="variant-h5 text-muted">Brands who've trusted us...</h5>
              </div>
            </div>
          </div>

          <MotionCard
            whileInView="visible"
            initial="hidden"
            transition={{ duration: 0.5, delay: 0.3 }}
            variants={{ visible: { scaleY: 1 }, hidden: { scaleY: 0 } }}
            viewport={{ once: true }}
            className="origin-top">
            <motion.div
              transition={{ delay: 0.9 }}
              variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
              className="flex divide-x-2 p-16">
              {(
                [
                  [20, "Years on the market"],
                  [500, "Satisfied Customers"],
                ] as const
              ).map((item) => (
                <div key={item[1]} className="flex-1 space-y-4 p-[2vw] text-center">
                  <h2 className="variant-h2">{item[0]}</h2>
                  <h4 className="variant-h4 whitespace-nowrap">{item[1]}</h4>
                </div>
              ))}
            </motion.div>
          </MotionCard>
        </div>
      </div>
    </section>
  )
}
