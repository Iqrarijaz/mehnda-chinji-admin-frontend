"use client";
import React, { useState } from "react";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import MarketplaceTable from "./components/Table";
import AddListingModal from "./components/AddModal";
import UpdateListingModal from "./components/UpdateModal";
import StatusListingModal from "./components/StatusModal";
import { GET_MARKETPLACE_LIST } from "@/app/api/admin/marketplace";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { HiRefresh } from "react-icons/hi";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";
import { useDebounce } from "@/hooks/useDebounce";
import SelectBox from "@/components/SelectBox";

export default function MarketplacePage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        limit: 10,
        page: 1,
        status: "",
        search: "",
        onChangeSearch: false
    });

    const [visibleColumns, setVisibleColumns] = useState(["item", "category", "price", "seller", "place", "status", "createdAt", "actions"]);

    const columnOptions = [
        { label: "Item / Image", value: "item" },
        { label: "Category / Type", value: "category" },
        { label: "Price", value: "price" },
        { label: "Seller", value: "seller" },
        { label: "Place", value: "place" },
        { label: "Status", value: "status" },
        { label: "Created At", value: "createdAt" }
    ];

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 500 : 0);

    const {
        listQuery: marketplaceList,
        isRefreshing,
        handleRefresh
    } = useAdminData({
        listQueryKey: [ADMIN_KEYS.MARKETPLACE.LIST, JSON.stringify(debFilter)],
        listQueryFn: () => GET_MARKETPLACE_LIST(debFilter),
        onListError: "Failed to fetch marketplace listings.",
    });

    const onChange = React.useCallback((data) => {
        setFilters((prev) => ({ ...prev, ...data }));
    }, []);

    const handleStatusFilterChange = (value) => {
        onChange({ status: value || "", page: 1 });
    };

    return (
        <InnerPageCard title="Marketplace Listings">
            <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full justify-end mb-4">
                <SearchInput setFilters={setFilters} className="!max-w-[180px]" />
                <SelectBox
                    placeholder="Status"
                    allowClear
                    handleChange={(val) => onChange({ status: val || "", page: 1 })}
                    value={filters.status}
                    width={160}
                    options={[
                        { label: "Pending", value: "pending" },
                        { label: "Live / Approved", value: "live" },
                        { label: "Rejected", value: "rejected" },
                        { label: "Sold", value: "sold" }
                    ]}
                    className="custom-selectbox mt-1"
                />
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
                    className="!h-[32px] !rounded !px-4 !text-[10px] font-medium shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                />
            </div>

            <div className="bg-white dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300">
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
