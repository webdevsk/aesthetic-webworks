"use client"

import * as React from "react"
import type { ForwardedRef } from "react"
import { createContext, forwardRef, useContext, useState } from "react"
import { cn } from "@/lib/utils"
import * as RadixDialog from "@radix-ui/react-dialog"
import { AnimatePresence, motion } from "motion/react"

const DialogOverlay = motion(RadixDialog.Overlay)
const DialogOpenContext = createContext<boolean>(false)

export function DialogRoot({ children, ...props }: RadixDialog.DialogProps) {
  const [isOpen, setOpen] = useState<boolean>(false)

  return (
    <DialogOpenContext.Provider value={isOpen}>
      <RadixDialog.Root onOpenChange={setOpen} {...props}>
        {children}
      </RadixDialog.Root>
    </DialogOpenContext.Provider>
  )
}

export const DialogTrigger = RadixDialog.Trigger

const startDelay: number = 0.5
const endDelay: number = 0.3
// transition: {when: "beforeChildren"} doesnt work maybe due to Radix components in between motion components
const overlayVariants = {
  closed: { opacity: 0, transition: { duration: 0.5, delay: endDelay } },
  open: { opacity: 1, transition: { duration: startDelay } },
}

const dialogVariants = {
  initial: { opacity: 0, scaleY: 2, y: "-100%" },
  open: {
    opacity: 1,
    scaleY: 1,
    y: 0,
    transition: {
      default: { delay: startDelay, duration: 0.3, staggerChildren: 0.1 },
      scaleY: { delay: 0.3, duration: 0.8 },
    },
  },
  closed: { opacity: 0, transition: { duration: endDelay } },
}

let dialogContainer: HTMLDivElement

function getEnsureDialogContainer() {
  if (!dialogContainer) {
    dialogContainer = document.createElement("div")
    dialogContainer.className = "fixed inset-0 z-[999] grid place-items-center pointer-events-none"
    document.body.append(dialogContainer)
  }

  return dialogContainer
}

function DialogContentCore(
  { children, className, title, ...props }: RadixDialog.DialogContentProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  const isOpen = useContext(DialogOpenContext)

  return (
    <AnimatePresence>
      {isOpen && (
        <RadixDialog.Portal forceMount container={getEnsureDialogContainer()}>
          <RadixDialog.Overlay asChild>
            <motion.div
              variants={overlayVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <RadixDialog.Content forceMount ref={forwardedRef} asChild {...props}>
                <motion.div
                  variants={dialogVariants}
                  initial="initial"
                  animate="open"
                  exit="closed"
                  className={cn(
                    "relative mx-auto flex max-w-[940px] origin-bottom items-center justify-center",
                    className
                  )}>
                  <RadixDialog.Title className="hidden">{title}</RadixDialog.Title>
                  {/* {children} */}
                  <div className="h-[80dvh] w-[940px] overflow-y-auto rounded-[calc(16px_+_16*(100vw_-_576px)/1024)] bg-foreground text-background"></div>
                </motion.div>
              </RadixDialog.Content>
            </motion.div>
          </RadixDialog.Overlay>
        </RadixDialog.Portal>
      )}
    </AnimatePresence>
  )
}

export const DialogContent = forwardRef(DialogContentCore)
