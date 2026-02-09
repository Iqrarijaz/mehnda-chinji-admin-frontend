"use client";
import React from "react";
import { Modal, Tag } from "antd";
import { timestampToDate } from "@/utils/date";
import { getTagColor } from "@/utils/tagColor";

function ViewModal({ viewModal, setViewModal }) {
    const { open, data } = viewModal;

    const handleClose = () => {
        setViewModal({ open: false, data: null });
    };

    const renderMetadata = () => {
        if (!data?.metadata || Object.keys(data.metadata).length === 0) {
            return <p className="text-gray-500">No additional metadata</p>;
        }

        const { type, metadata } = data;

        if (type === "DEATH") {
            return (
                <div className="space-y-2">
                    {metadata.deceasedName && (
                        <div>
                            <span className="font-semibold">Deceased Name: </span>
                            {metadata.deceasedName}
                        </div>
                    )}
                    {metadata.dateOfDeath && (
                        <div>
                            <span className="font-semibold">Date of Death: </span>
                            {new Date(metadata.dateOfDeath).toLocaleDateString()}
                        </div>
                    )}
                    {metadata.relationship && (
                        <div>
                            <span className="font-semibold">Relationship: </span>
                            {metadata.relationship}
                        </div>
                    )}
                </div>
            );
        }

        if (type === "EVENT") {
            return (
                <div className="space-y-2">
                    {metadata.eventName && (
                        <div>
                            <span className="font-semibold">Event Name: </span>
                            {metadata.eventName}
                        </div>
                    )}
                    {metadata.eventDate && (
                        <div>
                            <span className="font-semibold">Event Date: </span>
                            {new Date(metadata.eventDate).toLocaleString()}
                        </div>
                    )}
                    {metadata.location && (
                        <div>
                            <span className="font-semibold">Location: </span>
                            {metadata.location}
                        </div>
                    )}
                </div>
            );
        }

        if (type === "ANNOUNCEMENT") {
            return (
                <div className="space-y-2">
                    {metadata.priority && (
                        <div>
                            <span className="font-semibold">Priority: </span>
                            <Tag color={metadata.priority === "HIGH" ? "red" : metadata.priority === "MEDIUM" ? "orange" : "green"}>
                                {metadata.priority}
                            </Tag>
                        </div>
                    )}
                    {metadata.expiryDate && (
                        <div>
                            <span className="font-semibold">Expiry Date: </span>
                            {new Date(metadata.expiryDate).toLocaleDateString()}
                        </div>
                    )}
                </div>
            );
        }

        return null;
    };

    return (
        <Modal
            title="Post Details"
            open={open}
            onCancel={handleClose}
            footer={null}
            width={700}
            className="!rounded"
        >
            {data && (
                <div className="flex flex-col gap-4">
                    {/* Title */}
                    <div>
                        <h3 className="text-lg font-semibold mb-1">{data.title}</h3>
                        <div className="flex items-center gap-2">
                            <Tag
                                color={getTagColor(data.type)}
                                className="!text-xs !font-semibold"
                            >
                                {data.type}
                            </Tag>
                            <Tag color={data.status === "ACTIVE" ? "green" : "red"}>
                                {data.status}
                            </Tag>
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="font-semibold text-sm">Content:</label>
                        <p className="mt-1 text-gray-700 whitespace-pre-wrap">{data.content}</p>
                    </div>

                    {/* Images */}
                    {data.images && data.images.length > 0 && (
                        <div>
                            <label className="font-semibold text-sm">Images:</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {data.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Post image ${index + 1}`}
                                        className="w-24 h-24 object-cover rounded border"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/100?text=No+Image";
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Metadata Section */}
                    <div>
                        <label className="font-semibold text-sm">Additional Information:</label>
                        <div className="mt-2 p-3 bg-gray-50 rounded">
                            {renderMetadata()}
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-blue-50 rounded">
                            <div className="text-sm text-gray-600">Likes</div>
                            <div className="text-2xl font-bold text-blue-600">
                                {data.likesCount || 0}
                            </div>
                        </div>
                        <div className="p-3 bg-green-50 rounded">
                            <div className="text-sm text-gray-600">Comments</div>
                            <div className="text-2xl font-bold text-green-600">
                                {data.commentsCount || 0}
                            </div>
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span className="font-semibold">Created By:</span>
                            <p>{data.createdBy?.name || "N/A"}</p>
                        </div>
                        <div>
                            <span className="font-semibold">Created At:</span>
                            <p>{timestampToDate(data.createdAt)}</p>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
}

export default ViewModal;
