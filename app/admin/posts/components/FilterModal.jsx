"use client";
import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";
import { FaSearch, FaFilter, FaUndo, FaGlobe, FaTag } from "react-icons/fa";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";

// Post types for filter
const POST_TYPES = [
    { value: "GENERAL", label: "General" },
    { value: "DEATH", label: "Death Announcement" },
    { value: "ACCIDENT", label: "Accident" },
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
        const resetValues = { type: null, status: null, search: "" };
        setLocalFilters(resetValues);
        setFilters(prev => ({
            ...prev,
            ...resetValues,
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
            width={480}
            title={
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500">
                        <FaFilter size={14} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-900 block">Advanced Filters</span>
                        <span className="text-xs text-slate-500 font-normal">Narrow down your post search</span>
                    </div>
                </div>
            }
            className="modern-modal"
        >
            <div className="flex flex-col gap-4 p-1 mt-4">
                {/* Search */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-slate-600 font-bold text-xs uppercase tracking-tight">
                        Search Content
                    </label>
                    <Input
                        placeholder="Search by text content..."
                        value={localFilters.search}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
                        prefix={<FaSearch className="text-slate-300 mr-2" />}
                        allowClear
                        className="!h-[36px] !rounded-lg !text-xs !border-slate-100 focus:!border-[#006666]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Type Filter */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-600 font-bold text-xs uppercase tracking-tight">
                            Post Type
                        </label>
                        <SelectBox
                            placeholder="All Types"
                            allowClear
                            value={localFilters.type}
                            handleChange={(value) => setLocalFilters(prev => ({ ...prev, type: value }))}
                            width="100%"
                            options={POST_TYPES}
                            className="!h-[36px] !rounded-lg"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-600 font-bold text-xs uppercase tracking-tight">
                            Status
                        </label>
                        <SelectBox
                            placeholder="All Status"
                            allowClear
                            value={localFilters.status}
                            handleChange={(value) => setLocalFilters(prev => ({ ...prev, status: value }))}
                            width="100%"
                            options={STATUS_OPTIONS}
                            className="!h-[36px] !rounded-lg"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
          <CustomButton
            label="Reset All"
            type="secondary"
            onClick={handleReset}
            icon={<FaUndo size={12} />}
            className="flex-1"
          />
          <CustomButton
            label="Apply Filters"
            type="primary"
            onClick={handleApply}
            className="flex-1"
          />
        </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
