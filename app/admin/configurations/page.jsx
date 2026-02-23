"use client";

import React, { useState } from "react";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import ConfigurationsTable from "./components/Table";
import ConfigurationsContextProvider, { useConfigurationsContext } from "@/context/admin/configurations/ConfigurationsContext";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";
import AddConfigurationModal from "./components/AddModal";
import UpdateConfigurationModal from "./components/UpdateModal";
import ViewConfigurationModal from "./components/ViewModal";

function ConfigurationsContent() {
    const [modal, setModal] = useState({
        name: null,
        data: null,
        state: false,
    });
    const { filters, setFilters, onChange } = useConfigurationsContext();

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
                <AddButton
                    title="Add Configuration"
                    onClick={() => setModal({ name: "Add", data: null, state: true })}
                />
            </div>

            <div className="flex flex-col mb-4">
                <ConfigurationsTable modal={modal} setModal={setModal} />
            </div>

            <AddConfigurationModal modal={modal} setModal={setModal} />
            <UpdateConfigurationModal modal={modal} setModal={setModal} />
            <ViewConfigurationModal modal={modal} setModal={setModal} />
        </>
    );
}

export default function ConfigurationsPage() {
    return (
        <ConfigurationsContextProvider>
            <ConfigurationsContent />
        </ConfigurationsContextProvider>
    );
}
