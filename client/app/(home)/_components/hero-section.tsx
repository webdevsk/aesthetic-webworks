import Link from "next/link"
import { AnimatedButton as Button } from "@/components/ui/animated-button"
import { AchievementsBadge } from "./achievements-badge"

export const HeroSection = () => {
  return (
    <section>
      <div className="container flex min-h-screen flex-col justify-end gap-y-huge py-huge">
        <div className="max-w-7xl text-huge/tight font-semibold">
          Crafting{" "}
          <span className="animate-gradientMove bg-gradient-to-r from-primary via-secondary to-primary bg-[length:1600px_100%] bg-clip-text text-transparent">
            Digital
          </span>{" "}
          Experiences
        </div>
        <div className="flex items-center gap-8">
          <AchievementsBadge />
          <p className="ms-auto max-w-lg text-[28.8px] leading-tight">
            We build engaging websites, brands & innovative e-commerce solutions.
          </p>
          <Link href="/case-studies">
            <Button>Case Studies</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
