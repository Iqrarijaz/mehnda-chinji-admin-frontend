import React from "react";
import { Modal, Tag } from "antd";
import { getTagColor } from "@/utils/tagColor";

function ViewModal({ viewModal, setViewModal }) {
    return (
        <Modal
            title="Place Details"
            open={viewModal.open}
            onCancel={() => setViewModal({ open: false, data: null })}
            footer={null}
            width={800}
            centered
        >
            {viewModal.data && (
                <div className="bg-gray-100 p-2 rounded max-h-[60vh] overflow-y-auto">
                    <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                        <div>
                            <h4 className="font-bold text-gray-700">Name</h4>
                            <p className="text-gray-600">{viewModal.data.name}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-700 mb-1">Category</h4>
                            <span
                                className="mr-0 text-[10px] px-2 py-1 rounded capitalize font-semibold text-white inline-block"
                                style={{ backgroundColor: getTagColor(viewModal.data.category) }}
                            >
                                {viewModal.data.category || "N/A"}
                            </span>
                        </div>
                    </div>

                    {viewModal.data.description && (
                        <div className="grid gap-4 mt-4 grid-cols-1">
                            <div>
                                <h4 className="font-bold text-gray-700">Description</h4>
                                <p className="text-gray-600 whitespace-pre-wrap">{viewModal.data.description}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 mt-4 grid-cols-1">
                        <div>
                            <h4 className="font-bold text-gray-700">Address</h4>
                            <p className="text-gray-600">{viewModal.data.address}</p>
                        </div>
                    </div>

                    {viewModal.data.googleAddress && (
                        <div className="grid gap-4 mt-4 grid-cols-1">
                            <div>
                                <h4 className="font-bold text-gray-700">Google Address</h4>
                                <p className="text-gray-600">{viewModal.data.googleAddress}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 mt-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                        <div>
                            <h4 className="font-bold text-gray-700">Latitude</h4>
                            <p className="text-gray-600">{viewModal.data.location?.lat || viewModal.data.location?.coordinates?.[1]}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-700">Longitude</h4>
                            <p className="text-gray-600">{viewModal.data.location?.lng || viewModal.data.location?.coordinates?.[0]}</p>
                        </div>
                    </div>

                    {viewModal.data.contact?.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-bold text-gray-700 mb-2">Contacts</h4>
                            <div className="grid gap-2">
                                {viewModal.data.contact.map((c, i) => (
                                    <div key={i} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                                        <span className="font-medium text-gray-800">{c.name}:</span>
                                        <span className="text-gray-600 font-mono">{c.number}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(viewModal.data.timing || viewModal.data.services) && (
                        <>
                            <h3 className="font-bold text-gray-800 mt-6 mb-2 text-lg">Additional Info</h3>
                            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                                {viewModal.data.timing && (
                                    <div>
                                        <h4 className="font-bold text-gray-700">Timing</h4>
                                        <p className="text-gray-600">{viewModal.data.timing}</p>
                                    </div>
                                )}
                                {viewModal.data.services && (
                                    <div>
                                        <h4 className="font-bold text-gray-700">Services</h4>
                                        <p className="text-gray-600">{viewModal.data.services}</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div className="mt-6 flex items-center justify-between bg-white p-3 rounded shadow-sm">
                        <h4 className="font-bold text-gray-700 mb-0">Status</h4>
                        <span
                            className={`mr-0 text-[10px] px-3 py-1 rounded capitalize font-semibold text-white inline-block ${viewModal.data.isActive ? "bg-green-500" : "bg-red-500"}`}
                        >
                            {viewModal.data.isActive ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
            )}
        </Modal>
    );
}

export default ViewModal;
