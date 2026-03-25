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

    const { data: countsData, isLoading: countsLoading } = useQuery({
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

            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-center">
                {/* Status Count Cards (Left) */}
                <div className="flex gap-2 items-center flex-wrap">
                    {countsLoading ? (
                        Array.from({ length: 2 }).map((_, i) => <StatCardSkeleton key={i} />)
                    ) : (
                        statCards.map((card) => (
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
                        ))
                    )}
                </div>

                {/* Filter and Search (Right) */}
                <div className="flex gap-3 items-center">
                    <SelectBox
                        placeholder="Filter by Blood Group"
                        allowClear
                        handleChange={(val) => onChange({ bloodGroup: val || "", page: 1 })}
                        value={filters.bloodGroup}
                        width={160}
                        options={bloodGroups.map((bg) => ({ value: bg, label: bg }))}
                        className="custom-selectbox"
                    />
                    <div className="flex flex-col md:flex-row gap-2">
                        <SearchInput setFilters={setFilters} />
                    </div>
                    <button
                        onClick={() => setFilterModalOpen(true)}
                        className="flex items-center gap-2 h-[36px] px-4 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all relative font-bold text-[11px] uppercase tracking-tight"
                    >
                        <FaFilter size={11} className="text-slate-400" />
                        Filters
                        {hasActiveFilters && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white shadow-sm" />
                        )}
                    </button>
                    <AddButton
                        title="Add Donor"
                        icon={false}
                        onClick={() => setModal({ name: "Add", data: null, state: true })}
                        className="!h-[36px] !rounded-lg !px-4 !text-[12px] shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                    />
                </div>
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
