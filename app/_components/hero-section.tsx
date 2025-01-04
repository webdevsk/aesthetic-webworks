import { AchievementsBadge } from "./achievements-badge"

export const HeroSection = () => {
  return (
    <section>
      <div className="container flex min-h-screen flex-col gap-y-huge py-huge justify-end">
        <div className="max-w-7xl text-huge/[1.15] font-semibold">
          Crafting{" "}
          <span className="animate-gradientMove bg-gradient-to-r from-primary via-secondary to-primary bg-[length:1600px_100%] bg-clip-text text-transparent">
            Digital
          </span>{" "}
          Experiences
        </div>
        <div className="flex gap-4 items-center">
            <AchievementsBadge />
        </div>
      </div>
    </section>
  )
}
