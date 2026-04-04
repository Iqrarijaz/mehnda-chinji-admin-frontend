import React from "react";
import { Select, Input } from "antd";
import { FaHeartbeat } from "react-icons/fa";
import ResponsiveFilterModal from "@/components/shared/ResponsiveFilterModal";
import SearchInput from "@/components/InnerPage/SearchInput";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function FilterModal({ isOpen, onClose, filters, onChange }) {
    const handleReset = () => {
        onChange({
            search: "",
            bloodGroup: "",
            city: "",
            page: 1
        });
        onClose();
    };

    const activeCount = [
        filters.search,
        filters.bloodGroup,
        filters.city
    ].filter(Boolean).length;

    return (
        <ResponsiveFilterModal
            title="Blood Donors"
            icon={<FaHeartbeat size={18} />}
            open={isOpen}
            onCancel={onClose}
            onApply={onClose}
            onReset={handleReset}
            activeFiltersCount={activeCount}
        >
            <div className="flex flex-col gap-2">
                <div className="space-y-0.5 px-0.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Search</label>
                    <Input
                        placeholder="Search by name or phone..."
                        className="!h-[32px] !rounded !border-slate-200 dark:!border-slate-800 !text-xs dark:!bg-slate-900/50"
                        value={filters.search}
                        onChange={(e) => onChange({ search: e.target.value, page: 1 })}
                    />
                </div>

                <div className="space-y-0.5 px-0.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
                    <Select
                        placeholder="Select Blood Group"
                        className="w-full modern-select-box"
                        value={filters.bloodGroup || undefined}
                        onChange={(val) => onChange({ bloodGroup: val || "", page: 1 })}
                        allowClear
                    >
                        {bloodGroups.map(bg => (
                            <Select.Option key={bg} value={bg}>{bg}</Select.Option>
                        ))}
                    </Select>
                </div>

                <div className="space-y-0.5 px-0.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">City</label>
                    <Input
                        placeholder="City..."
                        className="!h-[32px] !rounded !border-slate-200 dark:!border-slate-800 !text-xs dark:!bg-slate-900/50"
                        value={filters.city}
                        onChange={(e) => onChange({ city: e.target.value, page: 1 })}
                    />
                </div>
            </div>
        </ResponsiveFilterModal>
    );
}

export default FilterModal;
