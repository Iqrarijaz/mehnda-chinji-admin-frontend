"use client";
import React from "react";
import { Modal, Tag, Divider, Row, Col } from "antd";
import { FaMapMarkerAlt, FaPhoneAlt, FaClock, FaTools, FaInfoCircle, FaExternalLinkAlt, FaTag } from "react-icons/fa";

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
                <div className="flex items-center gap-3 px-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaInfoCircle size={18} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 block">Place Information</span>
                        <span className="text-xs text-slate-500 font-normal">Detailed overview of this location</span>
                    </div>
                </div>
            }
            open={open}
            onCancel={handleClose}
            footer={null}
            width={720}
            className="modern-modal"
        >
            <div className="p-2">
                {data && (
                    <div className="space-y-8">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Tag color="cyan" className="rounded-full px-3 border-none font-bold text-[10px] uppercase tracking-wider">
                                        {data.categoryId?.name || "General"}
                                    </Tag>
                                    <Tag color={data.status === "ACTIVE" ? "green" : "orange"} className="rounded-full px-3 border-none font-bold text-[10px] uppercase tracking-wider">
                                        {data.status || "PENDING"}
                                    </Tag>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 leading-tight">{data.name}</h2>
                                <p className="text-slate-500 text-sm flex items-center gap-2">
                                    <FaMapMarkerAlt className="text-teal-500 opacity-70" size={12} />
                                    {data.address}
                                </p>
                            </div>
                            {data.googleAddress && (
                                <a
                                    href={data.googleAddress}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm w-fit"
                                >
                                    <FaExternalLinkAlt size={10} />
                                    Google Maps
                                </a>
                            )}
                        </div>

                        {/* Description */}
                        {data.description && (
                            <div className="px-1">
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">About this location</p>
                                <p className="text-slate-700 text-[15px] leading-relaxed italic border-l-4 border-teal-100 pl-4 py-1">
                                    "{data.description}"
                                </p>
                            </div>
                        )}

                        {/* Key Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-teal-600">
                                    <FaClock size={14} />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Timings</span>
                                </div>
                                <p className="text-slate-800 font-semibold">{data.timing || "Not specified"}</p>
                            </div>
                            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                                <div className="flex items-center gap-2 text-blue-600">
                                    <FaTools size={14} />
                                    <span className="text-[11px] font-bold uppercase tracking-wider">Services</span>
                                </div>
                                <p className="text-slate-800 font-semibold">{data.services || "General services"}</p>
                            </div>
                        </div>

                        {/* Contacts Section */}
                        <div className="modal-section">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Points</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {data.contact && data.contact.length > 0 ? data.contact.map((c, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                            <FaPhoneAlt size={14} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1">{c.name}</p>
                                            <p className="text-sm font-bold text-slate-800 tracking-wide">{c.number}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 py-4 text-center text-slate-400 italic text-sm">No contacts listed.</div>
                                )}
                            </div>
                        </div>

                        {/* Location Data Section */}
                        <div className="modal-section !mb-0 border-t border-slate-100 pt-6">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Coordinates</p>
                            <div className="flex gap-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Latitude</span>
                                    <span className="text-slate-800 font-mono text-sm">{data.lat || (data.location?.coordinates?.[1]) || "N/A"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Longitude</span>
                                    <span className="text-slate-800 font-mono text-sm">{data.lng || (data.location?.coordinates?.[0]) || "N/A"}</span>
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
