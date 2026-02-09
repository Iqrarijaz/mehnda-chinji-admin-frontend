"use client";
import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";
import { FaSearch, FaTimes } from "react-icons/fa";
import SelectBox from "@/components/SelectBox";

// Post types for filter
const POST_TYPES = [
    { value: "GENERAL", label: "General" },
    { value: "DEATH", label: "Death" },
    { value: "EVENT", label: "Event" },
    { value: "ANNOUNCEMENT", label: "Announcement" }
];

// Status options for filter
const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" }
];

function FilterModal({ isOpen, onClose, filters, setFilters }) {
    const [localFilters, setLocalFilters] = useState({
        type: filters?.type || null,
        status: filters?.status || null,
        search: filters?.search || ""
    });

    useEffect(() => {
        if (isOpen) {
            setLocalFilters({
                type: filters?.type || null,
                status: filters?.status || null,
                search: filters?.search || ""
            });
        }
    }, [isOpen, filters]);

    const handleApply = () => {
        setFilters(prev => ({
            ...prev,
            type: localFilters.type,
            status: localFilters.status,
            search: localFilters.search,
            currentPage: 1
        }));
        onClose();
    };

    const handleReset = () => {
        setLocalFilters({
            type: null,
            status: null,
            search: ""
        });
        setFilters(prev => ({
            ...prev,
            type: null,
            status: null,
            search: "",
            currentPage: 1
        }));
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
                    <FaSearch className="text-primary" />
                    Filters
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
                        placeholder="Search posts..."
                        value={localFilters.search}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
                        prefix={<FaSearch className="text-gray-400" />}
                        allowClear
                        className="w-full"
                    />
                </div>

                {/* Type Filter */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Post Type
                    </label>
                    <SelectBox
                        placeholder="Select type"
                        allowClear
                        value={localFilters.type}
                        handleChange={(value) => setLocalFilters(prev => ({ ...prev, type: value }))}
                        className="w-full"
                        width="100%"
                        options={POST_TYPES}
                    />
                </div>

                {/* Status Filter */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Status
                    </label>
                    <SelectBox
                        placeholder="Select status"
                        allowClear
                        value={localFilters.status}
                        handleChange={(value) => setLocalFilters(prev => ({ ...prev, status: value }))}
                        className="w-full"
                        width="100%"
                        options={STATUS_OPTIONS}
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
                        className="flex-1 px-4 py-2.5 bg-[#0F172A] hover:bg-[#1e293b] rounded-lg text-white font-medium transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
