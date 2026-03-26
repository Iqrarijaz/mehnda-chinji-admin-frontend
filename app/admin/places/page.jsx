"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import PlacesTable from "./components/Table";
import AddPlaceModal from "./components/AddModal";
import UpdatePlaceModal from "./components/UpdateModal";
import { GET_PLACES, GET_PLACE_STATUS_COUNTS } from "@/app/api/admin/places";
import { PLACE_CATEGORIES } from "@/config/config";
import SelectBox from "@/components/SelectBox";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { StatCardSkeleton } from "@/components/shared/Skeletons";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { FiFilter } from "react-icons/fi";
import FilterModal from "./components/FilterModal";

export default function PlacesPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        itemsPerPage: 20,
        currentPage: 1,
        search: null,
        categoryId: null,
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
        advance: null,
        status: null,
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["name", "category", "address", "contact", "status", "isActive", "createdAt", "actions"]);

    const columnOptions = [
        { label: "Name", value: "name" },
        { label: "Category", value: "category" },
        { label: "Address", value: "address" },
        { label: "Contact", value: "contact" },
        { label: "Reg. Status", value: "status" },
        { label: "Active", value: "isActive" },
        { label: "Created At", value: "createdAt" },
    ];

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
    const placesList = useQuery({
        queryKey: ["placesList", JSON.stringify(debFilter)],
        queryFn: () => GET_PLACES(debFilter),
        onError: () => toast.error("Something went wrong. Please try again later."),
    });

    const { data: countsData, isLoading: countsLoading } = useQuery({
        queryKey: ["placeStatusCounts"],
        queryFn: GET_PLACE_STATUS_COUNTS,
    });

    const counts = countsData?.data || { approved: 0, pending: 0, rejected: 0 };

    const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

    const handleCategoryFilter = (value) => {
        setFilters((prev) => ({ ...prev, categoryId: value || null, currentPage: 1 }));
    };

    const statCards = [
        { label: "Approved", short: "App", key: "APPROVED", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
        { label: "Pending", short: "Pen", key: "PENDING", color: "#ea580c", bg: "#fff7ed", border: "#fed7aa" },
        { label: "Rejected", short: "Rej", key: "REJECTED", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
    ];

    return (
        <InnerPageCard title="Places">

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
                                count={card.key === "APPROVED" ? counts.approved : card.key === "PENDING" ? counts.pending : counts.rejected}
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

                {/* Filter, Search and Add Button (Right) */}
                <div className="flex gap-2 items-center w-full md:w-auto justify-end">
                    {/* Desktop Filters (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-3 mr-1">
                        <SelectBox
                            placeholder="Filter by Category"
                            allowClear
                            handleChange={handleCategoryFilter}
                            width={150}
                            options={PLACE_CATEGORIES.map((cat) => ({ value: cat.value, label: cat.label }))}
                            className="custom-selectbox"
                        />
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
                            title="Add Place"
                            icon={false}
                            onClick={() => setModal({ name: "Add", data: null, state: true })}
                            className="!h-[36px] !rounded !px-4 !text-[12px] shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <PlacesTable
                    modal={modal}
                    setModal={setModal}
                    placesList={placesList}
                    onChange={onChange}
                    setFilters={setFilters}
                    visibleColumns={visibleColumns}
                />
            </div>

            <AddPlaceModal modal={modal} setModal={setModal} />
            <UpdatePlaceModal modal={modal} setModal={setModal} />

            <FilterModal
                open={isFilterModalOpen}
                onCancel={() => setIsFilterModalOpen(false)}
                filters={filters}
                setFilters={setFilters}
                handleCategoryFilter={handleCategoryFilter}
            />
        </InnerPageCard>
    );
}
