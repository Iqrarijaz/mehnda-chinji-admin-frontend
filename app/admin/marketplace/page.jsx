"use client";
import React, { useState } from "react";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import MarketplaceTable from "./components/Table";
import AddListingModal from "./components/AddModal";
import UpdateListingModal from "./components/UpdateModal";
import StatusListingModal from "./components/StatusModal";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { HiRefresh } from "react-icons/hi";
import { useDebounce } from "@/hooks/useDebounce";
import { useMarketplace } from "./hooks/useMarketplace";
import StatCard from "@/components/shared/StatCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";

export default function MarketplacePage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        limit: 20,
        page: 1,
        status: null,
        search: "",
        onChangeSearch: false
    });

    const [visibleColumns, setVisibleColumns] = useState(["item", "category", "type", "price", "seller", "sellerPhone", "place", "status", "createdAt", "actions"]);

    const columnOptions = React.useMemo(() => [
        { label: "Item / Image", value: "item" },
        { label: "Category", value: "category" },
        { label: "Type", value: "type" },
        { label: "Price", value: "price" },
        { label: "Seller Name", value: "seller" },
        { label: "Seller Phone", value: "sellerPhone" },
        { label: "Place", value: "place" },
        { label: "Status", value: "status" },
        { label: "Metadata", value: "metadata" },
        { label: "Created At", value: "createdAt" }
    ], []);

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);

    const {
        listQuery: marketplaceList,
        countsQuery,
        isRefreshing,
        handleRefresh
    } = useMarketplace(debFilter);

    const { data: countsData, isLoading: countsLoading } = countsQuery;
    const counts = countsData?.data || { live: 0, pending: 0, rejected: 0, offline: 0, sold: 0 };

    const onChange = React.useCallback((data) => {
        setFilters((prev) => ({ ...prev, ...data }));
    }, []);

    const statCards = React.useMemo(() => [
        { label: "Live / Approved", short: "Live", key: "live", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
        { label: "Pending", short: "Pen", key: "pending", color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
        { label: "Offline", short: "Off", key: "offline", color: "#475569", bg: "#f1f5f9", border: "#cbd5e1" },
        { label: "Rejected", short: "Rej", key: "rejected", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
        { label: "Sold", short: "Sold", key: "sold", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" }
    ], []);

    return (
        <InnerPageCard>
            <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-start md:items-center">
                {/* Status Count Cards (Left) */}
                <div className="flex gap-2 items-center flex-wrap">
                    {countsLoading ? (
                        Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
                    ) : (
                        statCards.map((card) => (
                            <StatCard
                                key={card.key}
                                title={card.label}
                                shortTitle={card.short}
                                count={counts[card.key] || 0}
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
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            title="Refresh Data"
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
                        </button>
                        <AddButton
                            title="Add"
                            icon={false}
                            onClick={() => setModal({ name: "Add", data: null, state: true })}
                            className="!h-[32px] !border-2 !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white !rounded-[2px] !text-[10px] font-medium shadow-sm transition-all !px-3"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <MarketplaceTable
                    marketplaceList={marketplaceList}
                    setModal={setModal}
                    onChange={onChange}
                    visibleColumns={visibleColumns}
                />
            </div>

            <AddListingModal modal={modal} setModal={setModal} />
            <UpdateListingModal modal={modal} setModal={setModal} />
            <StatusListingModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}
