"use client";
import React from "react";
import { AppstoreOutlined, AppstoreAddOutlined, ToolOutlined } from "@ant-design/icons";
import { FaLayerGroup } from "react-icons/fa";

export const StatsOverview = React.memo(({ stats, configData }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border-0 shadow-sm flex items-center justify-between">
                <div>
                    <span className="text-[11px] text-slate-500 font-medium">Explore Categories</span>
                    <p className="text-base font-bold text-slate-800 dark:text-slate-100 m-0">
                        {stats.activeCategories} / {configData.categories.length} <span className="text-xs text-teal-600 font-normal">Active</span>
                    </p>
                </div>
                <AppstoreOutlined className="text-teal-500 text-lg opacity-80" />
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border-0 shadow-sm flex items-center justify-between">
                <div>
                    <span className="text-[11px] text-slate-500 font-medium">More Categories</span>
                    <p className="text-base font-bold text-slate-800 dark:text-slate-100 m-0">
                        {stats.activeMore} / {configData.moreCategories.length} <span className="text-xs text-teal-600 font-normal">Active</span>
                    </p>
                </div>
                <AppstoreAddOutlined className="text-teal-500 text-lg opacity-80" />
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border-0 shadow-sm flex items-center justify-between">
                <div>
                    <span className="text-[11px] text-slate-500 font-medium">Utility Groups</span>
                    <p className="text-base font-bold text-slate-800 dark:text-slate-100 m-0">
                        {stats.activeGroups} / {stats.totalGroups} <span className="text-xs text-teal-600 font-normal">Active</span>
                    </p>
                </div>
                <FaLayerGroup className="text-teal-500 text-base opacity-80" />
            </div>

            <div className="p-3.5 bg-white dark:bg-slate-900/60 rounded-xl border-0 shadow-sm flex items-center justify-between">
                <div>
                    <span className="text-[11px] text-slate-500 font-medium">Utility Items</span>
                    <p className="text-base font-bold text-slate-800 dark:text-slate-100 m-0">
                        {stats.activeUtilItems} / {stats.totalUtilItems} <span className="text-xs text-teal-600 font-normal">Active</span>
                    </p>
                </div>
                <ToolOutlined className="text-teal-500 text-lg opacity-80" />
            </div>
        </div>
    );
});

StatsOverview.displayName = "StatsOverview";
