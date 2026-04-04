"use client";
import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import SearchInput from "@/components/InnerPage/SearchInput";
import BloodDonorsTable from "./components/Table";
import AddDonorModal from "./components/AddModal";
import UpdateDonorModal from "./components/UpdateModal";
import SelectBox from "@/components/SelectBox";
import FilterModal from "./components/FilterModal";
import { FaFilter } from "react-icons/fa";
import { GET_BLOOD_DONORS, GET_BLOOD_DONOR_STATUS_COUNTS } from "@/app/api/admin/blood-donors";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { FiFilter } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";
import AddButton from "@/components/InnerPage/AddButton";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BloodDonorsPage() {
    const [modal, setModal] = useState({ name: null, state: false, data: null });
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState({
        limit: 10,
        page: 1,
        search: "",
        bloodGroup: "",
        city: "",
        available: null,
    });
    const [visibleColumns, setVisibleColumns] = useState(["name", "bloodGroup", "phone", "city", "available", "actions"]);

    const columnOptions = [
        { label: "Name", value: "name" },
        { label: "Blood Group", value: "bloodGroup" },
        { label: "Phone", value: "phone" },
        { label: "Last Donation", value: "lastDonationDate" },
        { label: "Availability", value: "available" },
        { label: "City", value: "city" },
        { label: "Address", value: "address" },
        { label: "Joined At", value: "createdAt" },
    ];

    const debouncedSearch = useDebounce(filters.search, 500);

    const {
        listQuery: bloodDonorsList,
        countsQuery,
        isRefreshing,
        handleRefresh
    } = useAdminData({
        listQueryKey: [ADMIN_KEYS.BLOOD_DONORS.LIST, JSON.stringify({ ...filters, search: debouncedSearch })],
        listQueryFn: () => GET_BLOOD_DONORS({ ...filters, search: debouncedSearch }),
        countsQueryKey: [ADMIN_KEYS.BLOOD_DONORS.COUNTS],
        countsQueryFn: GET_BLOOD_DONOR_STATUS_COUNTS,
        onListError: "Failed to fetch blood donors.",
    });

    const { data: countsData, isLoading: countsLoading } = countsQuery;

    const counts = countsData?.data || { available: 0, unavailable: 0 };

    const statCards = [
        { label: "Available", short: "Avail", key: "true", count: counts.available, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
        { label: "Unavailable", short: "Unav", key: "false", count: counts.unavailable, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    ];

    const onChange = (newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }));
    const hasActiveFilters = filters?.bloodGroup || filters?.available || filters?.search || filters?.city;

    return (
        <InnerPageCard title="Blood Donors">

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
                                active={filters.available === card.key}
                                onClick={() =>
                                    setFilters((prev) => ({
                                        ...prev,
                                        available: prev.available === card.key ? null : card.key,
                                        page: 1,
                                    }))
                                }
                            />
                        ))
                    )}
                </div>

                {/* Action Bar (Right) */}
                <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full md:w-auto justify-end">
                    {/* Desktop Filters (Visible on Tablet/Desktop) */}
                    <div className="hidden md:flex items-center gap-2">
                        <SelectBox
                            placeholder="Blood Group"
                            allowClear
                            handleChange={(val) => onChange({ bloodGroup: val || "", page: 1 })}
                            value={filters.bloodGroup}
                            width={160}
                            options={bloodGroups.map((bg) => ({ value: bg, label: bg }))}
                            className="custom-selectbox mt-1"
                        />
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
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white !rounded shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
                        </button>

                        {/* Mobile Filter Toggle */}
                        <div className="relative">
                            <button
                                onClick={() => setFilterModalOpen(true)}
                                className="mobile-filter-btn md:hidden"
                                title="Filters"
                            >
                                <FiFilter size={18} />
                                {hasActiveFilters && (
                                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <AddButton
                            title="Add Blood Donor"
                            icon={false}
                            onClick={() => setModal({ name: "Add", data: null, state: true })}
                            className="!h-[32px] !rounded !px-4 !text-[10px] font-medium shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                        />
                    </div>
                </div>
            </div>

            <BloodDonorsTable
                modal={modal}
                setModal={setModal}
                bloodDonorsList={bloodDonorsList}
                onChange={onChange}
                visibleColumns={visibleColumns}
            />

            <FilterModal
                isOpen={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                filters={filters}
                onChange={onChange}
            />

            <AddDonorModal modal={modal} setModal={setModal} />
            <UpdateDonorModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}
