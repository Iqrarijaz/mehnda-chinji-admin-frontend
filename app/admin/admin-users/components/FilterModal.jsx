import React from "react";
import { Modal, Button } from "antd";
import SearchInput from "@/components/InnerPage/SearchInput";

function FilterModal({ open, onCancel, filters, setFilters }) {
    return (
        <Modal
            title={<span className="text-lg font-bold text-[#006666]">Search Admin Users</span>}
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
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Search by Name/Email</label>
                    <SearchInput setFilters={setFilters} className="w-full" />
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
