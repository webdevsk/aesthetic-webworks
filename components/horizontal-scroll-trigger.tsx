"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll } from "motion/react"

export const HorizontalScrollTrigger = ({ children }: { children: React.ReactNode }) => {
  const container = useRef<HTMLDivElement>(null)
  const scrollingElement = useRef<HTMLDivElement>(null)
  const [elementWidth, setElementWidth] = useState(0)
  const [elementHeight, setElementHeight] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const { scrollYProgress } = useScroll({
    target: container,
  })

  useEffect(() => {
    // This useEffect is just for re-calculating the width of the element and the container on window resize. Does not correlate with the main logic of the component.
    const handleOnResize = () => {
      setElementWidth((current) => scrollingElement.current?.clientWidth ?? current)
      setElementHeight((current) => scrollingElement.current?.clientHeight ?? current)
      setContainerWidth((current) => scrollingElement.current?.parentElement?.clientWidth ?? current)
    }
    handleOnResize()
    window.addEventListener("resize", handleOnResize)
    return () => {
      window.removeEventListener("resize", handleOnResize)
    }
  }, [scrollingElement])
  
  /**
  - Suppose A is the element which needs to be scrolled in the x axis. In this case its the direct child of motion.div.
  - We need a big container enough to record the scroll and make the element pinned to the screen. So we calculate the width of A and set it as the height of the container. But we need atleast some content to still be visible at the end of the scroll. So we offset it by 1 view portion of the element or we can just use the width of parent element.. 
  - We also need to stop translateX keeping 1 view portion of A. We can either use min max on the translteX itself or we can just trim the width of the element and show the rest using overflow-visible. The later helps us do the calculation easily using just 0% - 100% translate values. (This idea is from the ScrollTrigger feature of GSAP)
  */
  return (
    <section>
      <div
        ref={container}
        style={{
          ["--element-width" as string]: elementWidth + "px",
          ["--element-height" as string]: elementHeight + "px",
          ["--container-width" as string]: containerWidth + "px",
        }}
        className="relative min-h-[--element-height] h-[calc(var(--element-width)_-_var(--container-width))]">
        <div className="sticky left-0 top-0 w-full overflow-clip">
            <motion.div
              ref={scrollingElement}
              style={{ ["--progress" as string]: elementWidth > containerWidth ? scrollYProgress : 0 }}
              className="w-[calc(var(--element-width)_-_var(--container-width))] translate-x-[calc(var(--progress)_*_100%_*_-1)] overflow-x-visible min-w-full">
              {children}
            </motion.div>
        </div>
      </div>
    </section>
  )
}
