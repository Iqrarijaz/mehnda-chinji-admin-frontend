import React from "react";
import { Modal, Select, Input } from "antd";
import { FaHeartbeat } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function FilterModal({ isOpen, onClose, filters, onChange }) {
    return (
        <Modal
            title={<div className="flex items-center gap-2 px-0 py-1">
                <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                    <FaHeartbeat size={14} />
                </div>
                <span className="text-lg font-bold text-[#006666] block mt-1">Filter Donors</span>
            </div>}
            open={isOpen}
            onCancel={onClose}
            footer={[
                <CustomButton key="close" onClick={onClose} label="Close" />
            ]}
            width={400}
            className="modern-modal"
            centered
        >
            <div className="flex flex-col gap-2">
                <div className="space-y-0.5 px-0.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Search Donor</label>
                    <Input
                        placeholder="Search by name or phone..."
                        className="!h-[32px] !rounded !border-slate-200 !text-xs"
                        value={filters.search}
                        onChange={(e) => onChange({ search: e.target.value, page: 1 })}
                    />
                </div>

                <div className="space-y-0.5 px-0.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Blood Group</label>
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
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">City</label>
                    <Input
                        placeholder="Filter by city..."
                        className="!h-[32px] !rounded !border-slate-200 !text-xs"
                        value={filters.city}
                        onChange={(e) => onChange({ city: e.target.value, page: 1 })}
                    />
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
