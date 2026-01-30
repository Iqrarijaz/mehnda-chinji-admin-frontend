"use client";
import React, { useContext, useState, useEffect } from "react";
import { Modal } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MenuList from "./MenuList";
import MainHeader from "./MainHeader";
import { MenuContext } from "@/context/MenuContext";

function MainLayout({ children }) {
  const { open, toggleMenu } = useContext(MenuContext);
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
              className={`object-contain rounded transition-all duration-300 ${open ? "h-32 w-auto" : "h-12 w-12"
                }`}
            />
          </div>

          {/* Menu */}
          <nav className="flex-1 mt-4 overflow-y-auto">
            <ul className="space-y-1 px-3">
              {MenuList.filter(item => {
                try {
                  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
                  const user = userData?.adminData || userData;
                  if (!item.permission) return true; // No permission required
                  if (user?.role === "SUPER_ADMIN") return true; // Super Admin sees everything
                  return user?.permissions?.includes(item.permission);
                } catch (e) {
                  return false;
                }
              }).map((item) => (
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

      {/* Mobile Sidebar Modal Popup */}
      <Modal
        open={open && isMobile}
        onCancel={() => toggleMenu(false)}
        footer={null}
        closable={false}
        centered
        width={350}
        styles={{
          content: { padding: 0, backgroundColor: '#0F172A', overflow: 'hidden', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' },
          mask: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.6)' }
        }}
      >
        <div className="flex flex-col h-[75vh] max-h-[600px]">
          <div className="p-6 flex justify-between items-center border-b border-white/10 bg-[#0F172A]">
            <img src="/logo.png" alt="Logo" className="h-10 w-auto rounded brightness-110" />
            <button
              onClick={() => toggleMenu(false)}
              className="text-gray-400 hover:text-white text-xl font-bold p-2 hover:bg-white/5 rounded transition-colors"
            >
              ✕
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 bg-[#0F172A] custom-scrollbar">
            <ul className="space-y-2">
              {MenuList.filter(item => {
                try {
                  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
                  const user = userData?.adminData || userData;
                  if (!item.permission) return true;
                  if (user?.role === "SUPER_ADMIN") return true; // Super Admin sees everything
                  return user?.permissions?.includes(item.permission);
                } catch (e) {
                  return false;
                }
              }).map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.link}
                    className={`side_menu_item !m-0 ${isActive(item.link) ? "selected-menu-item" : ""}`}
                    onClick={() => toggleMenu(false)}
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <span className="ml-4 text-sm font-medium tracking-wide">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-white/5 bg-[#0F172A] text-center">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
              Mehnda Chinji Admin v1.0
            </p>
          </div>
        </div>
      </Modal>

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
