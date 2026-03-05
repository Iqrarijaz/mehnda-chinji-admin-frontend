"use client";
import React from "react";
import { Modal, Tag, Button, Divider } from "antd";
import { FaCogs, FaCode, FaCalendarAlt, FaShieldAlt, FaInfoCircle, FaFileCode } from "react-icons/fa";

function ViewConfigurationModal({ modal, setModal }) {
    const data = modal.data || {};

    const handleClose = () => {
        setModal({ name: null, state: false, data: null });
    };

    const isOpen = modal.name === "View" && modal.state;

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 px-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <FaFileCode size={18} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 block">Configuration Detail</span>
                        <span className="text-xs text-slate-500 font-normal">Technical specification and state</span>
                    </div>
                </div>
            }
            open={isOpen}
            onCancel={handleClose}
            footer={null}
            centered
            width={720}
            className="modern-modal"
        >
            <div className="p-2 pt-4">
                <div className="space-y-6">
                    {/* Status & Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FaShieldAlt className="text-slate-400" size={16} />
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">System Status</span>
                            </div>
                            <Tag
                                color={data.isActive ? "green" : "red"}
                                className="rounded-full px-4 py-0.5 border-none font-black text-[10px] uppercase tracking-widest m-0 shadow-sm"
                            >
                                {data.isActive ? "ACTIVE" : "INACTIVE"}
                            </Tag>
                        </div>

                        <div className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FaCogs className="text-slate-400" size={16} />
                                <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Config Type</span>
                            </div>
                            <Tag color="blue" className="rounded font-bold border-none m-0 shadow-sm">
                                {data.type || "GENERIC"}
                            </Tag>
                        </div>
                    </div>

                    {/* Timeline Data */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none text-center">Creation Date</p>
                            <div className="flex items-center justify-center gap-2 text-slate-600 font-medium text-xs">
                                <FaCalendarAlt size={10} />
                                {data.createdAt ? new Date(data.createdAt).toLocaleString() : "N/A"}
                            </div>
                        </div>
                        <div className="border-l border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none text-center">Last Modified</p>
                            <div className="flex items-center justify-center gap-2 text-slate-600 font-medium text-xs">
                                <FaCalendarAlt size={10} />
                                {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "N/A"}
                            </div>
                        </div>
                    </div>

                    {/* JSON Payload Display */}
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl overflow-hidden">
                        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
                            <FaCode className="text-teal-400" size={14} />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active JSON Payload</span>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            <pre className="text-teal-50 font-mono text-xs leading-relaxed">
                                {JSON.stringify(data.data, null, 2)}
                            </pre>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-2">
                        <FaInfoCircle size={10} />
                        Object Hash: {data._id}
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleClose}
                            className="modal-footer-btn-secondary !px-12"
                        >
                            Close Details
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ViewConfigurationModal;
