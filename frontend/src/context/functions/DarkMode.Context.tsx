import { createContext,  useState } from "react";

type DarkModeContextType = {
  theme: string;
  toggleTheme: ()=> void;
};

const DarkModeContext = createContext<DarkModeContextType | null>(null);

export const DarkModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<string>("light");
  const toggleTheme= () => {
  const newTheme = theme === "light" ? "dark" : "light";
  setTheme(newTheme);
  document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };


  return (
    <DarkModeContext.Provider value={{ theme, toggleTheme}}>
      {children}
    </DarkModeContext.Provider>
  );
};

export { DarkModeContext };
