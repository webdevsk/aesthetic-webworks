"use client"

import { useEffect, useState } from "react"
import { Logo } from "./header"
import { AnimatePresence, motion } from "motion/react"

export const waitTime = 2500
export function InitialLoader() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Hide loader after 2.5 seconds
    const timer = setTimeout(() => {
      setShow(false)
    }, waitTime)

    return () => {
      clearTimeout(timer)
      window?.scrollTo({ top: 0, behavior: "instant" })
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ translateX: "0%" }}
          exit={{ translateX: "100%", transition: { duration: 0.7 } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-white">
            <Logo className="max-w-16 fill-white" />
            <motion.div
              className="mt-2 h-1 bg-white"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
