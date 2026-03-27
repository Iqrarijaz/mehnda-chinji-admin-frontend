"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import SearchInput from "@/components/InnerPage/SearchInput";
import SupportTable from "./components/Table";
import ManageTicketModal from "./components/ManageModal";
import { GET_SUPPORT_TICKETS, GET_SUPPORT_STATUS_COUNTS } from "@/app/api/admin/support";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";

export default function SupportPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        limit: 20,
        page: 1,
        status: null,
        search: "",
        onChangeSearch: false,
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["ticketId", "userId", "subject", "description", "status", "createdAt", "actions"]);
    
    const columnOptions = [
        { label: "Ticket ID", value: "ticketId" },
        { label: "User", value: "userId" },
        { label: "Subject", value: "subject" },
        { label: "Description", value: "description" },
        { label: "Status", value: "status" },
        { label: "Created At", value: "createdAt" },
    ];

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

    const counts = countsData?.data || { OPEN: 0, IN_PROGRESS: 0, CLOSED: 0 };

    const statCards = [
        { label: "Open", key: "OPEN", count: counts.OPEN, color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
        { label: "In Progress", key: "IN_PROGRESS", count: counts.IN_PROGRESS, color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
        { label: "Closed", key: "CLOSED", count: counts.CLOSED, color: "#374151", bg: "#f9fafb", border: "#d1d5db" },
    ];

    const onChange = (data) => setFilters((prev) => ({ ...prev, ...data }));

    return (
        <InnerPageCard title="Support Tickets">

            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-start md:items-center">
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
                                        page: 1,
                                    }))
                                }
                            />
                        ))
                    )}
                </div>

                {/* Filter, Search and Action (Right) */}
                <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full md:w-auto justify-end">
                    {/* Desktop Search (Visible on Tablet/Desktop) */}
                    <div className="hidden md:block">
                        <SearchInput setFilters={setFilters} className="!max-w-[200px]" />
                    </div>

                    <div className="flex items-center gap-2">
                        <ColumnVisibilityDropdown
                            options={columnOptions}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-hidden">
                <SupportTable 
                    modal={modal} 
                    setModal={setModal} 
                    ticketsList={ticketsList} 
                    onChange={onChange}
                    visibleColumns={visibleColumns}
                />
            </div>

            <ManageTicketModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}
