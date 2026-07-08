"use client";
import React, { useState } from "react";
import RolesTable from "./components/Table";
import AddRoleModal from "./components/AddModal";
import UpdateRoleModal from "./components/UpdateModal";
import SearchInput from "@/components/InnerPage/SearchInput";
import AddButton from "@/components/InnerPage/AddButton";
import { GET_ROLES } from "@/app/api/admin/roles";
import { useDebounce } from "@/hooks/useDebounce";
import InnerPageCard from "@/components/layout/InnerPageCard";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { FiFilter } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";
import FilterModal from "./components/FilterModal";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useRoles } from "./hooks/useRoles";

export default function RolesPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        itemsPerPage: 10,
        currentPage: 1,
        search: "",
        sortOrder: -1,
        sortingKey: "_id",
        sortingKey: "_id",
        onChangeSearch: false,
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["name", "description", "permissions", "actions"]);

    const columnOptions = React.useMemo(() => [
        { label: "Role Name", value: "name" },
        { label: "Description", value: "description" },
        { label: "Access Level", value: "permissions" },
    ], []);

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 500 : 0);

    const {
        listQuery: rolesList,
        isRefreshing,
        handleRefresh
    } = useRoles(debFilter);

    const onChange = React.useCallback((data) => setFilters((prev) => ({ ...prev, ...data })), []);

    return (
        <InnerPageCard>

            <div className="flex flex-col md:flex-row justify-end mb-3 gap-3 items-center">
                {/* Action Bar (Right) */}
                <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full md:w-auto justify-end">
                    <div className="hidden md:flex items-center gap-2">
                        <SearchInput
                            setFilters={setFilters}
                            className="!max-w-[180px] !h-[32px] !border-2 !rounded-[2px]"
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
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
                        </button>

                        <AddButton
                            title="Add Role"
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
                <RolesTable setModal={setModal} rolesList={rolesList} filters={filters} onChange={onChange} visibleColumns={visibleColumns} />
            </div>

            <AddRoleModal modal={modal} setModal={setModal} />
            <UpdateRoleModal modal={modal} setModal={setModal} />

            <FilterModal
                open={isFilterModalOpen}
                onCancel={() => setIsFilterModalOpen(false)}
                filters={filters}
                setFilters={setFilters}
            />
        </InnerPageCard>
    );
}
