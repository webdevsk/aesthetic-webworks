"use client"

import { cn } from "@/lib/utils"
import { HTMLMotionProps, motion } from "motion/react"

export function BlockSlideUp({
  whileInView = { translateY: "0%", opacity: 1 },
  transition = { delay: 0.6, duration: 0.3 },
  viewport = { once: true },
  style = { translateY: "50%", opacity: 0 },
  containerClassName,
  ...props
}: HTMLMotionProps<"div"> & { containerClassName?: string }) {
  return (
    <div className={cn("-m-4 overflow-clip p-4", containerClassName)}>
      <motion.div whileInView={whileInView} transition={transition} viewport={viewport} style={style} {...props} />
    </div>
  )
}
