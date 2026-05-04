"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ConfigTabs = () => {
    const pathname = usePathname();

    const tabs = [
        { name: "System Config", link: "/admin/configurations" },
        { name: "App Images", link: "/admin/configurations/app-images" },
        { name: "Upload", link: "/admin/configurations/upload" },
    ];

    return (
        <div className="flex items-center gap-1 border-b border-gray-200 dark:border-slate-800 mb-6">
            {tabs.map((tab) => {
                const isActive = pathname === tab.link;
                return (
                    <Link
                        key={tab.name}
                        href={tab.link}
                        className={`
                            relative px-6 py-3 text-sm font-medium transition-all duration-300
                            ${isActive
                                ? "text-primary"
                                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                            }
                        `}
                    >
                        {tab.name}
                        {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(0,102,102,0.3)]" />
                        )}
                    </Link>
                );
            })}
        </div>
    );
};

export default ConfigTabs;
