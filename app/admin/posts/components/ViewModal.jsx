"use client";
import React from "react";
import { Modal, Tag, Divider } from "antd";
import { FaUser, FaCalendarAlt, FaInfoCircle, FaHeart, FaCommentAlt } from "react-icons/fa";
import { timestampToDate } from "@/utils/date";
import { getTagColor } from "@/utils/tagColor";
import CustomButton from "@/components/shared/CustomButton";

function ViewModal({ viewModal, setViewModal }) {
    const { open, data } = viewModal;

    const handleClose = () => {
        setViewModal({ open: false, data: null });
    };

    const renderMetadata = () => {
        if (!data?.metadata || Object.keys(data.metadata).length === 0) {
            return <p className="text-slate-400 italic text-sm">No additional metadata provided.</p>;
        }

        const { type, metadata } = data;

        if (type === "DEATH") {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Deceased Name</span>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 transition-colors uppercase">{metadata.deceasedName}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Relationship</span>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 transition-colors">{metadata.relationship}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Date of Death</span>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 transition-colors">{new Date(metadata.dateOfDeath).toLocaleDateString()}</p>
                    </div>
                </div>
            );
        }

        if (type === "ACCIDENT") {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Location</span>
                        <p className="font-semibold text-slate-900 dark:text-slate-100 transition-colors">{metadata.location}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Severity</span>
                        <div>
                            <Tag color={metadata.severity === "HIGH" ? "red" : metadata.severity === "MEDIUM" ? "orange" : "green"} className="rounded px-3">
                                {metadata.severity}
                            </Tag>
                        </div>
                    </div>
                </div>
            );
        }

        return <pre className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded border border-slate-100 dark:border-slate-800 transition-colors">{JSON.stringify(metadata, null, 2)}</pre>;
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400 transition-colors duration-300">
                        <FaInfoCircle size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-900 dark:text-slate-100 block mt-1 transition-colors duration-300">Post Details</span>
                    </div>
                </div>
            }
            open={open}
            onCancel={handleClose}
            footer={
                <CustomButton
                    label="Back to Feed"
                    type="secondary"
                    onClick={handleClose}
                    className="w-full"
                />
            }
            width={600}
            className="modern-modal"
        >
            <div className="p-1">
                {data && (
                    <div className="space-y-4">
                        {/* Header Info */}
                        <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40 p-2.5 rounded border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
                                    {data.createdBy?.profileImage ? (
                                        <img src={data.createdBy.profileImage} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUser size={12} className="text-slate-300 dark:text-slate-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-slate-100 text-[11px] leading-none mb-1 transition-colors duration-300">{data.createdBy?.name || "Unknown User"}</p>
                                    <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-[9px]">
                                        <FaCalendarAlt size={8} />
                                        {timestampToDate(data.createdAt)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1.5">
                                <Tag color={getTagColor(data.type)} className="rounded px-2 border-none font-bold text-[8px] uppercase tracking-wider !mr-0">
                                    {data.type}
                                </Tag>
                                <Tag color={data.status === "ACTIVE" ? "success" : "error"} className="rounded px-2 border-none font-bold text-[8px] uppercase tracking-wider !mr-0">
                                    {data.status}
                                </Tag>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="px-1">
                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap transition-colors duration-300">
                                {data.content}
                            </p>
                        </div>

                        {/* Images */}
                        {data.images && data.images.length > 0 && (
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Attached Media</span>
                                <div className="grid grid-cols-4 gap-2">
                                    {data.images.map((img, index) => (
                                        <div key={index} className="aspect-square rounded overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm group relative transition-colors duration-300">
                                            <img
                                                src={img}
                                                alt={`Post image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metadata Section */}
                        <div className="modal-section !mb-0 border-t border-slate-100 dark:border-slate-800 pt-3">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">Technical Details</p>
                            {renderMetadata()}
                        </div>

                        {/* Statistics Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 bg-teal-50/50 dark:bg-teal-900/20 rounded border border-teal-100/30 dark:border-teal-900/30 flex items-center justify-between transition-colors duration-300">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded bg-white dark:bg-slate-800 flex items-center justify-center text-teal-600 dark:text-teal-400 shadow-sm transition-colors duration-300">
                                        <FaHeart size={12} />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Likes</span>
                                </div>
                                <span className="text-lg font-black text-teal-700 dark:text-teal-400 tracking-tight transition-colors duration-300">{data.likesCount || 0}</span>
                            </div>
                            <div className="p-2.5 bg-blue-50/50 dark:bg-blue-900/20 rounded border border-blue-100/30 dark:border-blue-900/30 flex items-center justify-between transition-colors duration-300">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded bg-white dark:bg-slate-800 flex items-center justify-center text-[#006666] dark:text-teal-400 shadow-sm transition-colors duration-300">
                                        <FaCommentAlt size={12} />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Comments</span>
                                </div>
                                <span className="text-lg font-black text-[#006666] dark:text-teal-400 tracking-tight transition-colors duration-300">{data.commentsCount || 0}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

export default ViewModal;
