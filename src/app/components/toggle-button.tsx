"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function ToggleButton() {
  const [selected, setSelected] = useState<"about" | "connect">("about")

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="relative flex rounded-full p-1 bg-gray-200"
        style={{ width: "400px", height: "60px" }}
        role="tablist"
        aria-label="Project navigation"
      >
        <motion.div
          className="absolute rounded-full bg-[#B800FF]"
          style={{ width: "50%", height: "52px" }}
          animate={{
            x: selected === "about" ? "2px" : "196px",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />
        <button
          role="tab"
          aria-selected={selected === "about"}
          aria-controls="about-panel"
          className={`relative flex-1 rounded-full py-3 text-lg font-bold transition-colors z-10
            ${selected === "about" ? "text-white" : "text-black"}`}
          onClick={() => setSelected("about")}
        >
          About Project
        </button>
        <button
          role="tab"
          aria-selected={selected === "connect"}
          aria-controls="connect-panel"
          className={`relative flex-1 rounded-full py-3 text-lg font-bold transition-colors z-10
            ${selected === "connect" ? "text-white" : "text-black"}`}
          onClick={() => setSelected("connect")}
        >
          Connect
        </button>
      </div>
    </div>
  )
}