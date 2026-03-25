import React from "react";
import { Modal, Button, Select } from "antd";
import SearchInput from "@/components/InnerPage/SearchInput";

const TARGET_TYPES = [
    { label: "Business", value: "BUSINESS" },
    { label: "Donor", value: "DONOR" },
    { label: "Place", value: "PLACE" },
];

function FilterModal({ open, onCancel, filters, setFilters }) {
    return (
        <Modal
            title={<span className="text-lg font-bold text-[#006666]">Filter Reports</span>}
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="close" onClick={onCancel} className="!rounded !h-10 !px-6 font-medium">
                    Close
                </Button>
            ]}
            width={400}
            className="modern-modal"
            centered
        >
            <div className="flex flex-col gap-5 py-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Search Reports</label>
                    <SearchInput setFilters={setFilters} pageKey="currentPage" className="w-full" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Target Type</label>
                    <Select
                        placeholder="Select Target Type"
                        className="w-full !h-11 custom-select"
                        value={filters.targetType}
                        onChange={(val) => setFilters(prev => ({ ...prev, targetType: val || null, currentPage: 1 }))}
                        allowClear
                    >
                        {TARGET_TYPES.map(t => (
                            <Select.Option key={t.value} value={t.value}>{t.label}</Select.Option>
                        ))}
                    </Select>
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
