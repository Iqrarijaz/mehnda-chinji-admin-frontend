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
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside
        className={`
          transition-all duration-300 z-50
          ${open ? "w-64" : "w-20"}
          bg-gray-100 h-screen sticky top-0 hidden md:flex flex-col
        `}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center pt-4">
            <img
              src="/logo.png"
              alt="Logo"
              className={`object-contain rounded-xl transition-all duration-200 ${open ? "h-40 w-auto" : "h-10 w-10"}`}
            />
          </div>

          {/* Menu */}
          <nav className="flex-1 mt-6 overflow-y-auto">
            <ul className="space-y-3">
              {MenuList.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className={`flex items-center p-2 rounded-lg transition-colors ${isActive(item.link)
                      ? "bg-primary text-white"
                      : "hover:bg-primary hover:text-white"
                      }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {open && <span className="ml-3">{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {open && (
        <aside className="fixed top-0 left-0 w-64 h-screen z-50 bg-gray-100 flex flex-col md:hidden transition-all duration-300">
          <div className="p-4 flex justify-between items-center border-b">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto rounded-xl" />
            <button onClick={() => toggleMenu(false)} className="text-lg font-bold">
              ✕
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-3">
              {MenuList.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className={`flex items-center p-2 rounded-lg transition-colors ${isActive(item.link)
                      ? "bg-primary text-white"
                      : "hover:bg-primary hover:text-white"
                      }`}
                    onClick={() => toggleMenu(false)}                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="ml-3">{item.name}</span>
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
