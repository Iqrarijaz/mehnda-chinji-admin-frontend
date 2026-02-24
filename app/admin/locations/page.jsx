"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import PageTable from "./components/Table";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";
import AddLocationModal from "./components/AddModal";
import UpdateLocationModal from "./components/UpdateModal";
import { LIST_LOCATIONS } from "@/app/api/admin/locations";
import { useDebounce } from "@/hooks/useDebounce";
import InnerPageCard from "@/components/layout/InnerPageCard";

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

  const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
  const locationsList = useQuery({
    queryKey: ["locationsList", JSON.stringify(debFilter)],
    queryFn: () => LIST_LOCATIONS(debFilter),
    onError: () => toast.error("Something went wrong. Please try again later."),
  });

  const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

  return (
    <InnerPageCard title="Locations">

      <div className="flex justify-end mb-4 gap-4 items-center">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput setFilters={setFilters} />
        </div>
        <ItemsPerPageDropdown onChange={onChange} />
        <AddButton title="Add" onClick={() => setModal({ name: "Add", data: null, state: true })} />

      </div>

      <div className="flex flex-col mb-4">
        <PageTable modal={modal} setModal={setModal} locationsList={locationsList} onChange={onChange} setFilters={setFilters} />
      </div>

      <AddLocationModal modal={modal} setModal={setModal} />
      <UpdateLocationModal modal={modal} setModal={setModal} />
    </InnerPageCard>
  );
}
