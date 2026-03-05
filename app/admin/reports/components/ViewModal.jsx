import React from "react";
import { Modal, Tag } from "antd";

function ViewModal({ viewModal, setViewModal }) {
    const data = viewModal.data;

    return (
        <Modal
            title="Report Details"
            open={viewModal.open}
            onCancel={() => setViewModal({ open: false, data: null })}
            footer={null}
            width={700}
            centered
        >
            {data && (
                <div className="bg-gray-100 p-4 rounded max-h-[70vh] overflow-y-auto">
                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                        <div className="bg-white p-3 rounded shadow-sm">
                            <h4 className="font-bold text-gray-700 text-sm mb-1">Reporter</h4>
                            <p className="text-gray-600">
                                {data.reporter ? `${data.reporter.firstName} ${data.reporter.lastName}` : "Anonymous"}
                            </p>
                            <p className="text-xs text-gray-400">{data.reporter?.phone || "No phone"}</p>
                            <p className="text-xs text-gray-400">{data.reporter?.email || "No email"}</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm text-center flex flex-col justify-center">
                            <h4 className="font-bold text-gray-700 text-sm mb-1">Target Type</h4>
                            <Tag color={data.targetType === 'BUSINESS' ? 'blue' : data.targetType === 'PLACE' ? 'green' : 'orange'} className="mx-auto block w-fit">
                                {data.targetType}
                            </Tag>
                        </div>
                    </div>

                    <div className="mt-4 bg-white p-3 rounded shadow-sm">
                        <h4 className="font-bold text-gray-700 text-sm mb-1">Reason</h4>
                        <p className="text-gray-600 font-medium">{data.reason}</p>
                    </div>

                    {data.description && (
                        <div className="mt-4 bg-white p-3 rounded shadow-sm">
                            <h4 className="font-bold text-gray-700 text-sm mb-1">Description</h4>
                            <p className="text-gray-600 whitespace-pre-wrap text-sm">{data.description}</p>
                        </div>
                    )}

                    <div className="mt-4 grid gap-4 grid-cols-1 md:grid-cols-2">
                        <div className="bg-white p-3 rounded shadow-sm">
                            <h4 className="font-bold text-gray-700 text-sm mb-1">Target ID</h4>
                            <p className="text-gray-500 font-mono text-xs break-all">{data.targetId}</p>
                        </div>
                        <div className="bg-white p-3 rounded shadow-sm text-center flex flex-col justify-center">
                            <h4 className="font-bold text-gray-700 text-sm mb-1">Current Status</h4>
                            <Tag color={data.status === 'RESOLVED' ? 'success' : data.status === 'REVIEWED' ? 'processing' : 'warning'} className="mx-auto block w-fit capitalize">
                                {data.status || "PENDING"}
                            </Tag>
                        </div>
                    </div>

                    <div className="mt-4 bg-gray-200 p-2 rounded text-center text-[10px] text-gray-500 italic">
                        Reported on: {new Date(data.createdAt).toLocaleString()}
                    </div>
                </div>
            )}
        </Modal>
    );
}

export default ViewModal;
