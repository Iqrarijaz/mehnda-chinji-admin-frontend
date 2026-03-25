"use client";
import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";
import { FaSearch, FaFilter, FaUndo, FaGlobe, FaLayerGroup, FaMapMarkerAlt } from "react-icons/fa";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";
import { BLOOD_GROUPS } from "@/config/config";

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

    const bloodGroupOptions = BLOOD_GROUPS.map(bg => ({
        value: bg,
        label: (
            <div className="flex items-center gap-2">
                <FaGlobe className="text-red-500" size={10} />
                <span className="text-xs">{bg}</span>
            </div>
        )
    }));

    const availabilityOptions = [
        {
            value: "true",
            label: (
                <div className="flex items-center gap-2">
                    <FaLayerGroup className="text-green-500" size={10} />
                    <span className="text-xs">Available</span>
                </div>
            )
        },
        {
            value: "false",
            label: (
                <div className="flex items-center gap-2">
                    <FaLayerGroup className="text-red-500" size={10} />
                    <span className="text-xs">Busy / Away</span>
                </div>
            )
        }
    ];

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
                        <span className="text-lg font-bold text-slate-900 block">Donor Filters</span>
                        <span className="text-xs text-slate-500 font-normal">Refine the life-saver directory</span>
                    </div>
                </div>
            }
            className="modern-modal"
        >
            <div className="flex flex-col gap-4 p-1 mt-4">
                {/* Search Term */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-slate-600 font-bold text-xs uppercase tracking-tight">Keyword Search</label>
                    <Input
                        placeholder="Search by name..."
                        value={localFilters.search}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, search: e.target.value }))}
                        prefix={<FaSearch className="text-slate-300 mr-2" />}
                        allowClear
                        className="!h-[36px] !rounded-lg !text-xs !border-slate-100 focus:!border-[#006666]"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Blood Group */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-600 font-bold text-xs uppercase tracking-tight">Blood Type</label>
                        <SelectBox
                            placeholder="Any Group"
                            allowClear
                            value={localFilters.bloodGroup || undefined}
                            onChange={(val) => setLocalFilters(prev => ({ ...prev, bloodGroup: val || "" }))}
                            options={bloodGroupOptions}
                            className="!h-[36px] !rounded-lg overflow-hidden border-slate-100"
                        />
                    </div>

                    {/* Availability */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-slate-600 font-bold text-xs uppercase tracking-tight">Status</label>
                        <SelectBox
                            placeholder="Any Status"
                            allowClear
                            value={localFilters.available || undefined}
                            onChange={(val) => setLocalFilters(prev => ({ ...prev, available: val || "" }))}
                            options={availabilityOptions}
                            className="!h-[36px] !rounded-lg overflow-hidden border-slate-100"
                        />
                    </div>
                </div>

                {/* City Search */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-slate-600 font-bold text-xs uppercase tracking-tight">Filter by City</label>
                    <Input
                        placeholder="e.g. Lahore, Karachi"
                        value={localFilters.city}
                        onChange={(e) => setLocalFilters(prev => ({ ...prev, city: e.target.value }))}
                        prefix={<FaMapMarkerAlt className="text-slate-300 mr-2" />}
                        allowClear
                        className="!h-[36px] !rounded-lg !text-xs !border-slate-100 focus:!border-[#006666]"
                    />
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
