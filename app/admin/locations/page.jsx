"use client";
import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import PageTable from "./components/Table";
import AddLocationModal from "./components/AddModal";
import UpdateLocationModal from "./components/UpdateModal";
import { LIST_LOCATIONS } from "@/app/api/admin/locations";
import { useDebounce } from "@/hooks/useDebounce";
import InnerPageCard from "@/components/layout/InnerPageCard";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { FiFilter } from "react-icons/fi";
import { HiRefresh } from "react-icons/hi";
import FilterModal from "./components/FilterModal";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

export default function LocationsPage() {
  const [modal, setModal] = useState({ name: null, data: null, state: false });
  const [filters, setFilters] = useState({
    itemsPerPage: 20,
    currentPage: 1,
    search: null,
    sortOrder: -1,
    sortingKey: "_id",
    onChangeSearch: false,
    advance: null,
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const columnOptions = [
    { label: "Location Name", value: "name_en" },
    { label: "Type", value: "type" },
    { label: "Status", value: "status" },
  ];

  const [visibleColumns, setVisibleColumns] = useState(["name_en", "type", "status"]);

  const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);

  const {
    listQuery: locationsList,
    isRefreshing,
    handleRefresh
  } = useAdminData({
    listQueryKey: [ADMIN_KEYS.LOCATIONS.LIST, JSON.stringify(debFilter)],
    listQueryFn: () => LIST_LOCATIONS(debFilter),
    onListError: "Failed to fetch locations.",
  });

  const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

  return (
    <InnerPageCard title="Locations">

      <div className="flex flex-col md:flex-row justify-between mb-4 gap-3 items-start md:items-center">
        <h1 className="md:hidden text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">Locations</h1>

        <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full md:w-auto justify-end">
          {/* Desktop Search (Visible on Tablet/Desktop) */}
          <div className="hidden md:block">
            <SearchInput setFilters={setFilters} className="!max-w-[180px]" />
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

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsFilterModalOpen(true)}
              className="mobile-filter-btn md:hidden"
              title="Filters"
            >
              <FiFilter size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <AddButton
              title="Add New Location"
              icon={false}
              onClick={() => setModal({ name: "Add", data: null, state: true })}
              className="!h-[32px] !rounded !px-4 !text-[10px] font-medium shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <PageTable modal={modal} setModal={setModal} locationsList={locationsList} onChange={onChange} setFilters={setFilters} visibleColumns={visibleColumns} />
      </div>

      <AddLocationModal modal={modal} setModal={setModal} />
      <UpdateLocationModal modal={modal} setModal={setModal} />

      <FilterModal
        open={isFilterModalOpen}
        onCancel={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
      />
    </InnerPageCard>
  );
}
