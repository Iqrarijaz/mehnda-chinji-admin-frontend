import React from "react";
import { Modal } from "antd";
import SearchInput from "@/components/InnerPage/SearchInput";
import CustomButton from "@/components/shared/CustomButton";
import { FaFilter } from "react-icons/fa";

function FilterModal({ open, onCancel, filters, setFilters }) {
    return (
        <Modal
            title={<div className="flex items-center gap-2 px-0 py-1">
                <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                    <FaFilter size={14} />
                </div>
                <span className="text-lg font-bold text-[#006666] block mt-1">Filter Roles</span>
            </div>}
            open={open}
            onCancel={onCancel}
            footer={[
                <CustomButton key="close" onClick={onCancel} label="Close" className="!h-[32px] !text-xs" />
            ]}
            width={400}
            className="modern-modal"
            centered
        >
            <div className="flex flex-col gap-2">
                <div className="space-y-0.5 px-0.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Search Role</label>
                    <SearchInput setFilters={setFilters} placeholder="Search..." className="w-full !h-[32px] !text-xs !rounded" />
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
