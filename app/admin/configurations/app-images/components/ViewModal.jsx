"use client";
import React, { useState } from "react";
import { Modal } from "antd";
import { FaImages, FaExternalLinkAlt } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

function ViewAppImagesModal({ modal, setModal }) {
    const [lightbox, setLightbox] = useState(null);
    const data = modal?.data;

    const handleClose = () => setModal({ name: null, state: false, data: null });

    return (
        <>
            <Modal
                title={
                    <div className="flex items-center gap-2 px-0 py-1">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                            <FaImages size={16} />
                        </div>
                        <div>
                            <span className="text-lg font-bold text-teal-700 block mt-1">Image Set Details</span>
                        </div>
                    </div>
                }
                open={modal.name === "View" && modal.state}
                onCancel={handleClose}
                footer={
                    <CustomButton
                        label="Close Details"
                        type="secondary"
                        onClick={handleClose}
                        className="w-full"
                    />
                }
                centered
                width={500}
                className="modern-modal"
            >
                {data && (
                    <div className="p-1 space-y-4">
                        {/* Meta Grid */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 bg-slate-50/50 rounded-lg border border-slate-100 flex flex-col">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Title</p>
                                <p className="text-slate-800 font-bold text-[13px]">{data.name}</p>
                            </div>
                            <div className="p-2 bg-slate-50/50 rounded-lg border border-slate-100 flex flex-col">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Key</p>
                                <p className="font-mono font-bold text-teal-700 text-[11px] tracking-tight">{data.key}</p>
                            </div>
                            <div className="p-2 bg-white rounded-lg border border-slate-100 flex flex-col">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Count</p>
                                <p className="text-slate-700 font-bold text-[11px] uppercase">{data.images?.length || 0} Assets</p>
                            </div>
                            <div className="p-2 bg-white rounded-lg border border-slate-100 flex flex-col">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Created</p>
                                <p className="text-slate-600 font-medium text-[10px]">
                                    {new Date(data.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="modal-section !mb-0 space-y-2">
                            <div className="flex items-center justify-between mb-1 pl-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Image Assets</p>
                                <span className="text-[8px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Standard</span>
                            </div>
                            
                            {data.images?.length > 0 ? (
                                <div className="grid grid-cols-5 gap-2 px-1">
                                    {data.images.map((url, idx) => (
                                        <div
                                            key={idx}
                                            className="relative group rounded-md overflow-hidden border border-slate-100 aspect-video cursor-pointer bg-slate-50"
                                            onClick={() => setLightbox(url)}
                                        >
                                            <img src={url} alt={`Asset ${idx + 1}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                                                <FaExternalLinkAlt className="text-white text-[8px] opacity-0 group-hover:opacity-100" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold text-[10px] uppercase">No images found</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Lightbox */}
            {lightbox && (
                <Modal
                    open={!!lightbox}
                    onCancel={() => setLightbox(null)}
                    footer={null}
                    centered
                    width="90vw"
                    className="lightbox-modal"
                    styles={{ body: { padding: 0 }, content: { background: "transparent", boxShadow: "none" } }}
                >
                    <img src={lightbox} alt="Preview" className="w-full max-h-[85vh] object-contain rounded-xl" />
                </Modal>
            )}
        </>
    );
}

export default ViewAppImagesModal;
