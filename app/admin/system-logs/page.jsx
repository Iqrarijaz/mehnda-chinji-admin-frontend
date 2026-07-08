"use client";
import React, { useState, useCallback, useMemo } from "react";
import SearchInput from "@/components/InnerPage/SearchInput";
import LogsTable from "./components/Table";
import { GET_SYSTEM_LOGS } from "@/app/api/admin/logs";
import SelectBox from "@/components/SelectBox";
import { useDebounce } from "@/hooks/useDebounce";
import InnerPageCard from "@/components/layout/InnerPageCard";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { HiRefresh } from "react-icons/hi";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useSystemLogs } from "./hooks/useSystemLogs";

const LOG_TYPES = [
    { label: "Error", value: "ERROR" },
    { label: "Success", value: "SUCCESS" },
    { label: "Warning", value: "WARNING" },
    { label: "Info", value: "INFO" },
];

export default function SystemLogsPage() {
    const [filters, setFilters] = useState({
        itemsPerPage: 20,
        currentPage: 1,
        search: null, // Changed from functionName to search for clarity
        type: null,
        onChangeSearch: false,
    });
    const [isRefreshingState, setIsRefreshingState] = useState(false);

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["createdAt", "type", "functionName", "userId", "actions"]);

    const columnOptions = useMemo(() => [
        { label: "Time", value: "createdAt" },
        { label: "Type", value: "type" },
        { label: "Function", value: "functionName" },
        { label: "User ID", value: "userId" },
    ], []);

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);

    const {
        listQuery: logsList,
        isRefreshing,
        handleRefresh
    } = useSystemLogs(debFilter);

    const onChange = useCallback((data) => setFilters((old) => ({ ...old, ...data })), []);

    const handleTypeFilter = useCallback((value) => {
        setFilters((prev) => ({
            ...prev,
            type: value || null,
            currentPage: 1
        }));
    }, []);

    const handleSearch = useCallback((searchValue) => {
        setFilters((prev) => ({
            ...prev,
            search: searchValue || null,
            currentPage: 1,
            onChangeSearch: true
        }));
    }, []);

    const handleRefreshClick = useCallback(async () => {
        await handleRefresh();
    }, [handleRefresh]);

    return (
        <InnerPageCard>
            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-start md:items-center">
                <div className="flex gap-2 items-center flex-wrap">
                    {/* Placeholder for future summary stats if needed */}
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full md:w-auto justify-end">
                    <div className="hidden md:flex items-center gap-2">
                        <SelectBox
                            placeholder="Log Type"
                            allowClear
                            handleChange={handleTypeFilter}
                            width={150}
                            options={LOG_TYPES}
                            className="custom-selectbox"
                            value={filters.type}
                        />
                        <SearchInput
                            setFilters={handleSearch}
                            placeholder="Search Function..."
                            className="!max-w-[180px] !h-[32px] !border-2 !rounded-[2px]"
                            value={filters.search || ''}
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
                            onClick={handleRefreshClick}
                            disabled={isRefreshing}
                            title="Refresh Data"
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Refresh data"
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
                    filters={filters}
                />
            </div>
        </InnerPageCard>
    );
}
