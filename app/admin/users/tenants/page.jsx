"use client";
import Link from "next/link";
import React, { useState } from "react";
import AddButton from "@/components/InnerPage/AddButton";
import FilterButton from "@/components/InnerPage/FilterButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import TenantContextProvider, {
  useTenantContext,
} from "@/context/admin/users/TenantContext";
import TenantFilterModal from "./components/FilterModal";
import { PATH_ROUTER } from "@/routes";
import TenantTable from "./components/Table";

function Tenant() {
  const [isModalOpen, setIsModalOpen] = useState({
    name: null,
    state: false,
  });
  const { setFilters } = useTenantContext();

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <h1 className="inner-page-title text-3xl text-black p-0 mb-4 md:mb-0">
          Tenant
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput setFilters={setFilters} />
          <FilterButton
            onClick={() => setIsModalOpen({ name: "filter", state: true })}
          />
          {/* <IoReloadCircleSharp size={40} className="cursor-pointer"/> */}
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <Link href={PATH_ROUTER.ADD_TENANT}>
          <AddButton title="Add Tenant" />
        </Link>
      </div>
      <TenantTable />
      <TenantFilterModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setFilters={setFilters}
      />
    </>
  );
}

export default function ParentWrapper() {
  return (
    <TenantContextProvider>
      <Tenant />
    </TenantContextProvider>
  );
}
