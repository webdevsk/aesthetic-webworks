"use client"

import { LogoCarousel } from "@/components/ui/logo-carousel"
import { allLogos } from "@/data/logos"

export function PartnersSection() {
  return (
    <section>
      <div className="container py-huge">
        <h2 className="variant-h2 max-w-screen-xl">
          From ambitious startups to global companies, we partner with great businesses and industry leaders.
        </h2>

        <LogoCarousel columnCount={5} logos={allLogos} className="mt-huge justify-between" />
      </div>
    </section>
  )
}
