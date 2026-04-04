"use client";
import React from "react";
import { Modal, Button, Tag, Divider } from "antd";
import { timestampToDate } from "@/utils/date";

export default function ViewDetailsModal({ open, onClose, data }) {
    if (!data) return null;

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 transition-colors duration-300">
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-100">Log Details</span>
                    <Tag color={data.type === 'ERROR' ? 'red' : 'green'} className="!rounded-full font-bold !border-0 text-[10px] dark:opacity-80">
                        {data.type}
                    </Tag>
                </div>
            }
            open={open}
            onCancel={onClose}
            width={800}
            footer={[
                <CustomButton key="close" label="Close" type="secondary" onClick={onClose} className="!h-[32px]" />,
            ]}
            className="modern-modal"
        >
            <div className="space-y-4 py-2 transition-colors duration-300">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                    <div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1 transition-colors duration-300">Function Name</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors duration-300">{data.functionName}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1 transition-colors duration-300">Timestamp</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors duration-300">{timestampToDate(data.createdAt)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-1 transition-colors duration-300">User ID</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors duration-300">{data.userId || "System Action"}</p>
                    </div>
                </div>

                <Divider className="!my-2 dark:border-slate-800" />
                
                <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mb-3 transition-colors duration-300">Diagnostic Data (JSON)</p>
                    <div className="bg-[#1e1e1e] p-4 rounded-lg overflow-x-auto shadow-inner max-h-[400px] border border-slate-800">
                        <pre className="text-emerald-400 dark:text-emerald-500 text-xs font-mono leading-relaxed transition-colors duration-300">
                            {JSON.stringify(data.data, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
