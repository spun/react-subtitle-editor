import { useEffect, useState } from "react";

export type Theme = "system" | "light" | "dark";

/**
 * Use localStorage to store selected theme.
 */
export function useTheme(defaultValue: Theme = "system") {

  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("theme") as Theme | null) ?? defaultValue;
  });

  // Update localStorage whenever theme changes
  useEffect(() => localStorage.setItem("theme", theme), [theme]);

  // Listen for theme changes in other tabs or windows
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      console.log("storage event ", e.key)
      if (e.key === "theme" && e.newValue) {
        console.log("storage event in")
        setTheme(e.newValue as Theme);
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return [theme, setTheme] as const;
}
