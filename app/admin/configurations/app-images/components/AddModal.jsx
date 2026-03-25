"use client";
import React, { useState, useRef } from "react";
import { Modal, Button, Input } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaImages, FaPlus, FaTimes } from "react-icons/fa";
import { CREATE_APP_IMAGES } from "@/app/api/admin/app-images";
import CustomButton from "@/components/shared/CustomButton";

function AddAppImagesModal({ modal, setModal }) {
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);

    const [name, setName] = useState("");
    const [key, setKey] = useState("");
    const [previewFiles, setPreviewFiles] = useState([]); // [{file, preview}]
    const [errors, setErrors] = useState({});

    const createMutation = useMutation({
        mutationFn: CREATE_APP_IMAGES,
        onSuccess: (data) => {
            toast.success(data?.message || "App image set created successfully");
            queryClient.invalidateQueries("appImagesList");
            handleClose();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleClose = () => {
        setName("");
        setKey("");
        setPreviewFiles([]);
        setErrors({});
        setModal({ name: null, state: false, data: null });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setPreviewFiles((prev) => [...prev, ...newPreviews]);
        e.target.value = null;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
        const newPreviews = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setPreviewFiles((prev) => [...prev, ...newPreviews]);
    };

    const removePreview = (idx) => {
        URL.revokeObjectURL(previewFiles[idx].preview);
        setPreviewFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    const validate = () => {
        const errs = {};
        if (!name.trim()) errs.name = "Name is required";
        if (!key.trim()) errs.key = "Key is required";
        if (previewFiles.length === 0) errs.images = "At least one image is required";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = () => {
        if (!validate()) return;
        const formData = new FormData();
        formData.append("name", name.trim());
        formData.append("key", key.trim().toUpperCase());
        previewFiles.forEach(({ file }) => formData.append("images", file));
        createMutation.mutate(formData);
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaImages size={18} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-900 block">New Image Set</span>
                        <span className="text-xs text-slate-500 font-normal">Upload banner images for the mobile app</span>
                    </div>
                </div>
            }
            open={modal.name === "Add" && modal.state}
            onCancel={handleClose}
            footer={null}
            centered
            width={600}
            className="modern-modal"
        >
            <div className="">
                <div className="space-y-1">
                    <div className="modal-section">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Basic Information</p>
                        <div className="grid grid-cols-1 gap-3">
                            {/* Name */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-700 font-semibold text-xs">Name <span className="text-red-500">*</span></label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Home Banner"
                                    className="!h-[40px] !rounded-lg !border-2 !border-slate-100 focus:!border-teal-500 font-medium text-sm"
                                />
                                {errors.name && <span className="text-red-500 text-[10px] font-medium">{errors.name}</span>}
                            </div>

                            {/* Key */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-slate-700 font-semibold text-xs">Key <span className="text-red-500">*</span></label>
                                <Input
                                    value={key}
                                    onChange={(e) => setKey(e.target.value.toUpperCase())}
                                    placeholder="e.g. HOME_BANNER"
                                    className="!h-[40px] !rounded-lg !border-2 !border-slate-100 focus:!border-teal-500 font-mono font-bold tracking-wider text-sm"
                                />
                                {errors.key && <span className="text-red-500 text-[10px] font-medium">{errors.key}</span>}
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Auto-converted to uppercase</p>
                            </div>
                        </div>
                    </div>

                    <div className="modal-section">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Media Assets</p>
                        {/* Drag & Drop Upload */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-slate-700 font-semibold text-xs">Select Images <span className="text-red-500">*</span></label>
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all text-center group"
                            >
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-2 group-hover:bg-teal-50 transition-colors">
                                    <FaImages size={20} className="text-slate-300 group-hover:text-teal-400 transition-colors" />
                                </div>
                                <p className="text-xs font-semibold text-slate-600">Drag & drop images here</p>
                                <p className="text-[10px] text-slate-400 mt-1">or <span className="text-teal-600 font-bold">browse</span></p>
                                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                            </div>
                            {errors.images && <span className="text-red-500 text-[10px] font-medium">{errors.images}</span>}

                            {/* Preview Grid */}
                            {previewFiles.length > 0 && (
                                <div className="grid grid-cols-4 gap-2 mt-2">
                                    {previewFiles.map((item, idx) => (
                                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-100 shadow-sm aspect-square bg-slate-50">
                                            <img src={item.preview} alt="" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors pointer-events-none" />
                                            <button
                                                type="button"
                                                onClick={() => removePreview(idx)}
                                                className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-lg"
                                            >
                                                <FaTimes size={10} />
                                            </button>
                                        </div>
                                    ))}
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-square border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all text-slate-300 hover:text-teal-500"
                                    >
                                        <FaPlus size={14} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                        <CustomButton
                            label="Cancel"
                            type="secondary"
                            onClick={handleClose}
                        />
                        <CustomButton
                            label="Create Image Set"
                            type="primary"
                            onClick={handleSubmit}
                            loading={createMutation.isLoading}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default AddAppImagesModal;
