"use client";
import React, { useState, useCallback } from "react";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import UsersTable from "./components/Table";
import AddUserModal from "./components/AddModal";
import UpdateUserModal from "./components/UpdateModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";

import { StatCardSkeleton } from "@/components/shared/Skeletons";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { FiFilter } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";
import FilterModal from "./components/FilterModal";
import { useUsers } from "./hooks/useUsers";

export default function UsersPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        limit: 20,
        page: 1,
        search: "",
        status: null,
        gender: null,
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["name", "email", "role", "gender", "status", "actions"]);

    const columnOptions = [
        { label: "Name", value: "name" },
        { label: "Email", value: "email" },
        { label: "Role", value: "role" },
        { label: "Gender", value: "gender" },
        { label: "Contact", value: "phone" },
        { label: "Status", value: "status" },
        { label: "City", value: "city" },
        { label: "Village", value: "village" },
        { label: "Created At", value: "createdAt" },
        { label: "Last Activity", value: "lastActivityAt" },
        { label: "App Version", value: "appVersion" },
    ];

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 500 : 0);

    const {
        listQuery: usersList,
        countsQuery,
        isRefreshing,
        handleRefresh
    } = useUsers(debFilter);

    const { data: countsData, isLoading: countsLoading } = countsQuery;

    const counts = React.useMemo(() =>
        countsData?.data || { active: 0, inactive: 0, male: 0, female: 0 },
        [countsData]);

    const statCards = React.useMemo(() => [
        { label: "Active", short: "Act", key: "ACTIVE", count: counts.active, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", field: "status" },
        { label: "Inactive", short: "Ina", key: "INACTIVE", count: counts.inactive, color: "#dc2626", bg: "#fef2f2", border: "#fecaca", field: "status" },
        { label: "Male", short: "Male", key: "MALE", count: counts.male, color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", field: "gender" },
        { label: "Female", short: "Fem", key: "FEMALE", count: counts.female, color: "#db2777", bg: "#fdf2f8", border: "#f9a8d4", field: "gender" },
    ], [counts]);

    const onChange = React.useCallback((data) => setFilters((prev) => ({ ...prev, ...data })), []);

    const handleStatClick = React.useCallback((field, key) => {
        setFilters((prev) => ({
            ...prev,
            [field]: prev[field] === key ? null : key,
            page: 1,
        }));
    }, []);

    return (
        <InnerPageCard className="h-full min-h-0 flex flex-col overflow-hidden">

            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-start md:items-center">
                {/* Status Count Cards (Left) */}
                <div className="flex gap-2 items-center flex-wrap">
                    {countsLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
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
                                active={filters[card.field] === card.key}
                                onClick={() => handleStatClick(card.field, card.key)}
                            />
                        ))
                    )}
                </div>

                {/* Action Bar (Right) */}
                <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full md:w-auto justify-end">
                    {/* Desktop Search (Visible on Tablet/Desktop) */}
                    <div className="hidden md:flex items-center gap-2">
                        <SearchInput setFilters={setFilters} className="!max-w-[180px]" />
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
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
                        </button>

                        <AddButton
                            title="Add User"
                            icon={false}
                            onClick={() => setModal({ name: "Add", data: null, state: true })}
                            className="!h-[32px] !rounded !px-4 !text-[10px] font-medium shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                        />
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="mobile-filter-btn md:!hidden flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666]"
                        title="Filters"
                    >
                        <FiFilter size={18} />
                    </button>
                </div>
            </div>


            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <UsersTable modal={modal} setModal={setModal} usersList={usersList} onChange={onChange} setFilters={setFilters} visibleColumns={visibleColumns} />
            </div>

            <AddUserModal modal={modal} setModal={setModal} />
            <UpdateUserModal modal={modal} setModal={setModal} />
            <ResetPasswordModal modal={modal} setModal={setModal} />

            <FilterModal
                open={isFilterModalOpen}
                onCancel={() => setIsFilterModalOpen(false)}
                filters={filters}
                setFilters={setFilters}
            />
        </InnerPageCard>
    );
}
