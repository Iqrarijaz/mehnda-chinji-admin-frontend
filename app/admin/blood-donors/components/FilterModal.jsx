"use client";
import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";
import { FaSearch, FaTimes } from "react-icons/fa";
import SelectBox from "@/components/SelectBox";

const bloodGroups = [
    { value: "A+", label: "A+" },
    { value: "A-", label: "A-" },
    { value: "B+", label: "B+" },
    { value: "B-", label: "B-" },
    { value: "AB+", label: "AB+" },
    { value: "AB-", label: "AB-" },
    { value: "O+", label: "O+" },
    { value: "O-", label: "O-" }
];

const availabilityOptions = [
    { value: "true", label: "Available" },
    { value: "false", label: "Busy / Not Available" }
];

function FilterModal({ isOpen, onClose, filters, onChange }) {
    const [localFilters, setLocalFilters] = useState({
        bloodGroup: filters?.bloodGroup || "",
        available: filters?.available || "",
        search: filters?.search || "",
        city: filters?.city || ""
    });

    useEffect(() => {
        if (isOpen) {
            setLocalFilters({
                bloodGroup: filters?.bloodGroup || "",
                available: filters?.available || "",
                search: filters?.search || "",
                city: filters?.city || ""
            });
        }
    }, [isOpen, filters]);

    const handleApply = () => {
        onChange({
            bloodGroup: localFilters.bloodGroup,
            available: localFilters.available,
            search: localFilters.search,
            city: localFilters.city,
            page: 1
        });
        onClose();
    };

    const handleReset = () => {
        const resetData = {
            bloodGroup: "",
            available: "",
            search: "",
            city: ""
        };
        setLocalFilters(resetData);
        onChange({ ...resetData, page: 1 });
        onClose();
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            width={350}
            title={
                <div className="flex items-center gap-2 text-lg font-semibold">
                    <FaSearch className="text-red-600" />
                    Blood Donor Filters
                </div>
            }
            className="filter-modal"
        >
            <div className="flex flex-col gap-4 py-4">
                {/* Search */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Search
                    </label>
                    <Input
                        placeholder="Search donors..."
                        value={localFilters.search}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
                        prefix={<FaSearch className="text-gray-400" />}
                        allowClear
                        className="w-full"
                    />
                </div>

                {/* Blood Group Filter */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Blood Group
                    </label>
                    <SelectBox
                        placeholder="Select blood group"
                        allowClear
                        value={localFilters.bloodGroup || undefined}
                        handleChange={(value) => setLocalFilters(prev => ({ ...prev, bloodGroup: value || "" }))}
                        className="w-full"
                        width="100%"
                        options={bloodGroups}
                    />
                </div>

                {/* Availability Filter */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Availability
                    </label>
                    <SelectBox
                        placeholder="Select availability"
                        allowClear
                        value={localFilters.available || undefined}
                        handleChange={(value) => setLocalFilters(prev => ({ ...prev, available: value || "" }))}
                        className="w-full"
                        width="100%"
                        options={availabilityOptions}
                    />
                </div>

                {/* City Filter */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        City
                    </label>
                    <Input
                        placeholder="Filter by city..."
                        value={localFilters.city}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, city: e.target.value }))}
                        allowClear
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-2">
                    <button
                        onClick={handleReset}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
