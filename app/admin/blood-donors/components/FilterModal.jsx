import React from "react";
import { Modal, Button, Select, Input } from "antd";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function FilterModal({ isOpen, onClose, filters, onChange }) {
    return (
        <Modal
            title={<span className="text-lg font-bold text-[#006666]">Filter Blood Donors</span>}
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
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Search Donor</label>
                    <Input
                        placeholder="Search by name or phone..."
                        className="!h-11 !rounded-xl !border-slate-200"
                        value={filters.search}
                        onChange={(e) => onChange({ search: e.target.value, page: 1 })}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Blood Group</label>
                    <Select
                        placeholder="Select Blood Group"
                        className="w-full !h-11 custom-select"
                        value={filters.bloodGroup || undefined}
                        onChange={(val) => onChange({ bloodGroup: val || "", page: 1 })}
                        allowClear
                    >
                        {bloodGroups.map(bg => (
                            <Select.Option key={bg} value={bg}>{bg}</Select.Option>
                        ))}
                    </Select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">City</label>
                    <Input
                        placeholder="Filter by city..."
                        className="!h-11 !rounded-xl !border-slate-200"
                        value={filters.city}
                        onChange={(e) => onChange({ city: e.target.value, page: 1 })}
                    />
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
