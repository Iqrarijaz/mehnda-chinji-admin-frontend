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
                        <span className="text-lg font-bold text-slate-900 dark:text-slate-100 block mt-1 transition-colors duration-300">Essential Details</span>
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
                                {/* Essential Name Row */}
                                <div className="flex items-center p-2.5 px-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                    <div className="w-1/3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Essential Name</div>
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

                        {/* School Metadata Section */}
                        {data.type === 'school' && data.metadata && (
                            <div className="modal-section space-y-1.5">
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 mb-2">School Information</p>
                                <div className="space-y-1">
                                    <div className="flex items-center p-2.5 px-4 bg-slate-50/50 dark:bg-slate-900/40 rounded-sm border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                        <div className="w-1/3 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Principal</div>
                                        <div className="w-2/3 text-[12px] font-bold text-slate-700 dark:text-slate-200 capitalize">
                                            {data.metadata.principalName || "N/A"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* School Events */}
                        {data.type === 'school' && data.events?.length > 0 && (
                            <div className="space-y-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <FaCalendarAlt className="text-teal-600 dark:text-teal-400" />
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Recent & Upcoming Events</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {data.events.map((event, index) => (
                                        <div key={index} className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="px-2 py-0.5 bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-[10px] font-bold rounded uppercase tracking-wider italic">
                                                            {event.type || 'EVENT'}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{event.date}</span>
                                                    </div>
                                                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase">{event.name}</h4>
                                                </div>
                                                {event.externalLink && (
                                                    <a href={event.externalLink} target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:scale-110 transition-transform">
                                                        <FaExternalLinkAlt size={12} />
                                                    </a>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">{event.description}</p>
                                            
                                            {event.images?.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-1">
                                                    {event.images.map((img, imgIdx) => (
                                                        <div key={imgIdx} className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 cursor-zoom-in hover:scale-105 transition-transform">
                                                            <img src={img} className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* School Toppers Section */}
                        {data.type === 'school' && data.toppers && data.toppers.length > 0 && (
                            <div className="modal-section space-y-1.5">
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1 mb-2">School Toppers</p>
                                <div className="grid grid-cols-1 gap-2">
                                    {data.toppers.map((topper, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-slate-50/50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors duration-300">
                                            <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 bg-white dark:bg-slate-800">
                                                {topper.image ? (
                                                    <img src={topper.image} alt={topper.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <FaEye size={16} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="text-[12px] font-bold text-slate-700 dark:text-slate-200 capitalize truncate">{topper.name}</h4>
                                                    <Tag className="rounded-full px-2 font-bold text-[8px] uppercase tracking-normal m-0 bg-teal-100/50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-none">
                                                        {topper.passingYear}
                                                    </Tag>
                                                </div>
                                                <div className="flex items-center gap-4 mt-0.5">
                                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                                        <span className="font-bold uppercase text-[8px] opacity-70 mr-1">S/O:</span>
                                                        {topper.fatherName}
                                                    </p>
                                                    <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold whitespace-nowrap">
                                                        {topper.obtainedMarks} / {topper.totalMarks}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Other Information Section */}

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
