"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
// import { Slot } from "@radix-ui/react-slot"
import { type VariantProps, cva } from "class-variance-authority"
import { HTMLMotionProps, motion, useAnimate } from "motion/react"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-2xl font-medium transition-shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground ring-0 outline-none border-0 hover:ring-4 ring-primary",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-primary",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "bg-white text-card-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "px-12 py-6",
        sm: "py-5 px-10",
        lg: "h-10 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export type ButtonProps = HTMLMotionProps<"button"> & VariantProps<typeof buttonVariants>

const AnimatedButton = ({ className, variant, size, ref, children, ...props }: ButtonProps) => {
  const [scope, animate] = useAnimate()
  return (
    <motion.button
      onHoverStart={() => {
        animate(
          scope.current,
          {
            y: [0, -72, 72, 0],
            scaleY: [1, 1.2, 1.2, 1],
          },
          {
            duration: 0.5,
            times: [0, 0.5, 0.5, 1],
            ease: ["easeIn", "linear", "linear", "easeOut"],
          }
        )
      }}
      className={cn(buttonVariants({ variant, size, className }), "overflow-y-hidden")}
      ref={ref}
      {...props}>
      <motion.span ref={scope}>{children}</motion.span>
    </motion.button>
  )
}

AnimatedButton.displayName = "AnimatedButton"

const MotionLink = motion.create(Link)
export type LinkProps = React.ComponentProps<typeof MotionLink> & VariantProps<typeof buttonVariants>

const AnimatedLink = ({ className, variant, size, ref, children, ...props }: LinkProps) => {
  const [scope, animate] = useAnimate()
  return (
    <MotionLink
      onHoverStart={() => {
        animate(
          scope.current,
          {
            y: [0, -72, 72, 0],
            scaleY: [1, 1.2, 1.2, 1],
          },
          {
            duration: 0.5,
            times: [0, 0.5, 0.5, 1],
            ease: ["easeIn", "linear", "linear", "easeOut"],
          }
        )
      }}
      className={cn(buttonVariants({ variant, size, className }), "overflow-y-hidden")}
      ref={ref}
      {...props}>
      <motion.span ref={scope}>{children}</motion.span>
    </MotionLink>
  )
}

AnimatedLink.displayName = "AnimatedLink"

export { AnimatedButton, AnimatedLink, buttonVariants }
