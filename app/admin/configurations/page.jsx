"use client";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import ConfigurationsTable from "./components/Table";
import AddConfigurationModal from "./components/AddModal";
import UpdateConfigurationModal from "./components/UpdateModal";
import ViewConfigurationModal from "./components/ViewModal";
import { CONFIGURATIONS } from "@/app/api/admin/configurations";
import { useDebounce } from "@/hooks/useDebounce";

import InnerPageCard from "@/components/layout/InnerPageCard";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";

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

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["type", "data", "isActive", "actions"]);

    const columnOptions = [
        { label: "Type", value: "type" },
        { label: "Data (JSON)", value: "data" },
        { label: "Status", value: "isActive" },
    ];

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
    const configurationsList = useQuery({
        queryKey: ["configurationsList", JSON.stringify(debFilter)],
        queryFn: () => CONFIGURATIONS(debFilter),
        onError: () => toast.error("Something went wrong while fetching configurations."),
    });

    const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

    return (
        <InnerPageCard title="Configurations">
            <div className="flex flex-col md:flex-row justify-end mb-3 gap-3 items-center">
                {/* Action Bar (Right) */}
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

                        <AddButton
                            title="Add Config"
                            icon={false}
                            onClick={() => setModal({ name: "Add", data: null, state: true })}
                            className="!h-[32px] !rounded !px-4 !text-[10px] font-medium shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col mb-4">
                <ConfigurationsTable 
                    modal={modal} 
                    setModal={setModal} 
                    configurationsList={configurationsList} 
                    filters={filters} 
                    onChange={onChange}
                    visibleColumns={visibleColumns}
                />
            </div>

            <AddConfigurationModal modal={modal} setModal={setModal} />
            <UpdateConfigurationModal modal={modal} setModal={setModal} />
            <ViewConfigurationModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}
