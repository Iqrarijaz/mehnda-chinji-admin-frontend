"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaCog, FaImage, FaUpload } from "react-icons/fa";

const tabs = [
    { name: "System Config", link: "/admin/configurations", icon: <FaCog size={14} /> },
    { name: "App Images", link: "/admin/configurations/app-images", icon: <FaImage size={14} /> },
    { name: "Upload", link: "/admin/configurations/upload", icon: <FaUpload size={14} /> },
];

const ConfigTabs = React.memo(() => {
    const pathname = usePathname();

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center min-h-[44px] gap-4 border-b border-gray-100 dark:border-slate-800/80 pb-4 mb-6">
            {/* Tabs List (Left) */}
            <div className="flex items-center gap-1.5 flex-wrap">
                {tabs.map((tab) => {
                    const isActive = pathname === tab.link;
                    return (
                        <Link
                            key={tab.name}
                            href={tab.link}
                            className={`
                                flex items-center gap-2 px-4 py-2 text-xs rounded-none transition-all duration-200
                                ${isActive
                                    ? "bg-[#006666] dark:bg-teal-600 text-white font-medium"
                                    : "bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 dark:bg-slate-800/50 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 font-medium"
                                }
                            `}
                        >
                            {tab.icon}
                            <span>{tab.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
});

ConfigTabs.displayName = "ConfigTabs";

export default ConfigTabs;
