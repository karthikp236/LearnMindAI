import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  BrainCircuit,
  BookOpen,
  X,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    {
      to: "/dashboard",
      icon: LayoutDashboard,
      text: "Dashboard",
    },
    {
      to: "/documents",
      icon: FileText,
      text: "Documents",
    },
    {
      to: "/flashcards",
      icon: BookOpen,
      text: "Flashcards",
    },
    {
      to: "/profile",
      icon: User,
      text: "Profile",
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 md:hidden ${
          isSidebarOpen
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={toggleSidebar}
      />

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 transform border-r border-slate-200/60 bg-white/90 backdrop-blur-lg transition-all duration-300 dark:border-slate-800 dark:bg-slate-900/90 md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200/60 px-6 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/25">
              <BrainCircuit
                className="text-white"
                size={20}
                strokeWidth={2.5}
              />
            </div>

            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              LearnMind AI
            </h1>
          </div>

          <button
            onClick={toggleSidebar}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={toggleSidebar}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    size={18}
                    strokeWidth={2.5}
                    className={`transition-transform duration-200 ${
                      isActive ? "" : "group-hover:scale-110"
                    }`}
                  />
                  <span>{link.text}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200/60 p-4 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <LogOut
              size={18}
              strokeWidth={2.5}
              className="transition-transform duration-200 group-hover:-translate-x-1"
            />

            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;