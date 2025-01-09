"use client"

import { motion } from "framer-motion"

export function EstablishedYearSection() {
  return (
    <section>
      <div className="container relative py-huge">
        <div className="grid place-items-center overflow-hidden">
          <motion.h1
            whileInView={{ translateY: "0%" }}
            style={{ translateY: "25%" }}
            transition={{ duration: 0.3 }}
            viewport={{ once: true }}
            className="variant-h1 max-w-screen-md text-[5.625vw]">
            <span>Crafting digital</span>{" "}
            <span className="ms-[7vw] bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              experiences
            </span>{" "}
            <span>since 2004</span>
          </motion.h1>
        </div>

        <div className="absolute inset-0 -z-10 grid grid-cols-2 bg-[size:40%_center] bg-repeat-round">
          <div
            className="relative bg-cover bg-[position:100%_center] bg-no-repeat"
            style={{ backgroundImage: "url(/section-bg.svg)" }}>
            <div className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-white to-transparent"></div>
          </div>
          <div
            className="relative bg-cover bg-[position:0%_center] bg-no-repeat"
            style={{ backgroundImage: "url(/section-bg.svg)" }}>
            <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r from-transparent to-white"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
