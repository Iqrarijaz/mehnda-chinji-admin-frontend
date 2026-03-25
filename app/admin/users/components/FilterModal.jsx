import React from "react";
import { Modal, Button, Select } from "antd";
import SearchInput from "@/components/InnerPage/SearchInput";

function FilterModal({ open, onCancel, filters, setFilters }) {
    const handleGenderChange = (value) => {
        setFilters((prev) => ({ ...prev, gender: value, page: 1 }));
    };

    return (
        <Modal
            title={<span className="text-lg font-bold text-[#006666]">Filter App Users</span>}
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
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Search Users</label>
                    <SearchInput setFilters={setFilters} className="w-full" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Gender</label>
                    <Select
                        placeholder="Select Gender"
                        className="w-full !h-11 custom-select"
                        value={filters.gender}
                        onChange={handleGenderChange}
                        allowClear
                    >
                        <Select.Option value="MALE">Male</Select.Option>
                        <Select.Option value="FEMALE">Female</Select.Option>
                    </Select>
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
