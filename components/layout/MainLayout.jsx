"use client"
import React, { useContext, useState, useEffect } from "react";
import { Modal } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import MenuList from "./MenuList";
import { hasPermission } from "@/utils/permissions";
import MainHeader from "./MainHeader";
import { MenuContext } from "@/context/MenuContext";

function MainLayout({ children }) {
  const { open, toggleMenu, isInitialized } = useContext(MenuContext);
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // Using 1024px for tablet/mobile range
      setIsMobile(mobile);
      // Close sidebar by default on mobile if we just switched to it
      if (mobile && open) {
        // We don't necessarily want to force close it if the user just resized,
        // but typically mobile sidebars start closed.
      }
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

  if (!isInitialized) return null; // Avoid hydration mismatch

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] dark:bg-slate-900 relative overflow-hidden transition-colors duration-300">
      {/* Mobile Overlay */}
      {isMobile && open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={() => toggleMenu(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile Slide-in) */}
      <aside
        className={`
          sidebar overflow-y-auto custom-scrollbar
          transition-all duration-300 ease-in-out z-[70]
          ${isMobile
            ? `fixed top-0 left-0 h-screen w-[280px] shadow-2xl transform ${open ? "translate-x-0" : "-translate-x-full"}`
            : `sticky top-0 h-screen flex flex-col ${open ? "w-64 border-r border-white/10 shadow-xl opacity-100" : "w-0 opacity-0 overflow-hidden border-none shadow-none pointer-events-none"}`
          }
        `}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between pt-2 pb-6 border-b border-white/5">
            <div className="flex items-center justify-center flex-1">
              <img
                src="/rehbar_logo_white.png"
                alt="Logo"
                className={`object-contain rounded transition-all duration-300 ${open || isMobile ? "h-20 w-auto" : "h-0 w-0"}`}
              />
            </div>
            {isMobile && (
              <button
                onClick={() => toggleMenu(false)}
                className="text-white/70 hover:text-white p-2"
              >
                ✕
              </button>
            )}
          </div>

          {/* Menu */}
          <nav className="flex-1 mt-4">
            <ul className="space-y-1 px-3">
              {MenuList.filter(hasPermission).map((item) => renderMenuItem(item, isMobile))}
            </ul>
          </nav>

          {/* Footer Info */}
          <div className="p-4 border-t border-white/5 text-center mt-auto">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
              Rehbar Admin v1.0
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-white dark:bg-[#0F172A] flex flex-col max-h-screen w-full overflow-hidden transition-colors duration-300">
        <MainHeader />
        <div className="flex-1 overflow-y-auto overflow-x-auto p-4 md:p-6 bg-white dark:bg-slate-900/50 transition-colors duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}


export default MainLayout;
