"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import SearchInput from "@/components/InnerPage/SearchInput";
import SupportTable from "./components/Table";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";
import ManageTicketModal from "./components/ManageModal";
import { GET_SUPPORT_TICKETS, GET_SUPPORT_STATUS_COUNTS } from "@/app/api/admin/support";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";

export default function SupportPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        limit: 20,
        page: 1,
        status: null,
        search: "",
        onChangeSearch: false,
    });

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 500 : 0);
    const ticketsList = useQuery({
        queryKey: ["ticketsList", JSON.stringify(debFilter)],
        queryFn: () => GET_SUPPORT_TICKETS(debFilter),
        keepPreviousData: true,
        onError: () => toast.error("Failed to fetch support tickets."),
    });

    const { data: countsData, isLoading: countsLoading } = useQuery({
        queryKey: ["supportStatusCounts"],
        queryFn: GET_SUPPORT_STATUS_COUNTS,
    });

    const counts = countsData?.data || { open: 0, inProgress: 0, closed: 0 };

    const statCards = [
        { label: "Open", key: "open", count: counts.open, color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
        { label: "In Progress", key: "in-progress", count: counts.inProgress, color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
        { label: "Closed", key: "closed", count: counts.closed, color: "#374151", bg: "#f9fafb", border: "#d1d5db" },
    ];

    const onChange = (data) => setFilters((prev) => ({ ...prev, ...data }));

    return (
        <InnerPageCard title="Support Tickets">

            {/* Status Count Cards */}
            <div className="flex gap-3 mb-5" style={{ flexWrap: "wrap" }}>
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
                                    page: 1,
                                }))
                            }
                        />
                    ))
                )}
            </div>

            <div className="flex justify-end mb-4 gap-4 items-center">
                <div className="flex flex-col md:flex-row gap-4">
                    <SearchInput setFilters={setFilters} placeholder="Search by Ticket ID..." />
                </div>
                <ItemsPerPageDropdown onChange={onChange} />

            </div>

            <div className="overflow-hidden">
                <SupportTable modal={modal} setModal={setModal} ticketsList={ticketsList} onChange={onChange} />
            </div>

            <ManageTicketModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}
