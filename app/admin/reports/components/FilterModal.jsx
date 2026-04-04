import React from "react";
import { Select } from "antd";
import SearchInput from "@/components/InnerPage/SearchInput";
import ResponsiveFilterModal from "@/components/shared/ResponsiveFilterModal";

const TARGET_TYPES = [
    { label: "Business", value: "BUSINESS" },
    { label: "Donor", value: "DONOR" },
    { label: "Place", value: "PLACE" },
];

function FilterModal({ open, onCancel, filters, setFilters }) {
    return (
        <ResponsiveFilterModal
            open={open}
            onCancel={onCancel}
            title="Filter Reports"
        >
            <div className="flex flex-col gap-3">
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 transition-colors duration-300">Search Reports</label>
                    <SearchInput setFilters={setFilters} pageKey="currentPage" className="w-full !h-[32px] !text-xs !rounded dark:!bg-slate-900 dark:!border-slate-800" />
                </div>

                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 transition-colors duration-300">Target Type</label>
                    <Select
                        placeholder="Select Target Type"
                        className="w-full modern-select-box"
                        value={filters.targetType}
                        onChange={(val) => setFilters(prev => ({ ...prev, targetType: val || null, currentPage: 1 }))}
                        allowClear
                        popupClassName="dark-select-popup"
                    >
                        {TARGET_TYPES.map(t => (
                            <Select.Option key={t.value} value={t.value}>{t.label}</Select.Option>
                        ))}
                    </Select>
                </div>
            </div>
        </ResponsiveFilterModal>
    );
}

export default FilterModal;
