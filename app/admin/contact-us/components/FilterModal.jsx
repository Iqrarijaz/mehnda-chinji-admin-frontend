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
                <div className="space-y-0.5 px-0.5 transition-colors duration-300">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1 transition-colors duration-300">Search</label>
                    <SearchInput
 setFilters={setFilters} className="w-full !h-[32px] !text-xs !rounded" />
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
