import { ParallaxImage } from "@/components/parallax-image"
import { ScrollMarqeue } from "@/components/scroll-marqeue"
import { getTestimonials } from "@/lib/actions"
import { getProjects } from "@/lib/actions"
import { AchievementsSection } from "./_components/achievements-section"
import { EstablishedYearSection } from "./_components/establishedyear-section"
import { HeroSection } from "./_components/hero-section"
import { OurWorksSection } from "./_components/our-works-section"
import { PartnersSection } from "./_components/partners-section"
import { ServicesSection } from "./_components/services-section"
import { TestimonialsSection } from "./_components/testimonials-section"
import { TrustSection } from "./_components/trust-section"
import { WhatWeDoSection } from "./_components/what-we-do-section"

export const dynamic = "force-dynamic"

const Page = async () => {
  const [projectsRes, testimonialsRes] = await Promise.all([getProjects(), getTestimonials()])

  if (!projectsRes.success) {
    console.error(projectsRes.error)
    throw new Error(projectsRes.error)
  }
  if (!testimonialsRes.success) {
    console.error(testimonialsRes.error)
    throw new Error(testimonialsRes.error)
  }
  return (
    <>
      <HeroSection />
      <OurWorksSection projects={projectsRes.data} />
      <WhatWeDoSection />
      <TrustSection />
      <section>
        <div className="container">
          <ParallaxImage className="aspect-[1.75176]" src="/AW_Team_01-800x600.jpg" alt="Dev" />
        </div>
      </section>
      <PartnersSection />
      <ScrollMarqeue className="whitespace-nowrap px-[50dvw] py-huge text-[9.375vw] font-semibold leading-tight">
        Elevate your digital presence
      </ScrollMarqeue>
      <AchievementsSection />
      <EstablishedYearSection />
      <ServicesSection />
      <TestimonialsSection testimonials={testimonialsRes.data} />
    </>
  )
}

export default Page
