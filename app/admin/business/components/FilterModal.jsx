"use client";
import React from "react";
import { Button, Modal, Select } from "antd";

const { Option } = Select;

function FilterModal({ modal, setModal, setFilters }) {

    const handleApply = (status) => {
        setFilters((prev) => ({ ...prev, status, currentPage: 1 }));
        setModal({ name: null, state: false, data: null });
    };

    const handleReset = () => {
        setFilters((prev) => ({ ...prev, status: null, currentPage: 1 }));
        setModal({ name: null, state: false, data: null });
    };

    return (
        <Modal
            title="Filter Businesses"
            className="!rounded"
            centered
            width={400}
            open={modal?.name === "Filter" && modal?.state}
            onCancel={() => setModal({ name: null, state: false, data: null })}
            footer={null}
        >
            <div className="p-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                </label>
                <Select
                    className="w-full mb-6"
                    size="large"
                    placeholder="Select status"
                    onChange={handleApply}
                    allowClear
                    onClear={handleReset}
                >
                    <Option value="PENDING">Pending</Option>
                    <Option value="APPROVED">Approved</Option>
                    <Option value="REJECTED">Rejected</Option>
                </Select>

                <div className="flex justify-end gap-3">
                    <Button onClick={handleReset} className="modal-cancel-button">
                        Reset
                    </Button>
                </div>
            </div>
        </Modal>
    );
}

export default FilterModal;
