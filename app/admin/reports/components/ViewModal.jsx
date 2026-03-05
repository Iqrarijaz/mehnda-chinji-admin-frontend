"use client";
import React from "react";
import { Modal, Tag, Divider } from "antd";
import { FaFlag, FaUser, FaBullseye, FaInfoCircle, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";

function ViewModal({ viewModal, setViewModal }) {
    const { open, data } = viewModal;

    const handleClose = () => {
        setViewModal({ open: false, data: null });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 px-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                        <FaFlag size={18} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 block">Report Investigation</span>
                        <span className="text-xs text-slate-500 font-normal">Review user-submitted report details</span>
                    </div>
                </div>
            }
            open={open}
            onCancel={handleClose}
            footer={null}
            width={720}
            centered
            className="modern-modal"
        >
            <div className="p-2 pt-4">
                {data && (
                    <div className="space-y-6">
                        {/* Status Card */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3">
                                <FaShieldAlt className="text-slate-400" size={16} />
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Resolution Status</span>
                            </div>
                            <Tag
                                color={data.status === 'RESOLVED' ? 'green' : data.status === 'REVIEWED' ? 'blue' : 'orange'}
                                className="rounded-full px-6 py-0.5 border-none font-black text-[11px] uppercase tracking-widest m-0 shadow-sm"
                            >
                                {data.status || "PENDING"}
                            </Tag>
                        </div>

                        {/* Reason & Content Section */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Violation</p>
                                <h3 className="text-xl font-black text-slate-900">{data.reason}</h3>
                            </div>

                            {data.description && (
                                <>
                                    <Divider className="my-4" />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Detailed Description</p>
                                        <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                                            "{data.description}"
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Entities Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Reporter Card */}
                            <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4 text-teal-600">
                                    <FaUser size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Reporter Info</span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-lg font-black text-slate-900 leading-none">
                                        {data.reporter ? `${data.reporter.firstName} ${data.reporter.lastName}` : "Anonymous User"}
                                    </p>
                                    <p className="text-xs text-slate-500 font-medium">{data.reporter?.phone || "Phone unavailable"}</p>
                                    <p className="text-xs text-slate-500 truncate">{data.reporter?.email || "Email unavailable"}</p>
                                </div>
                            </div>

                            {/* Target Card */}
                            <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-2 mb-4 text-blue-600">
                                    <FaBullseye size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Target Content</span>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 leading-none uppercase mb-1">Type</p>
                                        <Tag color={data.targetType === 'BUSINESS' ? 'blue' : 'green'} className="rounded font-bold border-none m-0 shadow-sm">
                                            {data.targetType}
                                        </Tag>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 leading-none uppercase mb-1">Target Identifier</p>
                                        <p className="text-[11px] font-mono text-slate-500 break-all bg-slate-50 p-1.5 rounded border border-slate-100">
                                            {data.targetId}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metadata Footer */}
                        <div className="flex items-center justify-between px-2 pt-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt size={10} />
                                Filed on: {new Date(data.createdAt).toLocaleString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <FaInfoCircle size={10} />
                                ID: {data._id}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

export default ViewModal;
