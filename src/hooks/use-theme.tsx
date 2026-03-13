import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "dark", toggleTheme: () => {} });

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("site-theme") as Theme | null;
      if (stored) return stored;
    }
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    // Only apply light/dark if no consultoria theme is active
    const hasConsultoria = root.classList.contains("theme-consultoria") || root.classList.contains("theme-consultoria-dark");
    if (!hasConsultoria) {
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }
    localStorage.setItem("site-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
