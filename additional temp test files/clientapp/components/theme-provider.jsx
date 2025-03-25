"use client"

import { createContext, useContext, useEffect, useState } from "react"

// Create a context for theme
const ThemeContext = createContext({
  theme: "light",
  setTheme: () => null,
})

export function ThemeProvider({ children, defaultTheme = "light", storageKey = "theme", ...props }) {
  const [theme, setTheme] = useState(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      // Try to get theme from localStorage
      const storedTheme = localStorage.getItem(storageKey)
      return storedTheme || defaultTheme
    }
    return defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement

    // Remove old theme class
    root.classList.remove("light", "dark")

    // Add new theme class
    root.classList.add(theme)

    // Save theme to localStorage
    if (storageKey) {
      localStorage.setItem(storageKey, theme)
    }
  }, [theme, storageKey])

  const value = {
    theme,
    setTheme: (newTheme) => setTheme(newTheme),
  }

  return (
    <ThemeContext.Provider value={value} {...props}>
      {children}
    </ThemeContext.Provider>
  )
}

// Hook to use the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

