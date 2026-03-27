"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
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
import FilterModal from "./components/FilterModal";

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

    const columnOptions = [
        { label: "Name", value: "name" },
        { label: "Description", value: "description" },
        { label: "Permissions", value: "permissions" },
    ];

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 500 : 0);
    const rolesList = useQuery({
        queryKey: ["rolesList", JSON.stringify(debFilter)],
        queryFn: () => GET_ROLES(debFilter),
        keepPreviousData: true,
        onError: () => toast.error("Failed to fetch roles."),
    });

    const onChange = (data) => setFilters((prev) => ({ ...prev, ...data }));

    return (
        <InnerPageCard title="Roles Management">

            <div className="flex flex-col md:flex-row justify-end mb-3 gap-3 items-center">
                {/* Action Bar (Right) */}
                <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full md:w-auto justify-end">
                    {/* Desktop Search (Visible on Tablet/Desktop) */}
                    <div className="hidden md:block">
                        <SearchInput setFilters={setFilters} className="!max-w-[180px]" />
                    </div>

                    <div className="flex items-center gap-2">
                        <ColumnVisibilityDropdown
                            options={columnOptions}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
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

                    <div className="flex items-center gap-2">
                        <AddButton
                            title="Add New Role"
                            icon={false}
                            onClick={() => setModal({ name: "Add", data: null, state: true })}
                            className="!h-[32px] !rounded !px-4 !text-[10px] font-medium shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                        />
                    </div>
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
