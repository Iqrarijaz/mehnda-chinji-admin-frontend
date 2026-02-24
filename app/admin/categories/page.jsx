"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import CategoryTable from "./components/Table";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";
import AddBusinessCategoryModal from "./components/AddModal";
import UpdateCategoryModal from "./components/UpdateModal";
import { CATEGORIES, GET_CATEGORIES_STATUS_COUNTS } from "@/app/api/admin/categories";
import { useDebounce } from "@/hooks/useDebounce";
import StatCard from "@/components/shared/StatCard";
import InnerPageCard from "@/components/layout/InnerPageCard";

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

  const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
  const categoriesList = useQuery({
    queryKey: ["categoriesList", JSON.stringify(debFilter)],
    queryFn: () => CATEGORIES(debFilter),
    onError: () => toast.error("Something went wrong. Please try again later."),
  });

  const { data: countsData } = useQuery({
    queryKey: ["categoriesStatusCounts"],
    queryFn: GET_CATEGORIES_STATUS_COUNTS,
  });

  const counts = countsData?.data || { active: 0, inactive: 0 };

  const statCards = [
    { label: "Active", key: true, count: counts.active, color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
    { label: "Inactive", key: false, count: counts.inactive, color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
  ];

  const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

  return (
    <InnerPageCard title="Categories">

      {/* Status Count Cards */}
      <div className="flex gap-3 mb-5" style={{ flexWrap: "wrap" }}>
        {statCards.map((card) => (
          <StatCard
            key={String(card.key)}
            title={card.label}
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
        ))}
      </div>

      <div className="flex justify-end mb-4 gap-4 items-center">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput setFilters={setFilters} />
        </div>
        <ItemsPerPageDropdown onChange={onChange} />
        <AddButton title="Add" onClick={() => setModal({ name: "Add", data: null, state: true })} />

      </div>

      <div className="flex flex-col mb-4">
        <CategoryTable modal={modal} setModal={setModal} categoriesList={categoriesList} onChange={onChange} setFilters={setFilters} />
      </div>

      <AddBusinessCategoryModal modal={modal} setModal={setModal} />
      <UpdateCategoryModal modal={modal} setModal={setModal} />
    </InnerPageCard>
  );
}
