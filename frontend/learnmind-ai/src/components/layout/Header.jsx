import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, User, Menu } from "lucide-react";
import ThemeToggle from "../common/ThemeToggle";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex h-full items-center justify-between px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        <div className="hidden md:block" />

        <div className="flex items-center gap-3">
          <ThemeToggle />

          {/* Notification */}
          <button className="group relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
            <Bell
              size={20}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:scale-110"
            />

            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          {/* User */}
          <div className="flex items-center gap-3 border-l border-slate-200/60 pl-3 dark:border-slate-700">
            <div className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-1.5 transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-800">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white transition-all duration-200 group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                <User size={18} strokeWidth={2.5} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {user?.username || "User"}
                </p>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;