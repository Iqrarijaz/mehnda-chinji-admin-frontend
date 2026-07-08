"use client";
import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import BusinessTable from "./components/Table";
import AddBusinessModal from "./components/AddModal";
import UpdateBusinessModal from "./components/UpdateModal";
import BusinessTabs from "./components/BusinessTabs";
import { GET_BUSINESSES, GET_BUSINESS_STATUS_COUNTS } from "@/app/api/admin/business";
import { useDebounce } from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { FiFilter } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";
import FilterModal from "./components/FilterModal";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";

export default function BusinessPage() {
  const router = useRouter();

  React.useEffect(() => {
    if (!hasPermission(PERMISSIONS.BUSINESSES.READ)) {
      if (hasPermission(PERMISSIONS.STORE.ANALYTICS.READ)) {
        router.replace("/admin/business/store-dashboard");
      } else if (hasPermission(PERMISSIONS.STORE.CATEGORIES.READ)) {
        router.replace("/admin/business/store-categories");
      } else if (hasPermission(PERMISSIONS.STORE.PRODUCTS.READ)) {
        router.replace("/admin/business/store-products");
      } else if (hasPermission(PERMISSIONS.STORE.ORDERS.READ)) {
        router.replace("/admin/business/store-orders");
      }
    }
  }, [router]);

  const [modal, setModal] = useState({ name: null, data: null, state: false });
  const [filters, setFilters] = useState({
    itemsPerPage: 20,
    currentPage: 1,
    search: null,
    status: null,
    hasStore: null,
    onChangeSearch: false,
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState(["name", "categoryEn", "categoryUr", "timing", "status", "createdAt", "actions"]);

  const columnOptions = [
    { label: "Business Name", value: "name" },
    { label: "Category EN", value: "categoryEn" },
    { label: "Category UR", value: "categoryUr" },
    { label: "Phone", value: "phone" },
    { label: "Address", value: "address" },
    { label: "Status", value: "status" },
    { label: "Timing", value: "timing" },
    { label: "Registered Date", value: "createdAt" },
  ];

  const debFilters = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);

  const {
    listQuery: businessList,
    countsQuery,
    isRefreshing,
    handleRefresh
  } = useAdminData({
    listQueryKey: [ADMIN_KEYS.BUSINESS.LIST, JSON.stringify(debFilters)],
    listQueryFn: () => GET_BUSINESSES(debFilters),
    countsQueryKey: [ADMIN_KEYS.BUSINESS.COUNTS],
    countsQueryFn: GET_BUSINESS_STATUS_COUNTS,
    onListError: "Failed to fetch businesses.",
  });

  const { data: countsData, isLoading: countsLoading } = countsQuery;

  const counts = countsData?.data || { approved: 0, pending: 0, rejected: 0 };

  const onChange = (data) => setFilters((prev) => ({ ...prev, ...data }));

  const statCards = [
    { label: "Approved", short: "App", key: "APPROVED", count: counts.approved, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    { label: "Pending", short: "Pen", key: "PENDING", count: counts.pending, color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
    { label: "Rejected", short: "Rej", key: "REJECTED", count: counts.rejected, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  ];

  return (
    <InnerPageCard>
      <BusinessTabs />
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
                    currentPage: 1,
                  }))
                }
              />
            ))
          )}
        </div>

        {/* Action Bar (Right) */}
        <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full md:w-auto justify-end">
          {/* Desktop Search & Store Filter (Visible on Tablet/Desktop) */}
          <div className="hidden md:flex items-center gap-2">
            <SearchInput setFilters={setFilters} className="!max-w-[180px]" />
            <label className={`flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] cursor-pointer select-none transition-all ${filters.hasStore === true ? '!bg-[#006666] dark:!bg-teal-600 !border-[#006666] dark:!border-teal-600 text-white' : '!border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 text-slate-300 dark:text-slate-600'}`} title="Only Show Stores">
              <input
                type="checkbox"
                checked={filters.hasStore === true}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    hasStore: e.target.checked ? true : null,
                    currentPage: 1,
                  }))
                }
                className="sr-only"
              />
              {filters.hasStore === true ? (
                <span className="text-xs font-black">✓</span>
              ) : (
                <span className="text-[10px] opacity-20">✓</span>
              )}
            </label>
          </div>

          {/* Right Action Group */}
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
              className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
            </button>

            {hasPermission(PERMISSIONS.BUSINESSES.CREATE) && (
              <AddButton
                title="Add Business"
                icon={false}
                onClick={() => setModal({ name: "Add", data: null, state: true })}
                className="!h-[32px] !rounded !px-4 !text-[10px] font-medium shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
              />
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="mobile-filter-btn md:hidden flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666]"
            title="Filters"
          >
            <FiFilter size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <BusinessTable
          modal={modal}
          setModal={setModal}
          businessList={businessList}
          onChange={onChange}
          visibleColumns={visibleColumns}
        />
      </div>

      <AddBusinessModal modal={modal} setModal={setModal} />
      <UpdateBusinessModal modal={modal} setModal={setModal} />

      <FilterModal
        open={isFilterModalOpen}
        onCancel={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </InnerPageCard>
  );
}
