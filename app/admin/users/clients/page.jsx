"use client";
import Link from "next/link";
import React, { useState } from "react";
import ClientContextProvider, {
  useClientContext,
} from "@/context/admin/users/ClientContext";
import AddButton from "@/components/InnerPage/AddButton";
import FilterButton from "@/components/InnerPage/FilterButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import ClientFilterModal from "./components/FilterModal";
import { PATH_ROUTER } from "@/routes";
import ClientTable from "./components/Table";
function Client() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { filters, setFilters } = useClientContext();

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <h1 className="inner-page-title text-3xl text-black p-0 mb-4 md:mb-0">
          Clients
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput setFilters={setFilters} />
          <FilterButton onClick={() => setIsModalOpen(true)} />
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <Link href={PATH_ROUTER.ADD_CLIENT}>
          <AddButton title="Add Client" />
        </Link>
      </div>

      <ClientTable />
      <ClientFilterModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        setFilters={setFilters}
      />
    </>
  );
}

export default function ParentWrapper() {
  return (
    <ClientContextProvider>
      <Client />
    </ClientContextProvider>
  );
}
