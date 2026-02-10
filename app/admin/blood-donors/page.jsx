"use client";
import React, { useState } from "react";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import BloodDonorsTable from "./components/Table";
import BloodDonorsContextProvider, { useBloodDonorsContext } from "@/context/admin/blood-donors/BloodDonorsContext";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";
import AddDonorModal from "./components/AddModal";
import UpdateDonorModal from "./components/UpdateModal";
import { Select } from "antd";
import SelectBox from "@/components/SelectBox";
import FilterModal from "./components/FilterModal";
import { FaFilter } from "react-icons/fa";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function BloodDonorsContent() {
    const { onChange, filters } = useBloodDonorsContext();
    const [modal, setModal] = useState({
        name: null,
        state: false,
        data: null,
    });
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const hasActiveFilters = filters?.bloodGroup || filters?.available || filters?.search || filters?.city;

    return (
        <div className="p-4 md:p-6 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between mb-4">
                <h1 className="inner-page-title text-2xl md:text-3xl text-black p-0 mb-4 md:mb-0 font-semibold">
                    Blood Donors
                </h1>

                {/* Desktop Filters - Hidden on mobile */}
                <div className="hidden md:flex flex-row gap-4">
                    <SelectBox
                        placeholder="Filter by Blood Group"
                        allowClear
                        handleChange={(val) => onChange({ bloodGroup: val || "", page: 1 })}
                        value={filters.bloodGroup}
                        className="w-48"
                        width={null}
                        options={bloodGroups.map(bg => ({ value: bg, label: bg }))}
                    />

                    <SelectBox
                        placeholder="Filter by Availability"
                        allowClear
                        handleChange={(val) => onChange({ available: val === undefined ? "" : val, page: 1 })}
                        value={filters.available}
                        className="w-48"
                        width={null}
                        options={[
                            { value: "true", label: "Available" },
                            { value: "false", label: "Busy / Not Available" }
                        ]}
                    />

                    <SearchInput
                        placeholder="Search donors..."
                        onChange={(e) => onChange({ search: e.target.value, page: 1 })}
                        value={filters.search}
                    />
                </div>
            </div>

            <div className="flex justify-between md:justify-end mb-4 gap-2">
                {/* Mobile Search & Filter Button */}
                <div className="flex md:hidden gap-2 flex-1">
                    <div className="flex-1">
                        <SearchInput
                            placeholder="Search donors..."
                            onChange={(e) => onChange({ search: e.target.value, page: 1 })}
                            value={filters.search}
                        />
                    </div>
                    <button
                        onClick={() => setFilterModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e293b] transition-colors relative"
                    >
                        <FaFilter size={14} />
                        {hasActiveFilters && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>
                </div>

                <div className="flex gap-2">
                    <ItemsPerPageDropdown onChange={onChange} />
                    {/* <AddButton
                        title="Add Donor"
                        icon={false}
                        onClick={() => setModal({ name: "Add", state: true, data: null })}
                    /> */}
                </div>
            </div>

            <BloodDonorsTable modal={modal} setModal={setModal} />

            <FilterModal
                isOpen={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                filters={filters}
                onChange={onChange}
            />

            <UpdateDonorModal modal={modal} setModal={setModal} />
        </div>
    );
}

function BloodDonorsPage() {
    return (
        <BloodDonorsContextProvider>
            <BloodDonorsContent />
        </BloodDonorsContextProvider>
    );
}

export default BloodDonorsPage;
