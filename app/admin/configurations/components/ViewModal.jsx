"use client";

import React from "react";
import { Modal, Descriptions, Tag, Button } from "antd";

function ViewConfigurationModal({ modal, setModal }) {
    const data = modal.data || {};

    const handleClose = () => {
        setModal({ name: null, state: false, data: null });
    };

    return (
        <Modal
            title="Configuration Details"
            open={modal.name === "View" && modal.state}
            onCancel={handleClose}
            footer={null}
            centered
            width={900}
        >
            <div className="form-class bg-gray-100 p-6 rounded space-y-6 mt-4">
                <Descriptions bordered column={1} size="small" className="bg-white">
                    <Descriptions.Item label="Type" labelStyle={{ fontWeight: 'bold' }}>
                        <Tag color="blue" className="font-bold">
                            {data.type}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status" labelStyle={{ fontWeight: 'bold' }}>
                        <Tag color={data.isActive ? "green" : "red"}>
                            {data.isActive ? "Active" : "Inactive"}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At" labelStyle={{ fontWeight: 'bold' }}>
                        {data.createdAt ? new Date(data.createdAt).toLocaleString() : "-"}
                    </Descriptions.Item>
                    <Descriptions.Item label="Updated At" labelStyle={{ fontWeight: 'bold' }}>
                        {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "-"}
                    </Descriptions.Item>
                </Descriptions>

                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                        Configuration Data (JSON)
                    </h3>
                    <pre className="bg-gray-50 p-4 rounded border border-gray-100 text-xs font-mono overflow-auto max-h-[300px]">
                        {JSON.stringify(data.data, null, 2)}
                    </pre>
                </div>
            </div>

            <div className="flex justify-end mt-4">
                <Button onClick={handleClose} className="modal-cancel-button">
                    Close
                </Button>
            </div>
        </Modal>
    );
}

export default ViewConfigurationModal;
