"use client"

import { TextSlideUpByWord } from "@/components/higher-order-text-animate-components"
import { LogoCarousel } from "@/components/ui/logo-carousel"
import { allLogos } from "@/data/logos"

export function PartnersSection() {
  return (
    <section>
      <div className="container py-huge">
        <TextSlideUpByWord as="h2" className="variant-h2 max-w-screen-xl">
          From ambitious startups to global companies, we partner with great businesses and industry leaders.
        </TextSlideUpByWord>

        <LogoCarousel columnCount={5} logos={allLogos} className="mt-huge justify-between" />
      </div>
    </section>
  )
}
