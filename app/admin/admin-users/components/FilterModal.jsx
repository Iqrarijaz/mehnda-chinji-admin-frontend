import React from "react";
import { Modal } from "antd";
import SearchInput from "@/components/InnerPage/SearchInput";
import { FaUserShield } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

function FilterModal({ open, onCancel, filters, setFilters }) {
    return (
        <Modal
            title={<div className="flex items-center gap-2 px-0 py-1">
                <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                    <FaUserShield size={14} />
                </div>
                <span className="text-lg font-bold text-[#006666] block mt-1">Search Admin Users</span>
            </div>}
            open={open}
            onCancel={onCancel}
            footer={[
                <CustomButton key="close" onClick={onCancel} label="Close" />
            ]}
            width={400}
            className="modern-modal"
            centered
        >
            <div className="flex flex-col gap-2">
                <div className="space-y-0.5 px-0.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Search by Name/Email</label>
                    <SearchInput setFilters={setFilters} className="w-full !h-[32px] !text-xs !rounded" />
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
