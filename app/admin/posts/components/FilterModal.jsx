import React from "react";
import { Modal, Button, Select, Input } from "antd";

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
    return (
        <Modal
            title={<span className="text-lg font-bold text-[#006666]">Filter Posts</span>}
            open={isOpen}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose} className="!rounded-lg !h-10 !px-6 font-medium">
                    Close
                </Button>
            ]}
            width={400}
            className="modern-modal"
            centered
        >
            <div className="flex flex-col gap-5 py-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Search Content</label>
                    <Input
                        placeholder="Search by text content..."
                        className="!h-11 !rounded-xl !border-slate-200"
                        value={filters.search}
                        onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, currentPage: 1 }))}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Post Type</label>
                    <Select
                        placeholder="Select Type"
                        className="w-full !h-11 custom-select"
                        value={filters.type}
                        onChange={(val) => setFilters(prev => ({ ...prev, type: val, currentPage: 1 }))}
                        allowClear
                    >
                        {POST_TYPES.map(t => (
                            <Select.Option key={t.value} value={t.value}>{t.label}</Select.Option>
                        ))}
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Status</label>
                    <Select
                        placeholder="Select Status"
                        className="w-full !h-11 custom-select"
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
        </Modal>
    );
}

export default FilterModal;
