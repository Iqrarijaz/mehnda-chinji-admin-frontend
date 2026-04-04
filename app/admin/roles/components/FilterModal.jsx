import React from "react";
import ResponsiveFilterModal from "@/components/shared/ResponsiveFilterModal";
import SearchInput from "@/components/InnerPage/SearchInput";
import { FaShieldAlt } from "react-icons/fa";

function FilterModal({ open, onCancel, filters, setFilters }) {
    return (
        <ResponsiveFilterModal
            open={open}
            onCancel={onCancel}
            title="Filter Roles"
            icon={<FaShieldAlt size={16} />}
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5 px-0.5">
                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight ml-1">Search Role</label>
                    <SearchInput 
                        setFilters={setFilters} 
                        placeholder="Search by name..." 
                        className="w-full !h-[32px] !text-xs !rounded dark:!bg-slate-900 dark:!border-slate-800" 
                    />
                </div>
            </div>
        </ResponsiveFilterModal>
    );
}

export default FilterModal;
