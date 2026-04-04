"use client";
import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import SearchInput from "@/components/InnerPage/SearchInput";
import LogsTable from "./components/Table";
import { GET_SYSTEM_LOGS } from "@/app/api/admin/logs";
import SelectBox from "@/components/SelectBox";
import { useDebounce } from "@/hooks/useDebounce";
import InnerPageCard from "@/components/layout/InnerPageCard";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { FiFilter } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

const LOG_TYPES = [
    { label: "Error", value: "ERROR" },
    { label: "Success", value: "SUCCESS" },
];

export default function SystemLogsPage() {
    const [filters, setFilters] = useState({
        itemsPerPage: 20,
        currentPage: 1,
        functionName: null,
        type: null,
        onChangeSearch: false,
    });
    const [isRefreshingState, setIsRefreshingState] = useState(false);
    
    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["createdAt", "type", "functionName", "userId", "actions"]);
    
    const columnOptions = [
        { label: "Time", value: "createdAt" },
        { label: "Type", value: "type" },
        { label: "Function", value: "functionName" },
        { label: "User ID", value: "userId" },
    ];

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);

    const {
        listQuery: logsList,
        isRefreshing,
        handleRefresh
    } = useAdminData({
        listQueryKey: [ADMIN_KEYS.LOGS.LIST, JSON.stringify(debFilter)],
        listQueryFn: () => GET_SYSTEM_LOGS(debFilter),
        onListError: "Failed to fetch system logs.",
    });

    const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

    const handleTypeFilter = (value) => {
        setFilters((prev) => ({ ...prev, type: value || null, currentPage: 1 }));
    };

    return (
        <InnerPageCard title="System Logs">
            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-start md:items-center">
                <div className="flex gap-2 items-center flex-wrap">
                    {/* Placeholder for future summary stats if needed */}
                </div>

                <div className="flex gap-2 items-center w-full md:w-auto justify-end">
                    <div className="hidden md:flex items-center gap-3">
                        <SelectBox
                            placeholder="Log Type"
                            allowClear
                            handleChange={handleTypeFilter}
                            width={150}
                            options={LOG_TYPES}
                        />
                        <SearchInput 
                            setFilters={(update) => {
                                const newFilters = typeof update === 'function' ? update(filters) : update;
                                setFilters(prev => ({
                                    ...prev,
                                    functionName: newFilters.search || null,
                                    onChangeSearch: true
                                }));
                            }} 
                            placeholder="Search Function..."
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <ColumnVisibilityDropdown
                            options={columnOptions}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        />

                        {/* Refresh Button */}
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            title="Refresh Data"
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white !rounded shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <LogsTable 
                    logsList={logsList} 
                    onChange={onChange} 
                    visibleColumns={visibleColumns} 
                />
            </div>
        </InnerPageCard>
    );
}
