"use client";
import Link from "next/link";
import React, { useState } from "react";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import PageTable from "./components/Table";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";
import AddBusinessCategoryModal from "./components/AddModal";
import UpdateBusinessCategoryModal from "./components/UpdateModal";
import LocationsContextProvider, { useLocationsContext } from "@/context/admin/locations/LocationsContext";
function Page() {
  const [modal, setModal] = useState({
    name: null,
    data: null,
    state: false,
  });
  const { onChange, setFilters } = useLocationsContext();

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <h1 className="inner-page-title text-2xl md:text-3xl text-black p-0 mb-4 md:mb-0 font-semibold">
          Locations
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput setFilters={setFilters} />
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <ItemsPerPageDropdown onChange={onChange} />
        <AddButton
          title="Add"
          onClick={() => setModal({ name: "Add", data: null, state: true })}
        />
      </div>
      <div className="flex flex-col mb-4 ">
        <PageTable modal={modal} setModal={setModal} />
      </div>

      <AddBusinessCategoryModal modal={modal} setModal={setModal} />
      <UpdateBusinessCategoryModal modal={modal} setModal={setModal} />

    </>
  );
}

export default function ParentWrapper() {
  return (
    <LocationsContextProvider>
      <Page />
    </LocationsContextProvider>
  );
}
