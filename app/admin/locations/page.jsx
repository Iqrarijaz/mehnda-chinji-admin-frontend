"use client";
import React, { useState } from "react";
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
import FilterModal from "./components/FilterModal";

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

  // Column Visibility State
  const [visibleColumns, setVisibleColumns] = useState(["name_en", "name_ur", "type", "status", "actions"]);

  const columnOptions = [
    { label: "Name (EN)", value: "name_en" },
    { label: "Name (UR)", value: "name_ur" },
    { label: "Type", value: "type" },
    { label: "Status", value: "status" },
  ];

  const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
  const locationsList = useQuery({
    queryKey: ["locationsList", JSON.stringify(debFilter)],
    queryFn: () => LIST_LOCATIONS(debFilter),
    onError: () => toast.error("Something went wrong. Please try again later."),
  });

  const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

  return (
    <InnerPageCard title="Locations">

      <div className="flex flex-col md:flex-row justify-between mb-4 gap-3 items-start md:items-center">
        <h1 className="md:hidden text-2xl font-bold text-slate-800">Locations</h1>

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
              title="Add New Location"
              icon={false}
              onClick={() => setModal({ name: "Add", data: null, state: true })}
              className="!h-[36px] !rounded-xl !px-4 !text-[12px] shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
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
