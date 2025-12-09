import { Link, useLocation } from "react-router-dom";
import { Home, Grid3x3, Search, ShoppingCart, User } from "lucide-react";

const Footer = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/categories", icon: Grid3x3, label: "Categories" },
    { path: "/search", icon: Search, label: "Search" },
    { path: "/cart", icon: ShoppingCart, label: "Cart" },
    { path: "/account", icon: User, label: "Account" },
  ];

  return (
    <>
      {/* =========================
          📱 MOBILE NAV (BOTTOM)
      ========================== */}
      <div className="fixed bottom-0 left-0 w-full z-50 md:hidden">
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-xl backdrop-blur-lg">
          <div className="flex justify-around items-center py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex flex-col items-center justify-center 
                    px-3 py-2 rounded-xl transition-all
                    ${active ? "bg-emerald-50 dark:bg-emerald-900/20" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
                  `}
                >
                  <Icon
                    className={`
                      w-6 h-6 mb-1 transition-colors
                      ${active ? "text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-300"}
                    `}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span
                    className={`
                      text-xs font-medium
                      ${active ? "text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-300"}
                    `}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </footer>
      </div>

      {/* =========================
          🖥️ DESKTOP SIDEBAR (LEFT)
      ========================== */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full z-40 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl w-20 lg:w-24 flex-col py-8">

        {/* Logo / Brand */}
        <div className="flex items-center justify-center mb-10">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-md">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 flex flex-col gap-3 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  group relative flex flex-col items-center justify-center 
                  py-4 rounded-xl cursor-pointer transition-all
                  ${active
                    ? "bg-emerald-50 dark:bg-emerald-900/20"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"}
                `}
              >
                <Icon
                  className={`
                    w-6 h-6 transition-colors 
                    ${active 
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"}
                  `}
                  strokeWidth={active ? 2.5 : 2}
                />

                <span
                  className={`
                    text-xs mt-1 font-medium transition-colors
                    ${active 
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-600 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"}
                  `}
                >
                  {item.label}
                </span>

                {/* Active Sidebar Highlight Bar */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-emerald-600 dark:bg-emerald-400 rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Logo */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs font-bold text-center bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
            Grocer
          </p>
        </div>
      </aside>
    </>
  );
};

export default Footer;
