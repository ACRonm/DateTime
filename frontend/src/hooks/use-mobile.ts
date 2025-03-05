"use client"

import { useEffect, useState } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }
      
      // Set initial value
      checkIfMobile()
      
      // Add event listener
      window.addEventListener("resize", checkIfMobile)
      
      // Clean up
      return () => window.removeEventListener("resize", checkIfMobile)
    }
    
    return undefined
  }, [])
  
  return isMobile
}
