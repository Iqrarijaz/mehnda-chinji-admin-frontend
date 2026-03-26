import React from "react";
import { Select, Input } from "antd";
import ResponsiveFilterModal from "@/components/shared/ResponsiveFilterModal";
import { CopyOutlined } from "@ant-design/icons";

const POST_TYPES = [
    { value: "GENERAL", label: "General" },
    { value: "DEATH", label: "Death Announcement" },
    { value: "ACCIDENT", label: "Accident" },
    { value: "EVENT", label: "Event" },
    { value: "ANNOUNCEMENT", label: "Announcement" }
];

const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" }
];

function FilterModal({ isOpen, onClose, filters, setFilters }) {
    const handleReset = () => {
        setFilters({
            search: "",
            type: undefined,
            status: undefined,
            currentPage: 1,
            pageSize: 10
        });
        if (onClose) onClose();
    };

    const activeCount = [
        filters.search,
        filters.type,
        filters.status
    ].filter(Boolean).length;

    return (
        <ResponsiveFilterModal
            title="Filter Posts"
            icon={<CopyOutlined style={{ fontSize: '16px' }} />}
            open={isOpen}
            onCancel={onClose}
            onApply={onClose}
            onReset={handleReset}
            activeFiltersCount={activeCount}
        >
            <div className="flex flex-col gap-2">
                <div className="space-y-0.5 px-0.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Content Search</label>
                    <Input
                        placeholder="Search by text content..."
                        className="!h-[32px] !rounded !border-slate-200 focus:!border-teal-500 !text-xs"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, currentPage: 1 }))}
                    />
                </div>

                <div className="space-y-0.5 px-0.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Type</label>
                    <Select
                        placeholder="All Types"
                        className="w-full modern-select-box"
                        value={filters.type}
                        onChange={(val) => setFilters(prev => ({ ...prev, type: val, currentPage: 1 }))}
                        allowClear
                    >
                        {POST_TYPES.map(t => (
                            <Select.Option key={t.value} value={t.value}>{t.label}</Select.Option>
                        ))}
                    </Select>
                </div>

                <div className="space-y-0.5 px-0.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
                    <Select
                        placeholder="All Statuses"
                        className="w-full modern-select-box"
                        value={filters.status}
                        onChange={(val) => setFilters(prev => ({ ...prev, status: val, currentPage: 1 }))}
                        allowClear
                    >
                        {STATUS_OPTIONS.map(s => (
                            <Select.Option key={s.value} value={s.value}>{s.label}</Select.Option>
                        ))}
                    </Select>
                </div>
            </div>
        </ResponsiveFilterModal>
    );
}

export default FilterModal;
