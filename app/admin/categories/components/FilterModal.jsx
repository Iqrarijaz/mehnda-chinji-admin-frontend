import React from "react";
import { Modal, Button, Select } from "antd";
import SearchInput from "@/components/InnerPage/SearchInput";

function FilterModal({ open, onCancel, filters, setFilters }) {
    return (
        <Modal
            title={<span className="text-lg font-bold text-[#006666]">Filter Categories</span>}
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="close" onClick={onCancel} className="!rounded-lg !h-10 !px-6 font-medium">
                    Close
                </Button>
            ]}
            width={400}
            className="modern-modal"
            centered
        >
            <div className="flex flex-col gap-5 py-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Search Categories</label>
                    <SearchInput setFilters={setFilters} pageKey="currentPage" className="w-full" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Type</label>
                    <Select
                        placeholder="Select Type"
                        className="w-full !h-11 custom-select"
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
