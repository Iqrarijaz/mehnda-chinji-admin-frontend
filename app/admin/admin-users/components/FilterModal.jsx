import React from "react";
import { Modal } from "antd";
import SearchInput from "@/components/InnerPage/SearchInput";
import { FaUserShield } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

function FilterModal({ open, onCancel, filters, setFilters }) {
    return (
        <Modal
            title={<div className="flex items-center gap-2 px-0 py-1">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                    <FaUserShield size={14} />
                </div>
                <span className="text-lg font-bold text-teal-700 block mt-1">Search Admin Users</span>
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
            <div className="flex flex-col gap-3 py-1 px-1">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Search by Name/Email</label>
                    <SearchInput setFilters={setFilters} className="w-full" />
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
