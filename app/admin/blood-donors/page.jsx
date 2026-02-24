"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import SearchInput from "@/components/InnerPage/SearchInput";
import BloodDonorsTable from "./components/Table";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";
import UpdateDonorModal from "./components/UpdateModal";
import SelectBox from "@/components/SelectBox";
import FilterModal from "./components/FilterModal";
import { FaFilter } from "react-icons/fa";
import { GET_BLOOD_DONORS, GET_BLOOD_DONOR_STATUS_COUNTS } from "@/app/api/admin/blood-donors";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";

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

    const debouncedSearch = useDebounce(filters.search, 500);
    const bloodDonorsList = useQuery({
        queryKey: ["bloodDonorsList", { ...filters, search: debouncedSearch }],
        queryFn: () => GET_BLOOD_DONORS({ ...filters, search: debouncedSearch }),
        keepPreviousData: true,
    });

    const { data: countsData } = useQuery({
        queryKey: ["bloodDonorsStatusCounts"],
        queryFn: GET_BLOOD_DONOR_STATUS_COUNTS,
    });

    const counts = countsData?.data || { available: 0, unavailable: 0 };

    const statCards = [
        { label: "Available", key: "true", count: counts.available, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
        { label: "Unavailable", key: "false", count: counts.unavailable, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    ];

    const onChange = (newFilters) => setFilters((prev) => ({ ...prev, ...newFilters }));
    const hasActiveFilters = filters?.bloodGroup || filters?.available || filters?.search || filters?.city;

    return (
        <InnerPageCard title="Blood Donors">

            {/* Status Count Cards */}
            <div className="flex gap-3 mb-5" style={{ flexWrap: "wrap" }}>
                {statCards.map((card) => (
                    <StatCard
                        key={card.key}
                        title={card.label}
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
                ))}
            </div>

            <div className="flex justify-end mb-4 gap-4 items-center">
                {/* Desktop: blood group + search inline */}
                <div className="hidden md:flex gap-4 items-center">
                    <SelectBox
                        placeholder="Filter by Blood Group"
                        allowClear
                        handleChange={(val) => onChange({ bloodGroup: val || "", page: 1 })}
                        value={filters.bloodGroup}
                        width={180}
                        options={bloodGroups.map((bg) => ({ value: bg, label: bg }))}
                    />
                    <SearchInput
                        placeholder="Search donors..."
                        onChange={(e) => onChange({ search: e.target.value, page: 1 })}
                        value={filters.search}
                    />
                </div>
                {/* Mobile: search + filter button */}
                <div className="flex md:hidden gap-4 flex-1 items-center">
                    <SearchInput
                        placeholder="Search donors..."
                        onChange={(e) => onChange({ search: e.target.value, page: 1 })}
                        value={filters.search}
                    />
                    <button
                        onClick={() => setFilterModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e293b] transition-colors relative flex-shrink-0"
                    >
                        <FaFilter size={14} />
                        {hasActiveFilters && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                        )}
                    </button>
                </div>
                <ItemsPerPageDropdown onChange={onChange} />
            </div>

            <BloodDonorsTable modal={modal} setModal={setModal} bloodDonorsList={bloodDonorsList} onChange={onChange} />

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
