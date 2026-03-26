import React from "react";
import { Modal, Button, Select } from "antd";
import SearchInput from "@/components/InnerPage/SearchInput";
import { FaShapes } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

function FilterModal({ open, onCancel, filters, setFilters }) {
    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaShapes size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-teal-700 block mt-1">Filter Categories</span>
                    </div>
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={[
                <CustomButton key="close" label="Close" type="secondary" onClick={onCancel} className="w-full" />
            ]}
            width={400}
            className="modern-modal"
            centered
        >
            <div className="flex flex-col gap-2">
                <div className="space-y-0.5 px-0.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Search Categories</label>
                    <SearchInput setFilters={setFilters} pageKey="currentPage" className="w-full !h-[32px] !text-xs !rounded" />
                </div>

                <div className="space-y-0.5 px-0.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Type</label>
                    <Select
                        placeholder="Select Type"
                        className="w-full modern-select-box"
                        value={filters.advance}
                        onChange={(val) => setFilters(prev => ({ ...prev, advance: val, currentPage: 1 }))}
                        allowClear
                    >
                        <Select.Option value="BUSINESS">Business</Select.Option>
                        <Select.Option value="PLACE">Place</Select.Option>
                        <Select.Option value="BLOOD_DONOR">Blood Donor</Select.Option>
                    </Select>
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
