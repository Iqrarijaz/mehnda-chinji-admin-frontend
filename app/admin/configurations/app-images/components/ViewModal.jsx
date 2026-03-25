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
                    <div className="flex items-center gap-3 px-2 pt-1">
                        <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                            <FaImages size={18} />
                        </div>
                        <div>
                            <span className="text-xl font-bold text-slate-900 block">Image Set Details</span>
                            <span className="text-xs text-slate-500 font-normal">Detailed overview of this asset collection</span>
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
                        className="w-full !h-[48px] font-bold"
                    />
                }
                centered
                width={620}
                className="modern-modal"
            >
                {data && (
                    <div className="p-1 pt-2 space-y-6">
                        {/* Meta Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-0.5">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Display Name</p>
                                <p className="text-slate-800 font-extrabold text-base">{data.name}</p>
                            </div>
                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-0.5">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Identification Key</p>
                                <p className="font-mono font-black text-teal-700 tracking-wider text-base">{data.key}</p>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col gap-0.5">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Asset Count</p>
                                <p className="text-slate-800 font-bold text-sm">{data.images?.length || 0} Images</p>
                            </div>
                            <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col gap-0.5">
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Created Date</p>
                                <p className="text-slate-800 font-bold text-sm">
                                    {new Date(data.createdAt).toLocaleDateString("en-PK", { 
                                        year: "numeric", 
                                        month: "long", 
                                        day: "numeric",
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>

                        {/* Image Gallery */}
                        <div className="modal-section !mb-0">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Image Assets</p>
                                <span className="text-[8px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full uppercase">Standard</span>
                            </div>
                            
                            {data.images?.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {data.images.map((url, idx) => (
                                        <div
                                            key={idx}
                                            className="relative group rounded-xl overflow-hidden border border-slate-100 shadow-sm aspect-square cursor-pointer bg-slate-50"
                                            onClick={() => setLightbox(url)}
                                        >
                                            <img src={url} alt={`Asset ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center backdrop-blur-[0px] group-hover:backdrop-blur-[2px]">
                                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 duration-300">
                                                    <FaExternalLinkAlt className="text-white text-[10px]" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                    <FaImages size={32} className="mx-auto mb-2 text-slate-200" />
                                    <p className="text-slate-400 font-medium text-xs">No images found</p>
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
