import { useMode } from "../context/hooks/Theme.Hook";
import { Moon, Sun } from "lucide-react";

const DarkModeToggle = () => {
  
  const { theme, toggleTheme } = useMode();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full transition"
    >
      {/* Sun & Moon Icons */}
      <Sun className="absolute left-1 w-4 h-4 text-yellow-400 transition-opacity duration-300
        ${darkMode ? 'opacity-0' : 'opacity-100'}
      " />

      <Moon className="absolute right-1 w-4 h-4 text-blue-300 transition-opacity duration-300
        ${darkMode ? 'opacity-100' : 'opacity-0'}
      " />

      {/* Slider Circle */}
      <span
        className={`absolute w-6 h-6 bg-white dark:bg-black rounded-full shadow-md transform transition-transform duration-300 ${
          theme==="dark" ? "translate-x-7" : "translate-x-1"
        }`}
      ></span>
    </button>
  );
};

export default DarkModeToggle;
