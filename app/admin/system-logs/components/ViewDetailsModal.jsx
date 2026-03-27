"use client";
import React from "react";
import { Modal, Button, Tag, Divider } from "antd";
import { timestampToDate } from "@/utils/date";

export default function ViewDetailsModal({ open, onClose, data }) {
    if (!data) return null;

    return (
        <Modal
            title={
                <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-slate-800">Log Details</span>
                    <Tag color={data.type === 'ERROR' ? 'red' : 'green'} className="!rounded-full font-bold !border-0 text-[10px]">
                        {data.type}
                    </Tag>
                </div>
            }
            open={open}
            onCancel={onClose}
            width={800}
            footer={[
                <Button key="close" onClick={onClose} className="rounded-md border-slate-200">
                    Close
                </Button>,
            ]}
            className="modern-modal"
        >
            <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Function Name</p>
                        <p className="text-sm font-semibold text-slate-700">{data.functionName}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Timestamp</p>
                        <p className="text-sm font-semibold text-slate-700">{timestampToDate(data.createdAt)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">User ID</p>
                        <p className="text-sm font-semibold text-slate-700">{data.userId || "System Action"}</p>
                    </div>
                </div>

                <Divider className="!my-2" />

                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">Diagnostic Data (JSON)</p>
                    <div className="bg-[#1e1e1e] p-4 rounded-lg overflow-x-auto shadow-inner max-h-[400px]">
                        <pre className="text-emerald-400 text-xs font-mono leading-relaxed">
                            {JSON.stringify(data.data, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
