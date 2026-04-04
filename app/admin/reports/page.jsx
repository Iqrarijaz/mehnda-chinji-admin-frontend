"use client";
import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import SearchInput from "@/components/InnerPage/SearchInput";
import AddButton from "@/components/InnerPage/AddButton";
import ReportsTable from "./components/Table";
import { GET_REPORTS, GET_REPORT_STATUS_COUNTS } from "@/app/api/admin/reports";
import SelectBox from "@/components/SelectBox";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { FiFilter } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";
import FilterModal from "./components/FilterModal";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

const TARGET_TYPES = [
    { label: "Business", value: "BUSINESS" },
    { label: "Donor", value: "DONOR" },
    { label: "Place", value: "PLACE" },
];

export default function ReportsPage() {
    const [filters, setFilters] = useState({
        itemsPerPage: 20,
        currentPage: 1,
        search: null,
        targetType: null,
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
        status: null,
    });
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["reporter", "targetType", "reason", "description", "status", "createdAt", "actions"]);

    const columnOptions = [
        { label: "Reporter", value: "reporter" },
        { label: "Target Type", value: "targetType" },
        { label: "Reason", value: "reason" },
        { label: "Description", value: "description" },
        { label: "Status", value: "status" },
        { label: "Created At", value: "createdAt" },
    ];

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);

    const {
        listQuery: reportsList,
        countsQuery,
        isRefreshing,
        handleRefresh
    } = useAdminData({
        listQueryKey: [ADMIN_KEYS.REPORTS.LIST, JSON.stringify(debFilter)],
        listQueryFn: () => GET_REPORTS(debFilter),
        countsQueryKey: [ADMIN_KEYS.REPORTS.COUNTS],
        countsQueryFn: GET_REPORT_STATUS_COUNTS,
        onListError: "Failed to fetch reports.",
    });

    const { data: countsData, isLoading: countsLoading } = countsQuery;

    const counts = countsData?.data || { pending: 0, reviewed: 0, resolved: 0 };

    const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

    const handleTargetTypeFilter = (value) => {
        setFilters((prev) => ({ ...prev, targetType: value || null, currentPage: 1 }));
    };

    const statCards = [
        { label: "Pending", short: "Pen", key: "PENDING", count: counts.pending, color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
        { label: "Reviewed", short: "Rev", key: "REVIEWED", count: counts.reviewed, color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
        { label: "Resolved", short: "Res", key: "RESOLVED", count: counts.resolved, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    ];

    return (
        <InnerPageCard title="Reports">

            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-start md:items-center">
                {/* Status Count Cards (Left) */}
                <div className="flex gap-2 items-center flex-wrap">
                    {countsLoading ? (
                        Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
                    ) : (
                        statCards.map((card) => (
                            <StatCard
                                key={card.key}
                                title={card.label}
                                shortTitle={card.short}
                                count={card.count}
                                color={card.color}
                                bg={card.bg}
                                border={card.border}
                                active={filters.status === card.key}
                                onClick={() =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        status: prev.status === card.key ? null : card.key,
                                        currentPage: 1,
                                    }))
                                }
                            />
                        ))
                    )}
                </div>

                {/* Action Bar (Right) */}
                <div className="flex gap-2 items-center w-full md:w-auto justify-end">
                    {/* Desktop Filters (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-2">
                        <SelectBox
                            placeholder="Target Type"
                            allowClear
                            handleChange={handleTargetTypeFilter}
                            width={130}
                            options={TARGET_TYPES}
                            className="custom-selectbox dark:!bg-slate-900 dark:!border-slate-800 mt-1"
                        />
                        <SearchInput setFilters={setFilters} className="w-[180px]" />
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

                        <AddButton
                            title="Create Report"
                            icon={false}
                            onClick={() => setModal({ name: "Add", data: null, state: true })}
                            className="!h-[32px] !rounded !px-4 !text-[10px] font-medium shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                        />
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setIsFilterModalOpen(true)}
                            className="mobile-filter-btn md:hidden"
                            title="Filters"
                        >
                            <FiFilter size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <ReportsTable
                    reportsList={reportsList}
                    onChange={onChange}
                    visibleColumns={visibleColumns}
                    setFilters={setFilters}
                    setModal={setModal}
                />
            </div>

            <FilterModal
                open={isFilterModalOpen}
                onCancel={() => setIsFilterModalOpen(false)}
                filters={filters}
                setFilters={setFilters}
            />
        </InnerPageCard>
    );
}
