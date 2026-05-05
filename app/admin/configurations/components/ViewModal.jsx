import React, { useState } from "react";
import { Modal, Tag, Divider } from "antd";
import { toast } from "react-toastify";
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
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-400 block mt-1 transition-colors duration-300">Configuration Detail ({data.type || "GENERIC"})</span>
                    </div>
                </div>
            }
            open={isOpen}
            onCancel={handleClose}
            footer={false}
            centered
            width={1200}
            // height={"650px"}
            style={{ top: 20 }}
            bodyStyle={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}
            className="modern-modal"
        >
            <div className="p-1">
                <div className="space-y-4">
                    {/* Status & Metadata Grid
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
                    </div> */}

                    {/* Visual Categories Display */}
                    {Array.isArray(data.data) && data.data[0]?.category && (
                        <div className="space-y-6">
                            {(filteredData || []).map((cat, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-all hover:shadow-md">
                                    <div className="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                                <FaInfoCircle size={20} />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider m-0">
                                                    {cat.category}
                                                </h3>
                                                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                                    {cat.types?.length || 0} Sub-types available
                                                </span>
                                            </div>
                                        </div>
                                        <Tag className="rounded-full px-3 border-none bg-teal-500/10 text-teal-600 dark:text-teal-400 font-bold text-[10px] uppercase tracking-widest">
                                            Category
                                        </Tag>
                                    </div>
                                    <div className="p-5">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                            {cat.types?.map((type, tIdx) => (
                                                <div 
                                                    key={tIdx} 
                                                    className="group flex flex-col items-center p-4 rounded-xl transition-all hover:bg-teal-50/30 dark:hover:bg-teal-900/10"
                                                >
                                                    <div 
                                                        className="w-[68px] h-[68px] flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300 cursor-pointer"
                                                        title="Click to copy image URL"
                                                        onClick={() => {
                                                            if (type.icon) {
                                                                navigator.clipboard.writeText(type.icon);
                                                                toast.success("Link copied to clipboard");
                                                            }
                                                        }}
                                                    >
                                                        {type.icon ? (
                                                            <img 
                                                                src={type.icon} 
                                                                alt={type.label} 
                                                                className="w-full h-full object-contain"
                                                                onError={(e) => {
                                                                    e.target.src = "https://via.placeholder.com/68?text=NA";
                                                                }}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                                                                <FaCode size={24} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 text-center line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400">
                                                        {type.label}
                                                    </span>
                                                    <code className="mt-1 text-[8px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-tighter">
                                                        {type.key}
                                                    </code>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* JSON Payload Display */}
                    <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 shadow-sm overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-800/50">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center">
                                    <FaCode className="text-teal-400" size={10} />
                                </div>
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Raw Data Source</span>
                            </div>
                            <div className="relative w-full sm:w-auto">
                                <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                                    <FaSearch className="text-slate-500" size={10} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Filter configuration..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-48 bg-slate-800 border border-slate-700 rounded pl-7 pr-2 py-1 text-teal-50 text-[10px] placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
                                />
                            </div>
                        </div>
                        <div className="max-h-[250px] overflow-y-auto custom-scrollbar">
                            <pre className="text-teal-400/80 font-mono text-[10px] leading-relaxed">
                                {filteredText || (searchQuery ? "No matching data segments found." : "{}")}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default ViewConfigurationModal;
