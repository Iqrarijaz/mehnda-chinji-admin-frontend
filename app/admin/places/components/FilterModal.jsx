import React from "react";
import { Modal } from "antd";
import SearchInput from "@/components/InnerPage/SearchInput";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";
import { PLACE_CATEGORIES } from "@/config/config";

function FilterModal({ open, onCancel, filters, setFilters, handleCategoryFilter }) {
    return (
        <Modal
            title={<span className="text-lg font-bold text-[#006666]">Filters & Search</span>}
            open={open}
            onCancel={onCancel}
            footer={[
                <CustomButton
                    key="close"
                    onClick={onCancel}
                    label="Close"
                />
            ]}
            width={400}
            className="modern-modal"
            centered
        >
            <div className="flex flex-col gap-5 py-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Search Places</label>
                    <SearchInput setFilters={setFilters} className="w-full" />
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Category</label>
                    <SelectBox
                        placeholder="Select Category"
                        allowClear
                        handleChange={handleCategoryFilter}
                        width="100%"
                        options={PLACE_CATEGORIES.map((cat) => ({ value: cat.value, label: cat.label }))}
                        className="custom-selectbox w-full"
                    />
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
