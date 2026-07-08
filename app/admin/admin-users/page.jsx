"use client";
import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AdminUsersTable from "./components/Table";
import AddAdminUserModal from "./components/AddModal";
import UpdateAdminUserModal from "./components/UpdateModal";
import SearchInput from "@/components/InnerPage/SearchInput";
import AddButton from "@/components/InnerPage/AddButton";
import { GET_ADMIN_USERS, GET_ADMIN_USER_STATUS_COUNTS } from "@/app/api/admin/admin-users";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { FiFilter } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";
import FilterModal from "./components/FilterModal";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminUsers } from "./hooks/useAdminUsers";

export default function AdminUsersPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        limit: 20,
        page: 1,
        search: "",
        status: null,
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["name", "email", "role", "status", "actions"]);

    const columnOptions = React.useMemo(() => [
        { label: "Name", value: "name" },
        { label: "Email", value: "email" },
        { label: "Phone", value: "phone" },
        { label: "Role Type", value: "role" },
        { label: "Status", value: "status" },
    ], []);

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 500 : 0);

    const {
        listQuery: adminUsersList,
        countsQuery,
        isRefreshing,
        handleRefresh
    } = useAdminUsers(debFilter);

    const { data: countsData, isLoading: countsLoading } = countsQuery;

    const counts = countsData?.data || { active: 0, inactive: 0 };

    const statCards = React.useMemo(() => [
        { label: "Active", short: "Act", key: "ACTIVE", count: counts.active, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
        { label: "Inactive", short: "Ina", key: "INACTIVE", count: counts.inactive, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    ], [counts.active, counts.inactive]);

    const onChange = React.useCallback((data) => setFilters((prev) => ({ ...prev, ...data })), []);

    return (
        <InnerPageCard>

            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-start md:items-center">
                {/* Status Count Cards (Left) */}
                <div className="flex gap-2 items-center flex-wrap">
                    {countsLoading ? (
                        Array.from({ length: 2 }).map((_, i) => <StatCardSkeleton key={i} />)
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
                                        page: 1,
                                    }))
                                }
                            />
                        ))
                    )}
                </div>

                {/* Action Bar (Right) */}
                <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full md:w-auto justify-end">
                    {/* Desktop Search (Visible on Tablet/Desktop) */}
                    <div className="hidden md:flex items-center gap-2">
                        <SearchInput
                            setFilters={setFilters}
                            className="!max-w-[180px] !h-[32px] !border-2 !rounded-[2px]"
                        />
                    </div>

                    {/* Right Action Group */}
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
                            className="!h-[32px] !border-2 !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white !rounded-[2px] !text-[10px] font-medium shadow-sm transition-all !px-3"
                        />
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="mobile-filter-btn md:!hidden flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all"
                        title="Filters"
                    >
                        <FiFilter size={16} />
                    </button>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <AdminUsersTable setModal={setModal} adminUsersList={adminUsersList} filters={filters} onChange={onChange} visibleColumns={visibleColumns} />
            </div>

            <AddAdminUserModal modal={modal} setModal={setModal} />
            <UpdateAdminUserModal modal={modal} setModal={setModal} />

            <FilterModal
                open={isFilterModalOpen}
                onCancel={() => setIsFilterModalOpen(false)}
                filters={filters}
                setFilters={setFilters}
            />
        </InnerPageCard>
    );
}
