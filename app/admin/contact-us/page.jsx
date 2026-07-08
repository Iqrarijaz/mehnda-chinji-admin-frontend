"use client";
import React, { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { useContactUs } from "./hooks/useContactUs";
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

    const closeConfirmModal = React.useCallback(() => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }, []);

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["name", "email", "source", "status", "createdAt", "actions"]);
    
    const columnOptions = React.useMemo(() => [
        { label: "Name", value: "name" },
        { label: "Email", value: "email" },
        { label: "Source", value: "source" },
        { label: "Status", value: "status" },
        { label: "Created At", value: "createdAt" },
    ], []);

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 500 : 0);

    const {
        listQuery: contactList,
        countsQuery,
        isRefreshing,
        handleRefresh
    } = useContactUs(debFilter);

    const { data: countsData, isLoading: countsLoading } = countsQuery;

    const statusMutation = useMutation({
        mutationFn: ({ id, status }) => UPDATE_CONTACT_REQUEST_STATUS(id, status),
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
        mutationFn: (id) => DELETE_CONTACT_REQUEST(id),
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

    const statCards = React.useMemo(() => [
        { label: "Pending", short: "Pen", key: "PENDING", count: counts.PENDING, color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
        { label: "Reviewed", short: "Rev", key: "REVIEWED", count: counts.REVIEWED, color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
        { label: "Resolved", short: "Res", key: "RESOLVED", count: counts.RESOLVED, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    ], [counts.PENDING, counts.REVIEWED, counts.RESOLVED]);

    const onChange = React.useCallback((data) => setFilters((prev) => ({ ...prev, ...data })), []);

    const onDelete = React.useCallback((id) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: 'Are you sure you want to delete this contact request? This action cannot be undone.',
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate(id)
        });
    }, [deleteMutation]);

    const onUpdateStatus = React.useCallback((id, status) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Status Update',
            description: `Are you sure you want to mark this request as ${status.toLowerCase()}?`,
            confirmText: `Yes, ${status.charAt(0) + status.slice(1).toLowerCase()}`,
            cancelText: 'Cancel',
            variant: 'primary',
            onConfirm: () => statusMutation.mutate({ id, status })
        });
    }, [statusMutation]);

    return (
        <InnerPageCard>
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
                <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full md:w-auto justify-end">
                    <div className="hidden md:flex items-center gap-2">
                        <SearchInput
                            setFilters={setFilters}
                            className="!max-w-[180px] !h-[32px] !border-2 !rounded-[2px]"
                        />
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
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
                        </button>

                        <AddButton
                            title="Add Contact"
                            icon={false}
                            onClick={() => setModal({ name: "Add", data: null, state: true })}
                            className="!h-[32px] !rounded !px-4 !text-[10px] font-medium shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                        />
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="mobile-filter-btn md:!hidden flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all"
                        title="Filters"
                    >
                        <FiFilter size={16} />
                    </button>
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
                loading={statusMutation.isPending || deleteMutation.isPending}
            />
        </InnerPageCard>
    );
}
