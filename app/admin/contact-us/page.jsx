"use client";
import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import SearchInput from "@/components/InnerPage/SearchInput";
import AddButton from "@/components/InnerPage/AddButton";
import ContactUsList from "@/components/admin/contactUs/ContactUsList";
import ContactUsDetailModal from "@/components/admin/contactUs/ContactUsDetailModal";
import { GET_CONTACT_REQUESTS, GET_CONTACT_STATUS_COUNTS, UPDATE_CONTACT_REQUEST_STATUS, DELETE_CONTACT_REQUEST } from "@/app/api/admin/contact-us";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";
import { FiFilter } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";
import FilterModal from "./components/FilterModal";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";

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
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        description: "",
        onConfirm: null,
        variant: "primary",
        confirmText: "Confirm",
        cancelText: "Cancel"
    });

    const closeConfirmModal = () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    };

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["name", "email", "source", "status", "createdAt", "actions"]);
    
    const columnOptions = [
        { label: "Name", value: "name" },
        { label: "Email", value: "email" },
        { label: "Source", value: "source" },
        { label: "Status", value: "status" },
        { label: "Created At", value: "createdAt" },
    ];

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 500 : 0);

    const {
        listQuery: contactList,
        countsQuery,
        isRefreshing,
        handleRefresh
    } = useAdminData({
        listQueryKey: [ADMIN_KEYS.CONTACT.LIST, JSON.stringify(debFilter)],
        listQueryFn: () => GET_CONTACT_REQUESTS(debFilter),
        countsQueryKey: [ADMIN_KEYS.CONTACT.COUNTS],
        countsQueryFn: GET_CONTACT_STATUS_COUNTS,
        onListError: "Failed to fetch contact requests.",
    });

    const { data: countsData, isLoading: countsLoading } = countsQuery;

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }) => {
            return await UPDATE_CONTACT_REQUEST_STATUS(id, status);
        },
        onSuccess: () => {
            toast.success("Status updated successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.CONTACT.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.CONTACT.COUNTS]);
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to update status");
            closeConfirmModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return await DELETE_CONTACT_REQUEST(id);
        },
        onSuccess: () => {
            toast.success("Request deleted successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.CONTACT.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.CONTACT.COUNTS]);
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to delete request");
            closeConfirmModal();
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
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: 'Are you sure you want to delete this contact request? This action cannot be undone.',
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate(id)
        });
    };

    const onUpdateStatus = (id, status) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Status Update',
            description: `Are you sure you want to mark this request as ${status.toLowerCase()}?`,
            confirmText: `Yes, ${status.charAt(0) + status.slice(1).toLowerCase()}`,
            cancelText: 'Cancel',
            variant: 'primary',
            onConfirm: () => statusMutation.mutate({ id, status })
        });
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
                    <div className="hidden md:flex items-center gap-3 mr-1">
                        <SearchInput setFilters={setFilters} />
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

                        <AddButton
                            title="Add Contact"
                            icon={false}
                            onClick={() => setModal({ name: "Add", data: null, state: true })}
                            className="!h-[32px] !rounded !px-4 !text-[10px] font-medium shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                        />

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setIsFilterModalOpen(true)}
                            className="mobile-filter-btn md:hidden dark:text-slate-400 dark:hover:text-teal-400 transition-colors"
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
                    visibleColumns={visibleColumns}
                />
            </div>

            <ContactUsDetailModal modal={modal} setModal={setModal} />

            <FilterModal
                open={isFilterModalOpen}
                onCancel={() => setIsFilterModalOpen(false)}
                filters={filters}
                setFilters={setFilters}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                description={confirmModal.description}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                variant={confirmModal.variant}
                loading={statusMutation.isLoading || deleteMutation.isLoading}
            />
        </InnerPageCard>
    );
}
