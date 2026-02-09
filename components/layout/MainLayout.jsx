"use client";
import React, { useContext, useState, useEffect } from "react";
import { Modal } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import MenuList from "./MenuList";
import MainHeader from "./MainHeader";
import { MenuContext } from "@/context/MenuContext";

function MainLayout({ children }) {
  const { open, toggleMenu } = useContext(MenuContext);
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-expand menu if current path matches a submenu item
  useEffect(() => {
    MenuList.forEach((item) => {
      if (item.subItems) {
        const hasActiveSubItem = item.subItems.some(sub => pathname.startsWith(sub.link));
        if (hasActiveSubItem) {
          setExpandedMenus(prev => ({ ...prev, [item.name]: true }));
        }
      }
    });
  }, [pathname]);

  const isActive = (link) => pathname === link;
  const isSubMenuActive = (subItems) => subItems?.some(sub => pathname.startsWith(sub.link));

  const toggleSubmenu = (menuName) => {
    setExpandedMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const hasPermission = (item) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const user = userData?.adminData || userData;
      if (!item.permission) return true;
      if (user?.role === "SUPER_ADMIN") return true;
      return user?.permissions?.includes(item.permission);
    } catch (e) {
      return false;
    }
  };

  const renderMenuItem = (item, isMobileView = false) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedMenus[item.name];
    const isActiveParent = hasSubItems && isSubMenuActive(item.subItems);

    if (hasSubItems) {
      return (
        <li key={item.name}>
          <button
            onClick={() => toggleSubmenu(item.name)}
            className={`side_menu_item w-full justify-between ${isActiveParent ? "selected-menu-item" : ""}`}
          >
            <div className="flex items-center">
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {(open || isMobileView) && <span className={`${isMobileView ? 'ml-4' : 'ml-3'} text-sm`}>{item.name}</span>}
            </div>
            {(open || isMobileView) && (
              <span className="text-sm">
                {isExpanded ? <IoChevronUp size={16} /> : <IoChevronDown size={16} />}
              </span>
            )}
          </button>

          {/* Submenu */}
          {isExpanded && (open || isMobileView) && (
            <ul className="mt-1 ml-6 space-y-1">
              {item.subItems.filter(hasPermission).map((subItem) => (
                <li key={subItem.name}>
                  <Link
                    href={subItem.link}
                    className={`side_menu_item !py-2 ${isActive(subItem.link) ? "selected-menu-item" : ""}`}
                    onClick={isMobileView ? () => toggleMenu(false) : undefined}
                  >
                    <span className="text-md flex-shrink-0">{subItem.icon}</span>
                    <span className={`${isMobileView ? 'ml-4' : 'ml-3'} text-xs`}>{subItem.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    }

    return (
      <li key={item.name}>
        <Link
          href={item.link}
          className={`side_menu_item ${isMobileView ? '!m-0' : ''} ${isActive(item.link) ? "selected-menu-item" : ""}`}
          onClick={isMobileView ? () => toggleMenu(false) : undefined}
        >
          <span className={`${isMobileView ? 'text-xl' : 'text-lg'} flex-shrink-0`}>{item.icon}</span>
          {(open || isMobileView) && (
            <span className={`${isMobileView ? 'ml-4 font-medium tracking-wide' : 'ml-3'} text-sm`}>{item.name}</span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside
        className={`
          sidebar overflow-y-auto custom-scrollbar
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
          <nav className="flex-1 mt-4 ">
            <ul className="space-y-1 px-3">
              {MenuList.filter(hasPermission).map((item) => renderMenuItem(item, false))}
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
              {MenuList.filter(hasPermission).map((item) => renderMenuItem(item, true))}
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
