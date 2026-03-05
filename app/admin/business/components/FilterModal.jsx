"use client";
import React, { useState, useEffect } from "react";
import { Modal, Input, Button } from "antd";
import { FaSearch, FaFilter, FaUndo } from "react-icons/fa";
import SelectBox from "@/components/SelectBox";

const STATUS_OPTIONS = [
    { value: "PENDING", label: "Pending" },
    { value: "ACTIVE", label: "Active" },
    { value: "REJECTED", label: "Rejected" },
    { value: "SUSPENDED", label: "Suspended" },
];

function FilterModal({ isOpen, onClose, filters, setFilters }) {
    const [localFilters, setLocalFilters] = useState({
        status: filters?.status || null,
        search: filters?.search || "",
    });

    useEffect(() => {
        if (isOpen) {
            setLocalFilters({
                status: filters?.status || null,
                search: filters?.search || "",
            });
        }
    }, [isOpen, filters]);

    const handleApply = () => {
        setFilters((prev) => ({
            ...prev,
            status: localFilters.status,
            search: localFilters.search,
            currentPage: 1,
        }));
        onClose();
    };

    const handleReset = () => {
        const resetValues = { status: null, search: "" };
        setLocalFilters(resetValues);
        setFilters((prev) => ({
            ...prev,
            ...resetValues,
            currentPage: 1,
        }));
        onClose();
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            width={440}
            title={
                <div className="flex items-center gap-3 px-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                        <FaFilter size={16} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 block">Business Filters</span>
                        <span className="text-xs text-slate-500 font-normal">Filter by status or search by name</span>
                    </div>
                </div>
            }
            className="modern-modal"
        >
            <div className="flex flex-col gap-6 p-2 pt-6">
                {/* Search Term */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-700 font-semibold text-sm">Search Businesses</label>
                    <Input
                        placeholder="Search by name, category or phone..."
                        value={localFilters.search}
                        onChange={(e) => setLocalFilters((prev) => ({ ...prev, search: e.target.value }))}
                        prefix={<FaSearch className="text-slate-400 mr-2" />}
                        allowClear
                        className="!h-[44px] !rounded-xl !border-2 !border-slate-100 focus:!border-teal-500"
                    />
                </div>

                {/* Status Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-700 font-semibold text-sm">Status Filter</label>
                    <SelectBox
                        placeholder="All Statuses"
                        allowClear
                        value={localFilters.status}
                        handleChange={(value) => setLocalFilters((prev) => ({ ...prev, status: value }))}
                        className="modern-select-box"
                        width="100%"
                        options={STATUS_OPTIONS}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
                    <Button
                        onClick={handleReset}
                        icon={<FaUndo size={12} />}
                        className="modal-footer-btn-secondary flex-1"
                    >
                        Reset All
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleApply}
                        className="modal-footer-btn-primary flex-1"
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
