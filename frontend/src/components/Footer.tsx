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
      {/* Mobile Bottom Navigation */}
      <div className="fixed w-full bottom-0 left-0 z-50 md:hidden">
        <footer className="bg-white border-t border-gray-200 shadow-lg">
          <div className="flex justify-around items-center py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all ${
                    active ? "bg-emerald-50" : "hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 mb-1 transition-colors ${
                      active ? "text-emerald-600" : "text-gray-600"
                    }`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span
                    className={`text-xs font-medium ${
                      active ? "text-emerald-600" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </footer>
      </div>

      {/* Desktop Left Sidebar Navigation */}
      <div className="hidden md:block fixed left-0 top-0 h-full z-50">
        <nav className="bg-white border-r border-gray-200 shadow-lg h-full flex flex-col py-8 w-20 lg:w-24">
          {/* Logo/Brand Section */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 flex flex-col gap-2 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative flex flex-col items-center justify-center py-4 rounded-xl transition-all ${
                    active
                      ? "bg-emerald-50 text-emerald-600"
                      : "hover:bg-gray-50 text-gray-600"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      active ? "text-emerald-600" : "text-gray-600 group-hover:text-emerald-600"
                    }`}
                    strokeWidth={active ? 2.5 : 2}
                  />
                  <span
                    className={`text-xs font-medium mt-1 ${
                      active ? "text-emerald-600" : "text-gray-600 group-hover:text-emerald-600"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Active Indicator */}
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-600 rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Bottom Section - Optional branding */}
          <div className="px-3 py-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                Grocer
              </p>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Footer;