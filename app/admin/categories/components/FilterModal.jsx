"use client";
import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";
import { FaSearch, FaFilter, FaUndo, FaGlobe, FaLayerGroup } from "react-icons/fa";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";


function FilterModal({ isModalOpen, setIsModalOpen, setFilters }) {
  const [localFilters, setLocalFilters] = useState({
    name: "",
    type: null,
    status: null,
  });

  useEffect(() => {
    if (isModalOpen) {
      // Ideally we'd sync from existing filters, but the original logic reset them
      setLocalFilters({
        name: "",
        type: null,
        status: null,
      });
    }
  }, [isModalOpen]);

  const handleApply = () => {
    setFilters((prev) => ({
      ...prev,
      advance: {
        name: localFilters.name?.trim() || null,
        type: localFilters.type || null,
        status: localFilters.status || null,
      },
      currentPage: 1,
    }));
    setIsModalOpen(false);
  };

  const handleReset = () => {
    setLocalFilters({ name: "", type: null, status: null });
    setFilters((prev) => ({
      ...prev,
      advance: null,
      currentPage: 1,
    }));
    setIsModalOpen(false);
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      footer={null}
      centered
      width={440}
      title={
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
            <FaFilter size={16} />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 block">Category Filters</span>
            <span className="text-xs text-slate-500 font-normal">Refine the categories listing</span>
          </div>
        </div>
      }
      className="modern-modal"
    >
      <div className="flex flex-col gap-6 p-2 pt-6">
        {/* Name Search */}
        <div className="flex flex-col gap-2">
          <label className="text-slate-700 font-semibold text-sm">Category Name</label>
          <Input
            placeholder="Search by name (English or Urdu)..."
            value={localFilters.name}
            onChange={(e) => setLocalFilters((prev) => ({ ...prev, name: e.target.value }))}
            prefix={<FaSearch className="text-slate-400 mr-2" />}
            allowClear
            className="!h-[44px] !rounded-xl !border-2 !border-slate-100 focus:!border-teal-500"
          />
        </div>

        {/* Type Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-slate-700 font-semibold text-sm">Classification Type</label>
          <SelectBox
            placeholder="All Types"
            allowClear
            value={localFilters.type}
            handleChange={(value) => setLocalFilters((prev) => ({ ...prev, type: value }))}
            options={[
              { value: "PLACES", label: "Places / Locations" },
              { value: "SERVICES", label: "Utility Services" },
            ]}
            height="44px"
          />
        </div>

        {/* Status Selection */}
        <div className="flex flex-col gap-2">
          <label className="text-slate-700 font-semibold text-sm">Status</label>
          <SelectBox
            placeholder="Any Status"
            allowClear
            value={localFilters.status}
            handleChange={(value) => setLocalFilters((prev) => ({ ...prev, status: value }))}
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive / Disabled" },
            ]}
            height="44px"
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
