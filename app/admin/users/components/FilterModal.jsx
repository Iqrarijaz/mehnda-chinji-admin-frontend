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
            <div className="flex flex-col gap-2">
                <div className="space-y-0.5 px-0.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Search</label>
                    <SearchInput 
                        setFilters={setFilters} 
                        className="w-full !h-[32px] !text-xs !rounded" 
                        placeholder="Search by name or email..."
                    />
                </div>

                <div className="space-y-0.5 px-0.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Gender</label>
                    <Select
                        placeholder="All Genders"
                        className="w-full modern-select-box"
                        value={filters.gender}
                        onChange={handleGenderChange}
                        allowClear
                    >
                        <Select.Option value="MALE">Male</Select.Option>
                        <Select.Option value="FEMALE">Female</Select.Option>
                    </Select>
                </div>
            </div>
        </ResponsiveFilterModal>
    );
}

export default FilterModal;
