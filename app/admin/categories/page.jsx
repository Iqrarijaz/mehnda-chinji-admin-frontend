"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import CategoryTable from "./components/Table";
import AddBusinessCategoryModal from "./components/AddModal";
import UpdateCategoryModal from "./components/UpdateModal";
import { CATEGORIES, GET_CATEGORIES_STATUS_COUNTS } from "@/app/api/admin/categories";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { FiFilter } from "react-icons/fi";
import FilterModal from "./components/FilterModal";

export default function CategoriesPage() {
  const [modal, setModal] = useState({ name: null, data: null, state: false });
  const [filters, setFilters] = useState({
    itemsPerPage: 20,
    currentPage: 1,
    search: null,
    sortOrder: -1,
    sortingKey: "_id",
    onChangeSearch: false,
    advance: null,
    status: null,
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState(["name_en", "name_ur", "type", "status", "createdAt", "actions"]);

  const columnOptions = [
    { label: "Name (EN)", value: "name_en" },
    { label: "Name (UR)", value: "name_ur" },
    { label: "Type", value: "type" },
    { label: "Status", value: "status" },
    { label: "Created At", value: "createdAt" },
  ];

  const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
  const categoriesList = useQuery({
    queryKey: ["categoriesList", JSON.stringify(debFilter)],
    queryFn: () => CATEGORIES(debFilter),
    onError: () => toast.error("Something went wrong. Please try again later."),
  });

  const { data: countsData, isLoading: countsLoading } = useQuery({
    queryKey: ["categoriesStatusCounts"],
    queryFn: GET_CATEGORIES_STATUS_COUNTS,
  });

  const counts = countsData?.data || { active: 0, inactive: 0 };

  const statCards = [
    { label: "Active", short: "Act", key: true, count: counts.active, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    { label: "Inactive", short: "Ina", key: false, count: counts.inactive, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  ];

  const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

  return (
    <InnerPageCard title="Categories">

      <div className="flex flex-col md:flex-row justify-between mb-3 gap-3 items-start md:items-center">
        {/* Status Count Cards (Left) */}
        <div className="flex gap-2 items-center flex-wrap">
          {countsLoading ? (
            Array.from({ length: 2 }).map((_, i) => <StatCardSkeleton key={i} />)
          ) : (
            statCards.map((card) => (
              <StatCard
                key={String(card.key)}
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
            <SearchInput setFilters={setFilters} pageKey="currentPage" />
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
              title="Add Category"
              icon={false}
              onClick={() => setModal({ name: "Add", data: null, state: true })}
              className="!h-[36px] !rounded-xl !px-4 !text-[12px] shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <CategoryTable modal={modal} setModal={setModal} categoriesList={categoriesList} onChange={onChange} setFilters={setFilters} visibleColumns={visibleColumns} />
      </div>

      <AddBusinessCategoryModal modal={modal} setModal={setModal} />
      <UpdateCategoryModal modal={modal} setModal={setModal} />

      <FilterModal
        open={isFilterModalOpen}
        onCancel={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </InnerPageCard>
  );
}
