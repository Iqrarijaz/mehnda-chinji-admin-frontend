"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import SearchInput from "@/components/InnerPage/SearchInput";
import BloodDonorsTable from "./components/Table";
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
        { label: "City", value: "city" },
        { label: "Availability", value: "available" },
    ];

    const debouncedSearch = useDebounce(filters.search, 500);
    const bloodDonorsList = useQuery({
        queryKey: ["bloodDonorsList", { ...filters, search: debouncedSearch }],
        queryFn: () => GET_BLOOD_DONORS({ ...filters, search: debouncedSearch }),
        keepPreviousData: true,
    });

    const { data: countsData, isLoading: countsLoading } = useQuery({
        queryKey: ["bloodDonorsStatusCounts"],
        queryFn: GET_BLOOD_DONOR_STATUS_COUNTS,
    });

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
                <div className="flex gap-2 items-center w-full md:w-auto justify-end">
                    {/* Desktop Filters (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-3">
                        <SelectBox
                            placeholder="Filter by Blood Group"
                            allowClear
                            handleChange={(val) => onChange({ bloodGroup: val || "", page: 1 })}
                            value={filters.bloodGroup}
                            width={160}
                            options={bloodGroups.map((bg) => ({ value: bg, label: bg }))}
                            className="custom-selectbox"
                        />
                        <SearchInput setFilters={setFilters} />
                    </div>

                    <div className="flex items-center gap-2">
                        <ColumnVisibilityDropdown
                            options={columnOptions}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        />

                        {/* Mobile Filter Toggle */}
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

                        <AddButton
                            title="Add Donor"
                            icon={false}
                            onClick={() => setModal({ name: "Add", data: null, state: true })}
                            className="!h-[36px] !rounded !px-4 !text-[12px] shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
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

            <UpdateDonorModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}
