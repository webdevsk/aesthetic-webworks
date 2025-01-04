"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"

const achievements: [number, string][] = [
  [500, "Satisfied Customers"],
  [15, "Website Awards"],
  [20, "Years on the market"],
]

const variants = {
  initial: {
    y: 8,
    opacity: 0,
    duration: 0.3,
  },
  animate: {
    y: 0,
    opacity: 1,
    duration: 0.3,
  },
  exit: {
    y: 8,
    opacity: 0,
    duration: 0.5,
  },
}
export const AchievementsBadge = () => {
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAchievementIndex((prev) => (prev === achievements.length - 1 ? 0 : prev + 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative flex items-center gap-6 text-2xl">
      <div className="grid size-[72px] place-items-center overflow-hidden rounded-full bg-black text-white">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentAchievementIndex}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ ease: "easeOut" }}>
            {achievements[currentAchievementIndex][0]}
          </motion.span>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={currentAchievementIndex}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ ease: "easeOut", delay: 0.1 }}
          className="text-muted">
          {achievements[currentAchievementIndex][1]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}
