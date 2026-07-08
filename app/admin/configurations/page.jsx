"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import ConfigurationsTable from "./components/Table";
import AddConfigurationModal from "./components/AddModal";
import UpdateConfigurationModal from "./components/UpdateModal";
import ViewConfigurationModal from "./components/ViewModal";
import { HiRefresh } from "react-icons/hi";
import InnerPageCard from "@/components/layout/InnerPageCard";
import { useConfigurations } from "./hooks/useConfigurations";
import { useDebounce } from "@/hooks/useDebounce";
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

    const columnOptions = React.useMemo(() => [
        { label: "Type", value: "type" },
        { label: "Data (JSON)", value: "data" },
        { label: "Status", value: "isActive" },
    ], []);

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
    
    const {
        listQuery: configurationsList,
        isRefreshing,
        handleRefresh
    } = useConfigurations(debFilter);

    const onChange = React.useCallback((data) => setFilters((old) => ({ ...old, ...data })), []);

    return (
        <InnerPageCard>
            <div className="flex flex-col md:flex-row justify-end mb-3 gap-3 items-center">
                {/* Action Bar (Right) */}
                <div className="flex flex-wrap md:flex-nowrap gap-2 items-center w-full md:w-auto justify-end">
                    <div className="hidden md:flex items-center gap-2">
                        <SearchInput setFilters={setFilters} className="!max-w-[180px] !h-[32px] !border-2 !rounded-[2px]" />
                    </div>

                    <div className="flex items-center gap-2">
                        <ColumnVisibilityDropdown
                            options={columnOptions}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                            className="transition-colors duration-300"
                        />

                        {/* Refresh Button */}
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            title="Refresh Data"
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border-2 !rounded-[2px] !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
                        </button>

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
