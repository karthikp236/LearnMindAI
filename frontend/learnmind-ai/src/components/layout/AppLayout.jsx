import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AppLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex min-h-screen flex-col md:ml-64">
        <Header toggleSidebar={toggleSidebar} />

        <main className="flex-1 bg-slate-50 p-8 transition-colors duration-300 dark:bg-slate-950">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;