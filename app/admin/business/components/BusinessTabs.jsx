"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";
import { HiRefresh } from "react-icons/hi";
import { FaBuilding, FaTachometerAlt, FaTags, FaBoxOpen, FaClipboardList, FaCog } from "react-icons/fa";

import { useStoreContext } from "@/hooks/useStoreContext";
import StoreSelector from "@/components/InnerPage/StoreSelector";

const tabs = [
    { name: "Businesses", link: "/admin/business", permission: PERMISSIONS.BUSINESSES.READ, icon: <FaBuilding size={14} /> },
    { name: "Dashboard", link: "/admin/business/store-dashboard", permission: PERMISSIONS.STORE.ANALYTICS.READ, icon: <FaTachometerAlt size={14} /> },
    { name: "Categories", link: "/admin/business/store-categories", permission: PERMISSIONS.STORE.CATEGORIES.READ, icon: <FaTags size={14} /> },
    { name: "Products", link: "/admin/business/store-products", permission: PERMISSIONS.STORE.PRODUCTS.READ, icon: <FaBoxOpen size={14} /> },
    { name: "Orders", link: "/admin/business/store-orders", permission: PERMISSIONS.STORE.ORDERS.READ, icon: <FaClipboardList size={14} /> },
    { name: "Settings", link: "/admin/business/store-settings", permission: PERMISSIONS.STORE.ANALYTICS.READ, icon: <FaCog size={14} /> }, // Using analytics perm as generic store perm for now, or you can add STORE.SETTINGS
];

const BusinessTabs = React.memo(({ handleRefresh, isRefreshing }) => {
    const pathname = usePathname();
    const storeContext = useStoreContext();

    const authorizedTabs = tabs.filter(tab => hasPermission(tab.permission));

    if (authorizedTabs.length <= 1) return null; // No need to show tabs if only one is accessible

    const isStoreRoute = pathname.includes("/store-");

    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center min-h-[44px] gap-4 border-b border-gray-100 dark:border-slate-800/80 pb-4 mb-6">
            {/* Tabs List (Left) */}
            <div className="flex items-center gap-1.5 flex-wrap">
                {authorizedTabs.map((tab) => {
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

            {/* Store Selector (Right) */}
            {isStoreRoute && (
                <div className="flex items-center gap-2 pb-2 pr-1 sm:pb-0">
                    <StoreSelector storeContext={storeContext} />
                    {handleRefresh && (
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white transition-all disabled:opacity-50"
                            title="Refresh Data"
                        >
                            <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
});

BusinessTabs.displayName = "BusinessTabs";

export default BusinessTabs;
