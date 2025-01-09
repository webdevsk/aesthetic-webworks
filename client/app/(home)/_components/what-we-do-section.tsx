"use client"

import Image from "next/image"
import { TextSlideUpByLine, TextSlideUpByWord } from "@/components/higher-order-text-animate-components"
import { Badge } from "@/components/ui/badge"
import { categories } from "@/data/data"
import { AnimatePresence, motion } from "motion/react"

export function WhatWeDoSection() {
  return (
    <section className="bg-[#111111] bg-radialToBr text-primary-foreground">
      <div className="container py-[7.5vw]">
        <TextSlideUpByWord as="h5" className="variant-h5 mb-4 overflow-y-hidden">
          Our team of experts can help you with...
        </TextSlideUpByWord>
        <div className="space-y-4">
          {categories.map((category) =>
            !category.topProject ? null : (
              <motion.a
                key={category.id}
                href={`/category/${category.id}`}
                className="flex items-center justify-between gap-4 overflow-hidden"
                initial="initial"
                whileHover="hovered">
                <motion.h2
                  variants={{
                    initial: { scale: 1, transition: { duration: 0.3 } },
                    hovered: { scale: 0.95, transition: { duration: 0.3 } },
                  }}
                  className="variant-h2 origin-left">
                  <TextSlideUpByLine>{category.title}</TextSlideUpByLine>
                </motion.h2>
                <motion.div
                  variants={{
                    initial: { opacity: 0, x: -12, transition: { duration: 0.3 } },
                    hovered: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                  }}
                  className="flex items-center gap-6">
                  <div>
                    <p className="variant-p text-muted">Latest Case Study</p>
                    <h5 className="variant-h5">{category.topProject.title}</h5>
                  </div>
                  <div className="relative size-[72px] overflow-clip rounded-full bg-muted">
                    <Image
                      src="/project-placeholder-image.jpg"
                      alt={category.topProject.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <svg
                    width="48.7295674px"
                    height="34.7295396px"
                    viewBox="0 0 48.7295674 34.7295396"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink">
                    <g id="Symbols" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                      <g
                        id="Element/row/service-link"
                        transform="translate(-1371, -22.6352)"
                        fill="#FFFFFF"
                        fillRule="nonzero">
                        <g id="Group-44" transform="translate(1051, 4)">
                          <path
                            d="M351.286293,18.6352302 L367.358628,34.6352302 L368.729567,36 L367.358628,37.3647698 L351.286293,53.3647698 L348.569038,50.6352302 L361.334,37.9252302 L320,37.9257376 L320,34.0742624 L361.337,34.0742302 L348.569038,21.3647698 L351.286293,18.6352302 Z"
                            id="arrow"></path>
                        </g>
                      </g>
                    </g>
                  </svg>
                </motion.div>
              </motion.a>
            )
          )}
        </div>
        <div className="my-[4rem] h-[1px] w-full bg-[#fff3]"></div>
        <div className="flex items-end justify-between">
          <div className="max-w-xl">
            <TextSlideUpByLine
              as="h2"
              className="variant-h2 mb-8 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Creative Agency
            </TextSlideUpByLine>
            <h5 className="variant-h5">
              We’re an award-winning creative agency based in London, focused on E-Commerce, Web Design London, Digital
              Products, Branding and SEO.
            </h5>
          </div>
          <div className="flex gap-4">
            <Badge size="lg" variant="outline" className="border-primary">
              300+ Projects
            </Badge>
            <Badge size="lg" variant="outline" className="border-primary">
              15 Awards
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}
