"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { cn } from "@/utils/helper";
import MenuList from "./MenuList";

const Sidebar = React.memo(({ open, setOpen, isMobile }) => {
    const pathname = usePathname();
    const [expandedMenus, setExpandedMenus] = useState({});

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

    const toggleSubmenu = React.useCallback((menuName) => {
        setExpandedMenus(prev => ({ ...prev, [menuName]: !prev[menuName] }));
    }, []);

    const hasPermission = React.useCallback((item) => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            const user = userData?.adminData || userData;
            if (!item.permission) return true;
            if (user?.role === "SUPER_ADMIN") return true;
            return user?.permissions?.includes(item.permission);
        } catch (e) {
            return false;
        }
    }, []);

    const isActive = React.useCallback((link) => pathname === link, [pathname]);
    const isSubMenuActive = React.useCallback((subItems) => subItems?.some(sub => pathname.startsWith(sub.link)), [pathname]);

    const filteredMenu = React.useMemo(() => MenuList.filter(hasPermission), [hasPermission]);

    const renderMenuItem = (item) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedMenus[item.name];
        const active = isActive(item.link) || (hasSubItems && isSubMenuActive(item.subItems));

        if (hasSubItems) {
            return (
                <div key={item.name} className="space-y-1">
                    <button
                        onClick={() => toggleSubmenu(item.name)}
                        className={cn(
                            "flex items-center justify-between w-full px-3 py-2 text-sm font-medium transition-colors rounded-md group",
                            active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <span className={cn("transition-colors", active ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground")}>
                                {item.icon}
                            </span>
                            {open && <span>{item.name}</span>}
                        </div>
                        {open && (
                            <span className="ml-auto">
                                {isExpanded ? <IoChevronUp size={14} /> : <IoChevronDown size={14} />}
                            </span>
                        )}
                    </button>
                    {isExpanded && open && (
                        <div className="pl-9 space-y-1">
                            {item.subItems.filter(hasPermission).map((subItem) => (
                                <Link
                                    key={subItem.name}
                                    href={subItem.link}
                                    className={cn(
                                        "flex items-center py-1.5 text-xs font-medium transition-colors rounded-md",
                                        isActive(subItem.link) ? "text-primary" : "text-muted-foreground hover:text-accent-foreground"
                                    )}
                                >
                                    {subItem.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Link
                key={item.name}
                href={item.link}
                className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors rounded-md group",
                    isActive(item.link) ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
            >
                <span className={cn("transition-colors", isActive(item.link) ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground")}>
                    {item.icon}
                </span>
                {open && <span>{item.name}</span>}
            </Link>
        );
    };

    return (
        <aside
            className={cn(
                "flex flex-col border-r bg-card transition-all duration-300",
                open ? "w-64" : "w-16"
            )}
        >
            <div className="flex items-center h-16 px-4 border-b">
                <Link href="/admin/dashboard" className="flex items-center gap-2 font-bold tracking-tight">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                        R
                    </div>
                    {open && <span className="text-xl">Rehbar</span>}
                </Link>
            </div>
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
                {filteredMenu.map(renderMenuItem)}
            </nav>
            <div className="p-4 border-t">
                <div className={cn("flex items-center gap-3", !open && "justify-center")}>
                    <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0" />
                    {open && (
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium truncate">Admin User</span>
                            <span className="text-xs text-muted-foreground truncate">admin@rehbar.com</span>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
});

export default Sidebar;

