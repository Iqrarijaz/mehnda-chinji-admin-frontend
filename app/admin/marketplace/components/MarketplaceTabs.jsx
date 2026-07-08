"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";
import { FaBoxOpen, FaStore, FaTag, FaUsers } from "react-icons/fa";

const tabs = [
    {
        name: "Marketplace Listings",
        link: "/admin/marketplace",
        permission: PERMISSIONS.MARKETPLACE?.READ || PERMISSIONS.BUSINESSES?.READ,
        icon: <FaBoxOpen size={14} />
    },
    // Add more tabs here if needed
    // Example:
    // { 
    //     name: "Categories", 
    //     link: "/admin/marketplace/categories", 
    //     permission: PERMISSIONS.MARKETPLACE?.READ, 
    //     icon: <FaTag size={14} /> 
    // },
];

const MarketplaceTabs = React.memo(() => {
    const pathname = usePathname();

    const authorizedTabs = useMemo(() => {
        return tabs.filter(tab => {
            // Check if permission exists and user has it
            if (!tab.permission) return true; // Show if no permission required
            return hasPermission(tab.permission);
        });
    }, []);

    // If no tabs are authorized, return null
    if (authorizedTabs.length === 0) return null;

    // If only one tab is authorized, still render it for UI consistency
    const isSingleTab = authorizedTabs.length === 1;

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center min-h-[44px] gap-4 border-b border-gray-100 dark:border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-1.5 flex-wrap w-full">
                {authorizedTabs.map((tab) => {
                    const isActive = pathname === tab.link;

                    return (
                        <Link
                            key={tab.name}
                            href={tab.link}
                            className={`
                                flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md transition-all duration-200
                                ${isActive
                                    ? 'bg-[#006666] text-white shadow-md hover:bg-[#005555]'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#006666] dark:hover:text-teal-400'
                                }
                                ${isSingleTab ? 'w-full justify-center' : ''}
                            `}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <span className="flex items-center gap-2">
                                <span className={`${isActive ? 'text-white' : 'text-[#006666] dark:text-teal-500'}`}>
                                    {tab.icon}
                                </span>
                                {tab.name}
                            </span>
                            {isActive && (
                                <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-white rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>

            {/* Optional: Add extra actions here */}
            {!isSingleTab && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{authorizedTabs.length} tabs available</span>
                </div>
            )}
        </div>
    );
});

MarketplaceTabs.displayName = "MarketplaceTabs";

export default MarketplaceTabs;
