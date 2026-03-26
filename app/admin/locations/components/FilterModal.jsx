import React from "react";
import { Modal, Select } from "antd";
import SearchInput from "@/components/InnerPage/SearchInput";
import { FaGlobe } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

function FilterModal({ open, onCancel, filters, setFilters }) {
    return (
        <Modal
            title={<div className="flex items-center gap-2 px-0 py-1">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <FaGlobe size={14} />
                </div>
                <span className="text-lg font-bold text-blue-700 block mt-1">Filter Locations</span>
            </div>}
            open={open}
            onCancel={onCancel}
            footer={[
                <CustomButton key="close" onClick={onCancel} label="Close" type="secondary" />
            ]}
            width={400}
            className="modern-modal"
            centered
        >
            <div className="flex flex-col gap-2">
                <div className="space-y-0.5 px-0.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Search Locations</label>
                    <SearchInput setFilters={setFilters} className="w-full !h-[32px] !text-xs !rounded" />
                </div>

                <div className="space-y-0.5 px-0.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Type</label>
                    <Select
                        placeholder="Select Level"
                        className="w-full modern-select-box"
                        value={filters.advance}
                        onChange={(val) => setFilters(prev => ({ ...prev, advance: val, currentPage: 1 }))}
                        allowClear
                    >
                        <Select.Option value="DISTRICT">District</Select.Option>
                        <Select.Option value="TEHSIL">Tehsil</Select.Option>
                        <Select.Option value="VILLAGE">Village</Select.Option>
                    </Select>
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
