"use client"

import { BlockSlideUp } from "@/components/higher-order-block-animate-components"
import { TextSlideUpByLine, TextSlideUpByWord } from "@/components/higher-order-text-animate-components"
import { AnimatedLink } from "@/components/ui/animated-button"
import { AchievementsBadge } from "./achievements-badge"

export const HeroSection = () => {
  return (
    <section>
      <div className="container flex min-h-screen flex-col justify-end gap-y-huge py-huge">
        <div className="max-w-7xl text-huge/tight font-semibold">
          <TextSlideUpByWord
            delay={1}
            staggerChildren={0.1}
            segmentClassName={(segment) =>
              segment === "Digital"
                ? "animate-gradientMove bg-gradient-to-r from-primary via-secondary to-primary bg-[length:1600px_100%] bg-clip-text text-transparent"
                : ""
            }>
            Crafting Digital Experiences
          </TextSlideUpByWord>
        </div>
        <div className="flex items-center gap-8">
          <BlockSlideUp transition={{ delay: 1, duration: 0.3 }}>
            <AchievementsBadge />
          </BlockSlideUp>
          <BlockSlideUp containerClassName="ms-auto max-w-lg" transition={{ delay: 1, duration: 0.3 }}>
            <p className="text-[28.8px] leading-tight">
              We build engaging websites, brands & innovative e-commerce solutions.
            </p>
          </BlockSlideUp>
          <BlockSlideUp transition={{ delay: 1, duration: 0.3 }}>
            <AnimatedLink href="#">Case Studies</AnimatedLink>
          </BlockSlideUp>
        </div>
      </div>
    </section>
  )
}
