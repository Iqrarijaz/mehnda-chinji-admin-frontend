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

    const getCategoryLabel = (id) => {
        // In a real app, this might come from a prop or context
        return data?.categoryId?.name || "Location";
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaInfoCircle size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-teal-700 block mt-1">Place Details</span>
                    </div>
                </div>
            }
            open={open}
            onCancel={handleClose}
            footer={
                <CustomButton
                    label="Close Details"
                    type="secondary"
                    onClick={handleClose}
                    className="w-full"
                />
            }
            width={620}
            className="modern-modal"
        >
            <div className="">
                {data && (
                    <div className="space-y-4 p-1">
                        {/* Header Section */}
                        {/* Header Box */}
                        <div className="bg-slate-50 p-3 rounded border border-slate-100 relative">
                            <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                                <Tag color="cyan" className="rounded px-1.5 py-0 border-none font-bold text-[8px] uppercase tracking-tighter m-0">
                                    {data.categoryId?.name || "General"}
                                </Tag>
                                <Tag color={data.status === "ACTIVE" ? "green" : "orange"} className="rounded px-1.5 py-0 border-none font-bold text-[8px] uppercase tracking-tighter m-0">
                                    {data.status || "PENDING"}
                                </Tag>
                            </div>
                            <h2 className="text-lg font-bold text-slate-800 leading-tight mb-1">{data.name}</h2>
                            <p className="text-slate-500 text-[11px] leading-tight flex items-center gap-1.5">
                                <FaMapMarkerAlt className="text-teal-500 opacity-60" size={10} />
                                {data.address}
                            </p>
                            {data.googleAddress && (
                                <a
                                    href={data.googleAddress}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-teal-600 font-bold text-[9px] uppercase hover:bg-teal-50 transition-colors shadow-sm"
                                >
                                    <FaExternalLinkAlt size={7} />
                                    Maps
                                </a>
                            )}
                        </div>

                        {/* Description */}
                        {data.description && (
                            <div className="px-1 border-l-2 border-teal-100 py-0.5 ml-1">
                                <p className="text-slate-600 text-[12px] leading-relaxed">
                                    {data.description}
                                </p>
                            </div>
                        )}

                        {/* Key Info Grid */}
                        {/* Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-white rounded border border-slate-100 flex items-center gap-2">
                                <FaClock className="text-teal-500 opacity-60" size={12} />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Timings</span>
                                    <span className="text-slate-700 font-bold text-[11px] leading-tight">{data.timing || "N/A"}</span>
                                </div>
                            </div>
                            <div className="p-2 bg-white rounded border border-slate-100 flex items-center gap-2">
                                <FaTools className="text-[#006666] opacity-60" size={12} />
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Services</span>
                                    <span className="text-slate-700 font-bold text-[11px] leading-tight truncate">{data.services || "General"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Contacts Section */}
                        {/* Contacts */}
                        <div className="modal-section space-y-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Contact Details</p>
                            <div className="grid grid-cols-2 gap-2">
                                {data.contact && data.contact.length > 0 ? data.contact.map((c, i) => (
                                    <div key={i} className="flex flex-col p-1.5 px-2 bg-slate-50/50 rounded border border-slate-100">
                                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">{c.name}</span>
                                        <div className="flex items-center gap-1.5">
                                            <FaPhoneAlt size={8} className="text-teal-600 opacity-60" />
                                            <span className="text-[12px] font-bold text-slate-700 tracking-tight">{c.number}</span>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 py-2 text-center text-slate-400 font-bold text-[10px] uppercase">No contacts</div>
                                )}
                            </div>
                        </div>

                        {/* Location Data Section */}
                        {/* Meta */}
                        <div className="modal-section !mb-0 border-t border-slate-100 pt-3">
                            <div className="flex gap-6 pl-1">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Latitude</span>
                                    <span className="text-slate-600 font-mono text-[11px]">{data.lat || (data.location?.coordinates?.[1]) || "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Longitude</span>
                                    <span className="text-slate-600 font-mono text-[11px]">{data.lng || (data.location?.coordinates?.[0]) || "N/A"}</span>
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
