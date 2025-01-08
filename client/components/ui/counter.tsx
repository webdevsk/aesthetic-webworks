import { useEffect, useRef } from "react"
import { HTMLMotionProps, motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react"

/**
 *
 * @param root0
 * @param root0.value
 */

type Props = {
  value: number
  direction?: "up" | "down"
  className?: string
  inViewOnce?: boolean
} & Omit<HTMLMotionProps<"span">, "ref">

export default function Counter({ value, direction = "up", inViewOnce = false, className, ...props }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : 0)
  const springValue = useSpring(motionValue, {
    damping: 100,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: inViewOnce, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      motionValue.set(direction === "down" ? 0 : value)
    } else {
      motionValue.set(direction === "down" ? value : 0)
    }
  }, [motionValue, isInView, direction, value])

  const finalValue = useTransform(springValue, (latest) => Intl.NumberFormat("en-US").format(Number(latest.toFixed(0))))

  return (
    <motion.span className={className} ref={ref} {...props}>
      {finalValue}
    </motion.span>
  )
}
