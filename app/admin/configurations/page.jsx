"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import ConfigurationsTable from "./components/Table";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";
import AddConfigurationModal from "./components/AddModal";
import UpdateConfigurationModal from "./components/UpdateModal";
import ViewConfigurationModal from "./components/ViewModal";
import { CONFIGURATIONS } from "@/app/api/admin/configurations";
import { useDebounce } from "@/hooks/useDebounce";

export default function ConfigurationsPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [filters, setFilters] = useState({
        itemsPerPage: 10,
        currentPage: 1,
        type: null,
        search: null,
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
    });

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
    const configurationsList = useQuery({
        queryKey: ["configurationsList", JSON.stringify(debFilter)],
        queryFn: () => CONFIGURATIONS(debFilter),
        onError: () => toast.error("Something went wrong while fetching configurations."),
    });

    const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

    return (
        <>
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <h1 className="inner-page-title text-2xl md:text-3xl text-black p-0 mb-4 md:mb-0 font-semibold">
                    Configurations
                </h1>
                <div className="flex flex-col md:flex-row gap-4">
                    <SearchInput setFilters={setFilters} />
                </div>
            </div>

            <div className="flex justify-end mb-4 gap-4">
                <ItemsPerPageDropdown onChange={onChange} />
                <AddButton title="Add Configuration" onClick={() => setModal({ name: "Add", data: null, state: true })} />
            </div>

            <div className="flex flex-col mb-4">
                <ConfigurationsTable modal={modal} setModal={setModal} configurationsList={configurationsList} filters={filters} onChange={onChange} />
            </div>

            <AddConfigurationModal modal={modal} setModal={setModal} />
            <UpdateConfigurationModal modal={modal} setModal={setModal} />
            <ViewConfigurationModal modal={modal} setModal={setModal} />
        </>
    );
}
