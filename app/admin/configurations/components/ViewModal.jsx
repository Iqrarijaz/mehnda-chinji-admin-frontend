import React, { useState } from "react";
import { Modal, Tag, Divider } from "antd";
import { FaCogs, FaCode, FaCalendarAlt, FaShieldAlt, FaInfoCircle, FaFileCode, FaSearch } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

function ViewConfigurationModal({ modal, setModal }) {
    const data = modal.data || {};
    const [searchQuery, setSearchQuery] = useState("");

    const handleClose = () => {
        setModal({ name: null, state: false, data: null });
        setSearchQuery("");
    };

    const isOpen = modal.name === "View" && modal.state;

    const filterJSON = (obj, query) => {
        if (!query) return obj;
        const lowerQuery = query.toLowerCase();

        const deepFilter = (item) => {
            if (item === null || item === undefined) return undefined;

            if (Array.isArray(item)) {
                const filteredArray = item.map(deepFilter).filter(val => val !== undefined);
                return filteredArray.length > 0 ? filteredArray : undefined;
            }

            if (typeof item === 'object') {
                // If the object has a name, category, or type field that matches, return the complete object
                const hasMatchingCategoryName = Object.entries(item).some(([k, v]) => {
                    const isTargetKey = k.toLowerCase().includes('category') || k.toLowerCase().includes('name') || k.toLowerCase().includes('type');
                    return isTargetKey && typeof v === 'string' && v.toLowerCase().includes(lowerQuery);
                });

                if (hasMatchingCategoryName) {
                    return item;
                }

                const filteredObj = {};
                let hasMatch = false;

                for (const [key, value] of Object.entries(item)) {
                    if (key.toLowerCase().includes(lowerQuery)) {
                        filteredObj[key] = value;
                        hasMatch = true;
                    } else {
                        const filteredValue = deepFilter(value);
                        if (filteredValue !== undefined) {
                            filteredObj[key] = filteredValue;
                            hasMatch = true;
                        }
                    }
                }

                return hasMatch ? filteredObj : undefined;
            }

            return String(item).toLowerCase().includes(lowerQuery) ? item : undefined;
        };

        const result = deepFilter(obj);
        return result === undefined ? null : result;
    };

    const filteredData = data.data ? filterJSON(data.data, searchQuery) : null;
    const filteredText = filteredData ? JSON.stringify(filteredData, null, 2) : "";

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-[#006666] dark:text-teal-400 transition-colors duration-300">
                        <FaFileCode size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-400 block mt-1 transition-colors duration-300">Configuration Detail</span>
                    </div>
                </div>
            }
            open={isOpen}
            onCancel={handleClose}
            footer={
                <CustomButton label="Close Details" type="secondary" onClick={handleClose} className="w-full" />
            }
            centered
            width={1200}
            className="modern-modal"
        >
            <div className="p-1">
                <div className="space-y-4">
                    {/* Status & Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
                            <div className="flex items-center gap-2">
                                <FaShieldAlt className="text-slate-400 dark:text-slate-500" size={14} />
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">System Status</span>
                            </div>
                            <Tag
                                color={data.isActive ? "success" : "error"}
                                className="rounded px-2 py-0 border-none font-black text-[8px] uppercase tracking-widest m-0 shadow-sm"
                            >
                                {data.isActive ? "ACTIVE" : "INACTIVE"}
                            </Tag>
                        </div>

                        <div className="p-3 bg-white dark:bg-slate-900/40 rounded border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
                            <div className="flex items-center gap-2">
                                <FaCogs className="text-slate-400 dark:text-slate-500" size={14} />
                                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Config Type</span>
                            </div>
                            <Tag className="rounded border-none m-0 text-[8px] bg-teal-50 dark:bg-teal-900/30 text-[#006666] dark:text-teal-400 font-bold transition-colors duration-300">
                                {data.type || "GENERIC"}
                            </Tag>
                        </div>
                    </div>

                    {/* JSON Payload Display */}
                    <div className="bg-slate-900 rounded p-4 border border-slate-800 shadow-sm overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-800/50">
                            <div className="flex items-center gap-2">
                                <FaCode className="text-teal-400" size={12} />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active JSON Payload</span>
                            </div>
                            <div className="relative w-full sm:w-auto">
                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                    <FaSearch className="text-slate-500" size={10} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search text..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-48 bg-slate-800 border border-slate-700 rounded pl-7 pr-2 py-1 text-teal-50 text-[10px] placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                                />
                            </div>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            <pre className="text-teal-50 font-mono text-[11px] leading-relaxed">
                                {filteredText || (searchQuery ? "No matching text found." : "")}
                            </pre>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="flex items-center justify-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        <FaInfoCircle size={9} />
                        Object Hash: {data._id}
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ViewConfigurationModal;
