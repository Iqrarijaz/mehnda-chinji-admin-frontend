"use client";
import React, { useState, useEffect } from "react";
import { Modal, Input, Button, Select } from "antd";
import { FaSearch, FaFilter, FaUndo, FaTint, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";

const { Option } = Select;

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function FilterModal({ isOpen, onClose, filters, onChange }) {
    const [localFilters, setLocalFilters] = useState({
        bloodGroup: "",
        available: "",
        search: "",
        city: ""
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
            ...localFilters,
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
            width={440}
            title={
                <div className="flex items-center gap-3 px-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                        <FaFilter size={16} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 block">Donor Filters</span>
                        <span className="text-xs text-slate-500 font-normal">Refine the life-saver directory</span>
                    </div>
                </div>
            }
            className="modern-modal"
        >
            <div className="flex flex-col gap-6 p-2 pt-6">
                {/* Search Term */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-700 font-semibold text-sm">Keyword Search</label>
                    <Input
                        placeholder="Search by name..."
                        value={localFilters.search}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
                        prefix={<FaSearch className="text-slate-400 mr-2" />}
                        allowClear
                        className="!h-[44px] !rounded-xl !border-2 !border-slate-100 focus:!border-teal-500 shadow-sm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Blood Group */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-700 font-semibold text-sm">Blood Type</label>
                        <Select
                            placeholder="Any Group"
                            allowClear
                            value={localFilters.bloodGroup || undefined}
                            onChange={(val) => setLocalFilters(prev => ({ ...prev, bloodGroup: val || "" }))}
                            className="!h-[44px] !rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm"
                            size="large"
                        >
                            {bloodGroups.map(bg => (
                                <Option key={bg} value={bg}>
                                    <div className="flex items-center gap-2">
                                        <FaTint className="text-red-500" size={10} />
                                        <span>{bg}</span>
                                    </div>
                                </Option>
                            ))}
                        </Select>
                    </div>

                    {/* Availability */}
                    <div className="flex flex-col gap-2">
                        <label className="text-slate-700 font-semibold text-sm">Status</label>
                        <Select
                            placeholder="Any Status"
                            allowClear
                            value={localFilters.available || undefined}
                            onChange={(val) => setLocalFilters(prev => ({ ...prev, available: val || "" }))}
                            className="!h-[44px] !rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm"
                            size="large"
                        >
                            <Option value="true">Available</Option>
                            <Option value="false">Busy / Away</Option>
                        </Select>
                    </div>
                </div>

                {/* City Search */}
                <div className="flex flex-col gap-2">
                    <label className="text-slate-700 font-semibold text-sm">Filter by City</label>
                    <Input
                        placeholder="e.g. Lahore, Karachi"
                        value={localFilters.city}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, city: e.target.value }))}
                        prefix={<FaMapMarkerAlt className="text-slate-400 mr-2" />}
                        allowClear
                        className="!h-[44px] !rounded-xl !border-2 !border-slate-100 focus:!border-teal-500 shadow-sm"
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-slate-100">
                    <Button
                        onClick={handleReset}
                        icon={<FaUndo size={12} />}
                        className="modal-footer-btn-secondary flex-1"
                    >
                        Reset
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleApply}
                        className="modal-footer-btn-primary flex-1 bg-red-600 hover:bg-red-700 border-none"
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
