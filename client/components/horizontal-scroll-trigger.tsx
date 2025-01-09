"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { motion, useScroll, useSpring } from "motion/react"

export const HorizontalScrollTrigger = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const container = useRef<HTMLDivElement>(null)
  const scrollingElement = useRef<HTMLDivElement>(null)
  const [elementWidth, setElementWidth] = useState(0)
  const [elementHeight, setElementHeight] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const { scrollYProgress } = useScroll({
    target: container,
  })
  const yProgress = useSpring(scrollYProgress, { mass: 0.2 })
  useEffect(() => {
    // This useEffect is just for re-calculating the width of the element and the container on window resize. Does not correlate with the main logic of the component.
    if (!scrollingElement.current) return
    const handleOnResize = () => {
      if (!scrollingElement.current) return
      setElementWidth(scrollingElement.current.scrollWidth)
      setElementHeight(scrollingElement.current.clientHeight)
      // setContainerWidth(scrollingElement.current.parentElement?.clientWidth ?? window.innerWidth)
      setContainerWidth(window.innerWidth)
    }
    window.addEventListener("resize", handleOnResize)
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === scrollingElement.current) handleOnResize()
      }
    })
    // First time
    handleOnResize()
    // Resize when children changes
    resizeObserver.observe(scrollingElement.current)
    return () => {
      window.removeEventListener("resize", handleOnResize)
      resizeObserver.disconnect()
    }
  }, [scrollingElement])

  /**
  - Suppose A is the element which needs to be scrolled in the x axis. In this case its the direct child of motion.div.
  - We need a big container enough to record the scroll and make the element pinned to the screen. So we calculate the width of A and set it as the height of the container. But we need atleast some content to still be visible at the end of the scroll. So we offset it by 1 view portion of the element or we can just use the width of parent element.. 
  */
  return (
    <section>
      <div
        ref={container}
        style={{
          ["--element-width" as string]: elementWidth,
          ["--element-height" as string]: elementHeight,
          ["--container-width" as string]: containerWidth,
        }}
        className="relative h-[max(calc((var(--element-width)_-_var(--container-width))_*_1px),calc(var(--element-height)_*_1px))]">
        <div className="sticky left-0 top-0 overflow-clip">
          <motion.div
            ref={scrollingElement}
            style={{ ["--progress" as string]: elementWidth > containerWidth ? yProgress : 0 }}
            className={cn(
              "w-max min-w-full translate-x-[calc((var(--element-width)_-_var(--container-width))_*_(var(--progress)_*_-1px))]",
              className
            )}>
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
