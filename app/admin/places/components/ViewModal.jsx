"use client";
import React from "react";
import { Modal, Tag } from "antd";
import { FaMapMarkerAlt, FaAddressCard, FaPhoneAlt, FaClock, FaTools, FaChevronRight, FaEye, FaInfoCircle, FaExternalLinkAlt } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

function ViewModal({ viewModal, setViewModal }) {
    const { open, data } = viewModal;

    const handleClose = () => {
        setViewModal({ open: false, data: null });
    };


    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400 transition-colors duration-300">
                        <FaInfoCircle size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-900 dark:text-slate-100 block mt-1 transition-colors duration-300">Place Details</span>
                    </div>
                </div>
            }
            open={open}
            onCancel={handleClose}
            footer={null}
            width={620}
            className="modern-modal"
        >
            <div className="">
                {data && (
                    <div className="space-y-4 p-1">
                        {/* General Information Section */}
                        <div className="modal-section space-y-1.5 pt-1">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 mb-2">General Information</p>

                            <div className="space-y-1">
                                {/* Place Name Row */}
                                <div className="flex items-center p-2.5 px-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                    <div className="w-1/3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Place Name</div>
                                    <div className="w-2/3 text-[12px] font-bold text-slate-700 dark:text-slate-200 capitalize leading-tight">
                                        {data.name}
                                    </div>
                                </div>

                                {/* Category & Status Split Row */}
                                <div className="grid grid-cols-2 gap-1">
                                    <div className="flex items-center p-2.5 px-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                        <div className="w-1/2 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Category</div>
                                        <div className="w-1/2 flex justify-end">
                                            <Tag className="rounded-full px-2 py-0 border-none font-bold text-[8px] uppercase tracking-normal m-0 bg-cyan-100/50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400">
                                                {data.category || "N/A"}
                                            </Tag>
                                        </div>
                                    </div>
                                    <div className="flex items-center p-2.5 px-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                        <div className="w-1/2 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Status</div>
                                        <div className="w-1/2 flex justify-end">
                                            <Tag className={`rounded-full px-2 py-0 border-none font-bold text-[8px] uppercase tracking-normal m-0 ${data.status === "ACTIVE"
                                                ? "bg-green-100/50 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                                : "bg-orange-100/50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                                                }`}>
                                                {data.status || "PENDING"}
                                            </Tag>
                                        </div>
                                    </div>
                                </div>

                                {data.type && (
                                    <div className="flex items-center p-2.5 px-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                        <div className="w-1/3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Type</div>
                                        <div className="w-2/3 flex justify-end">
                                            <Tag className="rounded-full px-2 py-0 border-none font-bold text-[8px] uppercase tracking-normal m-0 bg-orange-100/50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                                                {data.type}
                                            </Tag>
                                        </div>
                                    </div>
                                )}

                                {/* Physical Address Row */}
                                <div className="flex items-start p-2.5 px-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                    <div className="w-1/3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Physical Address</div>
                                    <div className="w-2/3 text-[11px] font-medium text-slate-600 dark:text-slate-400 capitalize leading-relaxed relative pr-8">
                                        {data.address}
                                        {data.googleAddress && (
                                            <a
                                                href={data.googleAddress}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="absolute top-0 right-0 p-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-teal-600 dark:text-teal-400 shadow-sm hover:bg-teal-50 dark:hover:bg-teal-900/20 transition-all hover:scale-110"
                                                title="View on Maps"
                                            >
                                                <FaExternalLinkAlt size={8} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Description Row */}
                                <div className="flex items-start p-2.5 px-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                    <div className="w-1/3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">Description</div>
                                    <div className="w-2/3 text-[11px] text-slate-600 dark:text-slate-400 leading-normal line-clamp-3">
                                        {data.description || <span className="text-slate-300 dark:text-slate-600 italic">No description provided</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Operational Details Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 px-4 bg-white dark:bg-slate-900/40 rounded border border-slate-100 dark:border-slate-800 flex items-center gap-3 transition-colors duration-300">
                                <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400 flex-shrink-0">
                                    <FaClock size={12} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Operational Hours</span>
                                    <span className="text-slate-700 dark:text-slate-300 font-bold text-[11px] leading-tight truncate">{data.timing || "N/A"}</span>
                                </div>
                            </div>
                            <div className="p-2.5 px-4 bg-white dark:bg-slate-900/40 rounded border border-slate-100 dark:border-slate-800 flex items-center gap-3 transition-colors duration-300">
                                <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400 flex-shrink-0">
                                    <FaTools size={12} />
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">Available Services</span>
                                    <span className="text-slate-700 dark:text-slate-300 font-bold text-[11px] leading-tight truncate">{data.services || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Contacts Section */}
                        <div className="modal-section space-y-1.5">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 mb-2">Contact Information</p>
                            <div className="space-y-1">
                                {data.contact && data.contact.length > 0 ? data.contact.map((c, i) => (
                                    <div key={i} className="flex items-center p-2.5 px-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                        <div className="w-1/3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Contact Person</div>
                                        <div className="w-2/3 flex items-center justify-between">
                                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 capitalize">{c.name}</span>
                                            <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
                                                <FaPhoneAlt size={8} className="opacity-60" />
                                                <span className="text-[11px] font-bold font-mono tracking-tight">{c.number}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-4 text-center bg-slate-50/20 dark:bg-slate-900/10 rounded border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 font-bold text-[9px] uppercase tracking-wider">No contacts added</div>
                                )}
                            </div>
                        </div>

                        {/* Other Information Section */}
                        <div className="modal-section space-y-1.5">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 mb-2">Technical Details</p>
                            <div className="p-3 px-4 bg-slate-50/30 dark:bg-slate-900/20 rounded border border-slate-100 dark:border-slate-800 min-h-[50px] transition-colors duration-300">
                                <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed italic">
                                    {data.otherInfo || "No additional technical information provided."}
                                </p>
                            </div>
                        </div>

                        {/* Location Metadata Section */}
                        <div className="modal-section !mb-0">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 mb-2">Geographic Coordinates</p>
                            <div className="grid grid-cols-2 gap-1">
                                <div className="flex items-center p-2.5 px-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                    <div className="w-1/2 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Latitude</div>
                                    <div className="w-1/2 text-right text-slate-600 dark:text-slate-400 font-mono text-[10px]">{data.lat || (data.location?.coordinates?.[1]) || "N/A"}</div>
                                </div>
                                <div className="flex items-center p-2.5 px-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                    <div className="w-1/2 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Longitude</div>
                                    <div className="w-1/2 text-right text-slate-600 dark:text-slate-400 font-mono text-[10px]">{data.lng || (data.location?.coordinates?.[0]) || "N/A"}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

export default ViewModal;
