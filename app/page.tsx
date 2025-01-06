import { ParallaxImage } from "@/components/parallax-image"
import { ScrollMarqeue } from "@/components/scroll-marqeue"
import { HeroSection } from "./_components/hero-section"
import { OurWorksSection } from "./_components/our-works-section"
import { PartnersSection } from "./_components/partners-section"
import { TrustSection } from "./_components/trust-section"
import { WhatWeDoSection } from "./_components/what-we-do-section"
import { AchievementsSection } from "./_components/achievements-section"
import { EstablishedYearSection } from "./_components/establishedyear-section"
import { ServicesSection } from "./_components/services-section"

const Page = () => {
  return (
    <>
      <HeroSection />
      <OurWorksSection />
      <WhatWeDoSection />
      <TrustSection />
      <section>
        <div className="container">
          <ParallaxImage className="aspect-[1.75176]" src="/AW_Team_01-800x600.jpg" alt="Dev" />
        </div>
      </section>
      <PartnersSection />
      <ScrollMarqeue className="whitespace-nowrap px-[50dvw] font-semibold leading-tight py-huge text-[9.375vw]">
        Elevate your digital presence
      </ScrollMarqeue>
      <AchievementsSection/>
      <EstablishedYearSection />
      <ServicesSection />
      <div className="h-screen"></div>
    </>
  )
}

export default Page
