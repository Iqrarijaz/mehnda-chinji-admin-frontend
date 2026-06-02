"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";
import moment from "moment";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import { SkeletonPulse, StatCardSkeleton } from "@/components/shared/Skeletons";
import StatCard from "@/components/shared/StatCard";
import ConnectionsTable from "./components/Table";
import AddConnectionModal from "./components/AddModal";
import UpdateConnectionModal from "./components/UpdateModal";
import { LIST_CONNECTIONS } from "@/app/api/admin/water-supply";
import { useDebounce } from "@/hooks/useDebounce";
import InnerPageCard from "@/components/layout/InnerPageCard";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import FilterModal from "./components/FilterModal";
import { FiFilter } from "react-icons/fi";
import { HiRefresh, HiDownload } from "react-icons/hi";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";
import { downloadCSV } from "@/utils/export";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";

const columnOptions = [
    { label: "Connection ID", value: "connectionId" },
    { label: "Name", value: "name" },
    { label: "Phone", value: "phoneNumber" },
    { label: "Address", value: "address" },
    { label: "Monthly Rate", value: "monthlyRate" },
    { label: "Status", value: "status" },
    { label: "Created At", value: "createdAt" },
];
export default function ConnectionsPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        itemsPerPage: 20,
        currentPage: 1,
        search: null,
        onChangeSearch: false,
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    const [visibleColumns, setVisibleColumns] = useState(["connectionId", "name", "phoneNumber", "address", "monthlyRate", "status", "createdAt", "actions"]);

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);

    const {
        listQuery: connectionsList,
        isRefreshing,
        handleRefresh
    } = useAdminData({
        listQueryKey: [ADMIN_KEYS.WATER_SUPPLY.CONNECTIONS_LIST, JSON.stringify(debFilter)],
        listQueryFn: () => LIST_CONNECTIONS(debFilter),
        onListError: "Failed to fetch connections.",
    });

    const onChange = React.useCallback((data) => setFilters((old) => ({ ...old, ...data })), []);

    const handleStatClick = React.useCallback((field, key) => {
        setFilters((prev) => ({
            ...prev,
            [field]: prev[field] === key ? null : key,
            currentPage: 1,
        }));
    }, []);

    const handleExport = React.useCallback(async () => {
        try {
            const toastId = toast.loading("Preparing export...");
            const res = await LIST_CONNECTIONS({ ...debFilter, limit: 999999, page: 1 });
            const allDocs = res?.data?.docs || [];
            
            if (!allDocs.length) {
                toast.update(toastId, { render: "No data to export", type: "info", isLoading: false, autoClose: 3000 });
                return;
            }

            const formattedData = allDocs.map((conn, index) => ({
                "S.No": index + 1,
                "Connection ID": conn.connectionId || "-",
                "Name": conn.name || "-",
                "Phone": conn.phoneNumber || "-",
                "Address": conn.address || "-",
                "Reference": conn.reference || "-",
                "Monthly Rate": conn.monthlyRate || 0,
                "Status": conn.status || "-",
                "Created Date": moment(conn.createdAt).format("DD MMM YYYY")
            }));
            
            downloadCSV(formattedData, "Water_Connections.csv");
            toast.update(toastId, { render: "Export successful!", type: "success", isLoading: false, autoClose: 3000 });
        } catch (error) {
            console.error("Export Error:", error);
            toast.error("Failed to export data");
        }
    }, [debFilter]);

    const statCards = React.useMemo(() => [
        { label: "Total", short: "Total", key: null, count: connectionsList?.data?.data?.stats?.total || 0, color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", field: "status" },
        { label: "Active", short: "Active", key: "ACTIVE", count: connectionsList?.data?.data?.stats?.active || 0, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", field: "status" },
        { label: "Suspended", short: "Suspnd", key: "SUSPENDED", count: connectionsList?.data?.data?.stats?.suspended || 0, color: "#eab308", bg: "#fefce8", border: "#fef08a", field: "status" },
        { label: "Cancelled", short: "Cancel", key: "CANCELLED", count: connectionsList?.data?.data?.stats?.cancelled || 0, color: "#dc2626", bg: "#fef2f2", border: "#fecaca", field: "status" },
    ], [connectionsList?.data?.data?.stats]);

    return (
        <InnerPageCard title="Water Supply Connections">
            <div className="flex flex-col md:flex-row justify-between mb-3 gap-2 md:gap-3 items-start md:items-center">
                <div className="grid grid-cols-2 md:flex gap-2 items-center md:flex-nowrap w-full md:w-auto">
                    {connectionsList?.status === "loading" ? (
                        Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
                    ) : (
                        statCards.map((card, i) => (
                            <StatCard
                                key={i}
                                title={card.label}
                                count={card.count}
                                color={card.color}
                                bg={card.bg}
                                border={card.border}
                                isActive={filters[card.field] === card.key}
                                onClick={() => handleStatClick(card.field, card.key)}
                            />
                        ))
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-2 items-center w-full md:w-auto justify-end">
                    <div className="hidden md:flex w-full md:w-auto">
                        <SearchInput
                            setFilters={setFilters}
                            className="!w-full md:!max-w-[200px] !h-[32px]"
                            placeholder="Search Name or ID"
                        />
                    </div>

                    <div className="flex flex-wrap justify-end items-center gap-1 w-full md:w-auto">
                        <ColumnVisibilityDropdown
                            options={columnOptions}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        />

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setIsFilterModalOpen(true)}
                            className="flex md:hidden items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all"
                            title="Filters"
                        >
                            <FiFilter size={16} />
                        </button>

                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            title="Refresh Data"
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
                        </button>

                        <button
                            onClick={handleExport}
                            disabled={!connectionsList?.data?.data?.docs?.length}
                            title="Download CSV"
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiDownload size={16} />
                        </button>

                        {hasPermission(PERMISSIONS.WATER_SUPPLY.CREATE) && (
                            <AddButton
                                title="Add Connection"
                                icon={false}
                                onClick={() => setModal({ name: "Add", data: null, state: true })}
                                className="!h-[32px] !border-2 !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white !rounded !text-[10px] font-medium shadow-sm transition-all !px-3"
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <ConnectionsTable
                    modal={modal}
                    setModal={setModal}
                    connectionsList={connectionsList}
                    onChange={onChange}
                    setFilters={setFilters}
                    visibleColumns={visibleColumns}
                />
            </div>

            <AddConnectionModal modal={modal} setModal={setModal} />
            <UpdateConnectionModal modal={modal} setModal={setModal} />

            <FilterModal
                open={isFilterModalOpen}
                onCancel={() => setIsFilterModalOpen(false)}
                filters={filters}
                setFilters={setFilters}
            />
        </InnerPageCard>
    );
}
