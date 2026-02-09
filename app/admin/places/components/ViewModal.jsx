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
                            <h4 className="font-bold text-gray-700">Name (English)</h4>
                            <p className="text-gray-600">{viewModal.data.name?.en}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-700">Name (Urdu)</h4>
                            <p className="font-notoUrdu text-right text-gray-600">{viewModal.data.name?.ur}</p>
                        </div>
                    </div>

                    <div className="grid gap-4 mt-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                        <div>
                            <h4 className="font-bold text-gray-700 mb-1">Category</h4>
                            <span
                                className="mr-0 text-[10px] px-2 py-1 rounded capitalize font-semibold text-white inline-block"
                                style={{ backgroundColor: getTagColor(viewModal.data.categoryName?.en) }}
                            >
                                {viewModal.data.categoryName?.en || "N/A"}
                            </span>
                        </div>
                    </div>

                    {(viewModal.data.description?.en || viewModal.data.description?.ur) && (
                        <div className="grid gap-4 mt-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                            {viewModal.data.description?.en && (
                                <div>
                                    <h4 className="font-bold text-gray-700">Description (English)</h4>
                                    <p className="text-gray-600 whitespace-pre-wrap">{viewModal.data.description?.en}</p>
                                </div>
                            )}
                            {viewModal.data.description?.ur && (
                                <div>
                                    <h4 className="font-bold text-gray-700">Description (Urdu)</h4>
                                    <p className="font-notoUrdu text-right text-gray-600 whitespace-pre-wrap">{viewModal.data.description?.ur}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid gap-4 mt-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                        <div>
                            <h4 className="font-bold text-gray-700">Address (English)</h4>
                            <p className="text-gray-600">{viewModal.data.address?.en}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-700">Address (Urdu)</h4>
                            <p className="font-notoUrdu text-right text-gray-600">{viewModal.data.address?.ur}</p>
                        </div>
                    </div>

                    {(viewModal.data.mohala?.en || viewModal.data.mohala?.ur) && (
                        <div className="grid gap-4 mt-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                            {viewModal.data.mohala?.en && (
                                <div>
                                    <h4 className="font-bold text-gray-700">Mohala (English)</h4>
                                    <p className="text-gray-600">{viewModal.data.mohala?.en}</p>
                                </div>
                            )}
                            {viewModal.data.mohala?.ur && (
                                <div>
                                    <h4 className="font-bold text-gray-700">Mohala (Urdu)</h4>
                                    <p className="font-notoUrdu text-right text-gray-600">{viewModal.data.mohala?.ur}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {viewModal.data.googleAddress && (
                        <div className="grid gap-4 mt-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                            <div>
                                <h4 className="font-bold text-gray-700">Google Address</h4>
                                <p className="text-gray-600">{viewModal.data.googleAddress}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 mt-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                        <div>
                            <h4 className="font-bold text-gray-700">Latitude</h4>
                            <p className="text-gray-600">{viewModal.data.location?.lat}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-700">Longitude</h4>
                            <p className="text-gray-600">{viewModal.data.location?.lng}</p>
                        </div>
                    </div>

                    {viewModal.data.phone?.length > 0 && (
                        <div className="mt-4">
                            <h4 className="font-bold text-gray-700 mb-2">Phone Numbers</h4>
                            <div className="flex flex-wrap gap-2">
                                {viewModal.data.phone.map((p, i) => (
                                    <span key={i} className="text-[12px] px-2 py-1 rounded bg-gray-200 text-gray-700 font-medium">
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {(viewModal.data.timing?.en || viewModal.data.timing?.ur || viewModal.data.services?.en || viewModal.data.services?.ur) && (
                        <>
                            <h3 className="font-bold text-gray-800 mt-6 mb-2 text-lg">Additional Info</h3>
                            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                                {viewModal.data.timing?.en && (
                                    <div>
                                        <h4 className="font-bold text-gray-700">Timing (English)</h4>
                                        <p className="text-gray-600">{viewModal.data.timing?.en}</p>
                                    </div>
                                )}
                                {viewModal.data.timing?.ur && (
                                    <div>
                                        <h4 className="font-bold text-gray-700">Timing (Urdu)</h4>
                                        <p className="font-notoUrdu text-right text-gray-600">{viewModal.data.timing?.ur}</p>
                                    </div>
                                )}
                                {viewModal.data.services?.en && (
                                    <div>
                                        <h4 className="font-bold text-gray-700">Services (English)</h4>
                                        <p className="text-gray-600">{viewModal.data.services?.en}</p>
                                    </div>
                                )}
                                {viewModal.data.services?.ur && (
                                    <div>
                                        <h4 className="font-bold text-gray-700">Services (Urdu)</h4>
                                        <p className="font-notoUrdu text-right text-gray-600">{viewModal.data.services?.ur}</p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    <div className="mt-6">
                        <h4 className="font-bold text-gray-700 mb-1">Status</h4>
                        <span
                            className={`mr-0 text-[10px] px-2 py-1 rounded capitalize font-semibold text-white inline-block ${viewModal.data.isActive ? "bg-green-500" : "bg-red-500"}`}
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
