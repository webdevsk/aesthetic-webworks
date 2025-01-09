"use client"

import { TextSlideUpByLine } from "@/components/higher-order-text-animate-components"

export function EstablishedYearSection() {
  return (
    <section>
      <div className="container relative py-huge">
        <div className="grid place-items-center overflow-hidden">
          <TextSlideUpByLine
            className="variant-h1 max-w-screen-md text-[5.625vw]"
            segmentClassName={(segment) =>
              segment === "experiences"
                ? "ms-[7vw] bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                : ""
            }>
            {"Crafting digital\nexperiences\nsince 2004"}
          </TextSlideUpByLine>
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
