import React from "react";
import SearchInput from "@/components/InnerPage/SearchInput";
import ResponsiveFilterModal from "@/components/shared/ResponsiveFilterModal";
import { FaFilter } from "react-icons/fa";

function FilterModal({ open, onCancel, filters, setFilters }) {
    const handleReset = () => {
        setFilters((prev) => ({
            ...prev,
            search: "",
            page: 1
        }));
        if (onCancel) onCancel();
    };

    const activeCount = [
        filters.search
    ].filter(Boolean).length;

    return (
        <ResponsiveFilterModal
            title="Filter Connections"
            icon={<FaFilter size={14} />}
            open={open}
            onCancel={onCancel}
            onApply={onCancel}
            onReset={handleReset}
            activeFiltersCount={activeCount}
        >
            <div className="flex flex-col gap-2">
                <div className="space-y-0.5 px-0.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Search Connections</label>
                    <SearchInput
                        setFilters={setFilters}
                        className="w-full !h-[32px] !text-xs !border-2 !rounded-[2px]"
                        placeholder="Search Name or ID"
                    />
                </div>
            </div>
        </ResponsiveFilterModal>
    );
}

export default FilterModal;
