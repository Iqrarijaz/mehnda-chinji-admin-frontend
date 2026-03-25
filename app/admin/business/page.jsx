"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import BusinessTable from "./components/Table";
import AddBusinessModal from "./components/AddModal";
import UpdateBusinessModal from "./components/UpdateModal";
import { GET_BUSINESSES, GET_BUSINESS_STATUS_COUNTS } from "@/app/api/admin/business";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { FiFilter } from "react-icons/fi";
import FilterModal from "./components/FilterModal";

export default function BusinessPage() {
  const [modal, setModal] = useState({ name: null, data: null, state: false });
  const [filters, setFilters] = useState({
    itemsPerPage: 20,
    currentPage: 1,
    search: null,
    status: null,
    onChangeSearch: false,
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState(["name", "categoryEn", "status", "createdAt", "actions"]);

  const columnOptions = [
    { label: "Business Name", value: "name" },
    { label: "Category", value: "categoryEn" },
    { label: "Phone", value: "phone" },
    { label: "Address", value: "address" },
    { label: "Status", value: "status" },
    { label: "Registered Date", value: "createdAt" },
  ];

  const debFilters = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);

  const businessList = useQuery({
    queryKey: ["businessList", JSON.stringify(debFilters)],
    queryFn: () => GET_BUSINESSES(debFilters),
    onError: () => toast.error("Something went wrong. Please try again later."),
  });

  const { data: countsData, isLoading: countsLoading } = useQuery({
    queryKey: ["businessStatusCounts"],
    queryFn: GET_BUSINESS_STATUS_COUNTS,
  });

  const counts = countsData?.data || { approved: 0, pending: 0, rejected: 0 };

  const onChange = (data) => setFilters((prev) => ({ ...prev, ...data }));

  const statCards = [
    { label: "Approved", short: "App", key: "APPROVED", count: counts.approved, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    { label: "Pending", short: "Pen", key: "PENDING", count: counts.pending, color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
    { label: "Rejected", short: "Rej", key: "REJECTED", count: counts.rejected, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  ];

  return (
    <InnerPageCard title="Businesses">

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
        <div className="flex gap-2 items-center w-full md:w-auto justify-end">
          {/* Desktop Search (Hidden on Mobile) */}
          <div className="hidden md:block">
            <SearchInput setFilters={setFilters} />
          </div>

          <div className="flex items-center gap-2">
            <ColumnVisibilityDropdown
              options={columnOptions}
              visibleColumns={visibleColumns}
              setVisibleColumns={setVisibleColumns}
            />

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="mobile-filter-btn md:hidden"
              title="Filters"
            >
              <FiFilter size={18} />
            </button>

            <AddButton
              title="Add Business"
              icon={false}
              onClick={() => setModal({ name: "Add", data: null, state: true })}
              className="!h-[36px] !rounded !px-4 !text-[12px] shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
            />
          </div>
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
