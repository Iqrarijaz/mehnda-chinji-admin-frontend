import React from "react";
import { Modal, Button } from "antd";
import SearchInput from "@/components/InnerPage/SearchInput";

function FilterModal({ open, onCancel, filters, setFilters }) {
    return (
        <Modal
            title={<span className="text-lg font-bold text-[#006666]">Search Requests</span>}
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="close" onClick={onCancel} className="!rounded !h-[32px] !text-xs !px-4 font-medium">
                    Close
                </Button>
            ]}
            width={400}
            className="modern-modal"
            centered
        >
            <div className="flex flex-col gap-2">
                <div className="space-y-0.5 px-0.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Search by Name/Subject</label>
                    <SearchInput setFilters={setFilters} className="w-full !h-[32px] !text-xs !rounded" />
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
