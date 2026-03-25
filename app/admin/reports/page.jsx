"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import SearchInput from "@/components/InnerPage/SearchInput";
import ReportsTable from "./components/Table";
import { GET_REPORTS, GET_REPORT_STATUS_COUNTS } from "@/app/api/admin/reports";
import SelectBox from "@/components/SelectBox";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";

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

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
    const reportsList = useQuery({
        queryKey: ["reportsList", JSON.stringify(debFilter)],
        queryFn: () => GET_REPORTS(debFilter),
        onError: () => toast.error("Something went wrong. Please try again later."),
    });

    const { data: countsData, isLoading: countsLoading } = useQuery({
        queryKey: ["reportStatusCounts"],
        queryFn: GET_REPORT_STATUS_COUNTS,
    });

    const counts = countsData?.data || { pending: 0, reviewed: 0, resolved: 0 };

    const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

    const handleTargetTypeFilter = (value) => {
        setFilters((prev) => ({ ...prev, targetType: value || null, currentPage: 1 }));
    };

    const statCards = [
        { label: "Pending", key: "PENDING", count: counts.pending, color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
        { label: "Reviewed", key: "REVIEWED", count: counts.reviewed, color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
        { label: "Resolved", key: "RESOLVED", count: counts.resolved, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    ];

    return (
        <InnerPageCard title="Reports">

            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-center">
                {/* Status Count Cards (Left) */}
                <div className="flex gap-2 items-center flex-wrap">
                    {countsLoading ? (
                        Array.from({ length: 3 }).map((_, i) => <StatCardSkeleton key={i} />)
                    ) : (
                        statCards.map((card) => (
                            <StatCard
                                key={card.key}
                                title={card.label}
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

                {/* Filter and Search (Right) */}
                <div className="flex gap-3 items-center">
                    <SelectBox
                        placeholder="Target Type"
                        allowClear
                        handleChange={handleTargetTypeFilter}
                        width={150}
                        options={TARGET_TYPES}
                        className="custom-selectbox"
                    />
                    <div className="flex flex-col md:flex-row gap-2">
                        <SearchInput setFilters={setFilters} />
                    </div>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <ReportsTable reportsList={reportsList} onChange={onChange} setFilters={setFilters} />
            </div>
        </InnerPageCard>
    );
}
