import React from "react";
import { Select } from "antd";
import SearchInput from "@/components/InnerPage/SearchInput";
import ResponsiveFilterModal from "@/components/shared/ResponsiveFilterModal";
import { UserOutlined } from "@ant-design/icons";

function FilterModal({ open, onCancel, filters, setFilters }) {
    const handleGenderChange = (value) => {
        setFilters((prev) => ({ ...prev, gender: value, page: 1 }));
    };

    const handleReset = () => {
        setFilters({
            gender: undefined,
            search: "",
            page: 1,
            pageSize: 10
        });
        if (onCancel) onCancel();
    };

    // Count active filters (excluding default page/pageSize)
    const activeCount = [
        filters.gender,
        filters.search
    ].filter(Boolean).length;

    return (
        <ResponsiveFilterModal
            title="Filter App Users"
            icon={<UserOutlined style={{ fontSize: '18px' }} />}
            open={open}
            onCancel={onCancel}
            onApply={onCancel}
            onReset={handleReset}
            activeFiltersCount={activeCount}
        >
            <div className="modal-section">
                <label className="section-label">Search</label>
                <SearchInput 
                    setFilters={setFilters} 
                    className="w-full !h-11 !rounded !border-slate-200 focus:!border-teal-500 shadow-sm" 
                    placeholder="Search by name or email..."
                />
            </div>

            <div className="modal-section">
                <label className="section-label">User Details</label>
                <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[13px] font-medium text-slate-600 ml-1">Gender</label>
                        <Select
                            placeholder="All Genders"
                            className="w-full modern-select-box !h-11 shadow-sm"
                            value={filters.gender}
                            onChange={handleGenderChange}
                            allowClear
                        >
                            <Select.Option value="MALE">Male</Select.Option>
                            <Select.Option value="FEMALE">Female</Select.Option>
                        </Select>
                    </div>
                </div>
            </div>
        </ResponsiveFilterModal>
    );
}

export default FilterModal;
