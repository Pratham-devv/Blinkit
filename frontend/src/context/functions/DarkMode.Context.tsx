import {
  createContext,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";

type DarkModeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(
  undefined
);

export const DarkModeProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [theme, setTheme] = useState<Theme>("light");

  // ✅ Apply theme to <html>
  const applyTheme = (theme: Theme) => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  };

  // ✅ Load theme on first render
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;

    if (storedTheme) {
      setTheme(storedTheme);
      applyTheme(storedTheme);
    } else {
      // Respect system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      const systemTheme: Theme = prefersDark ? "dark" : "light";
      setTheme(systemTheme);
      applyTheme(systemTheme);
      localStorage.setItem("theme", systemTheme);
    }
  }, []);

  // ✅ Toggle theme
  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme: Theme = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", nextTheme);
      applyTheme(nextTheme);
      return nextTheme;
    });
  };

  return (
    <DarkModeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </DarkModeContext.Provider>
  );
};
export { DarkModeContext };
