"use client";
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import SearchInput from "@/components/InnerPage/SearchInput";
import ContactUsList from "@/components/admin/contactUs/ContactUsList";
import ContactUsDetailModal from "@/components/admin/contactUs/ContactUsDetailModal";
import { GET_CONTACT_REQUESTS, GET_CONTACT_STATUS_COUNTS, UPDATE_CONTACT_REQUEST_STATUS, DELETE_CONTACT_REQUEST } from "@/app/api/admin/contact-us";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";
import { FiFilter } from "react-icons/fi";
import FilterModal from "./components/FilterModal";

export default function ContactUsPage() {
    const queryClient = useQueryClient();
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        limit: 20,
        page: 1,
        status: null,
        search: "",
        onChangeSearch: false,
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 500 : 0);
    const contactList = useQuery({
        queryKey: ["contactRequests", JSON.stringify(debFilter)],
        queryFn: () => GET_CONTACT_REQUESTS(debFilter),
        keepPreviousData: true,
        onError: () => toast.error("Failed to fetch contact requests."),
    });

    const { data: countsData, isLoading: countsLoading } = useQuery({
        queryKey: ["contactStatusCounts"],
        queryFn: GET_CONTACT_STATUS_COUNTS,
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            return await UPDATE_CONTACT_REQUEST_STATUS(id, status);
        },
        onSuccess: () => {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries("contactRequests");
            queryClient.invalidateQueries("contactStatusCounts");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await DELETE_CONTACT_REQUEST(id);
        },
        onSuccess: () => {
            toast.success("Request deleted successfully");
            queryClient.invalidateQueries("contactRequests");
            queryClient.invalidateQueries("contactStatusCounts");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete request");
        },
    });

    const counts = countsData?.data || { PENDING: 0, REVIEWED: 0, RESOLVED: 0 };

    const statCards = [
        { label: "Pending", short: "Pen", key: "PENDING", count: counts.PENDING, color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
        { label: "Reviewed", short: "Rev", key: "REVIEWED", count: counts.REVIEWED, color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
        { label: "Resolved", short: "Res", key: "RESOLVED", count: counts.RESOLVED, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    ];

    const onChange = (data) => setFilters((prev) => ({ ...prev, ...data }));

    const onDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this contact request?")) {
            deleteMutation.mutate(id);
        }
    };

    const onUpdateStatus = (id, status) => {
        statusMutation.mutate({ id, status });
    };

    return (
        <InnerPageCard title="Contact Us Requests">
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
                <div className="flex gap-2 items-center w-full md:w-auto justify-end">
                    {/* Desktop Search (Hidden on Mobile) */}
                    <div className="hidden md:block">
                        <SearchInput setFilters={setFilters} />
                    </div>

                    <div className="flex md:hidden">
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setIsFilterModalOpen(true)}
                            className="mobile-filter-btn"
                            title="Filters"
                        >
                            <FiFilter size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden">
                <ContactUsList 
                    modal={modal} 
                    setModal={setModal} 
                    contactList={contactList} 
                    onChange={onChange}
                    onDelete={onDelete}
                    onUpdateStatus={onUpdateStatus}
                />
            </div>

            <ContactUsDetailModal modal={modal} setModal={setModal} />

            <FilterModal
                open={isFilterModalOpen}
                onCancel={() => setIsFilterModalOpen(false)}
                filters={filters}
                setFilters={setFilters}
            />
        </InnerPageCard>
    );
}
