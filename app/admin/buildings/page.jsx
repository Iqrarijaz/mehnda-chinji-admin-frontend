"use client";
import Link from "next/link";
import React, { useState } from "react";
import AddButton from "@/components/InnerPage/AddButton";
import FilterButton from "@/components/InnerPage/FilterButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import { PATH_ROUTER } from "@/routes";
import ClientTable from "./components/Table";
import BuildingContextProvider, { useBuildingContext } from "@/context/admin/buildings/BuildingContext";
import BuildingFilterModal from "./components/FilterModal";
function Building() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { filters, setFilters } = useBuildingContext();

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <h1 className="inner-page-title text-3xl text-black p-0 mb-4 md:mb-0">
          Buildings
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput setFilters={setFilters} />
          <FilterButton onClick={() => setIsModalOpen(true)} />
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <Link href={PATH_ROUTER.ADD_BUILDING}>
          <AddButton title="Add Building" />
        </Link>
      </div>

      <ClientTable />
      <BuildingFilterModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setFilters={setFilters}
      />
    </>
  );
}

export default function ParentWrapper() {
  return (
    <BuildingContextProvider>
      <Building />
    </BuildingContextProvider>
  );
}
