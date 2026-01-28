"use client";
import React, { useContext } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MenuList from "./MenuList";
import MainHeader from "./MainHeader";
import { MenuContext } from "@/context/MenuContext";

function MainLayout({ children }) {
  const { open, toggleMenu } = useContext(MenuContext);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  const isActive = (link) => pathname === link;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside
        className={`
          sidebar
          transition-all duration-300 z-50
          ${open ? "w-64" : "w-0 overflow-hidden"}
          h-screen sticky top-0 hidden md:flex flex-col
        `}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center pt-2 pb-6 border-b border-white/5">
            <img
              src="/logo.png"
              alt="Logo"
              className={`object-contain rounded-xl transition-all duration-300 ${open ? "h-32 w-auto" : "h-12 w-12"
                }`}
            />
          </div>

          {/* Menu */}
          <nav className="flex-1 mt-4 overflow-y-auto">
            <ul className="space-y-1 px-3">
              {MenuList.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className={`side_menu_item ${isActive(item.link) ? "selected-menu-item" : ""
                      }`}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    {open && <span className="ml-3 text-sm">{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {open && (
        <aside className="sidebar fixed top-0 left-0 w-64 h-screen z-50 flex flex-col md:hidden transition-all duration-300 shadow-2xl">
          <div className="p-4 flex justify-between items-center border-b border-white/5">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto rounded-xl" />
            <button
              onClick={() => toggleMenu(false)}
              className="text-gray-400 hover:text-white text-2xl font-bold p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {MenuList.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className={`side_menu_item ${isActive(item.link) ? "selected-menu-item" : ""
                      }`}
                    onClick={() => toggleMenu(false)}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="ml-3 text-sm">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 bg-white flex flex-col max-h-screen w-full">
        <MainHeader toggleSidebar={toggleMenu} sidebarOpen={open} />
        <div className="flex-1 overflow-y-auto overflow-x-auto p-6 bg-white">
          {children}
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
