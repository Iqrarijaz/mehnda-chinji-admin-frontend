"use client";
import React, { useState, useRef, useEffect } from "react";
import { Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaImages, FaPlus, FaTimes } from "react-icons/fa";
import { UPDATE_APP_IMAGES } from "@/app/api/admin/app-images";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormField from "@/components/InnerPage/FormField";
import CustomButton from "@/components/shared/CustomButton";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    key: Yup.string().required("Key is required"),
});

function EditAppImagesModal({ modal, setModal }) {
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);
    const formikRef = useRef(null);

    const [existingImages, setExistingImages] = useState([]); // already-saved URLs
    const [newFiles, setNewFiles] = useState([]);              // {file, preview}
    const [imageError, setImageError] = useState("");

    // Populate form when modal opens
    useEffect(() => {
        if (modal.name === "Edit" && modal.state && modal.data) {
            setExistingImages(modal.data.images || []);
            setNewFiles([]);
            setImageError("");
        }
    }, [modal]);

    const updateMutation = useMutation({
        mutationFn: UPDATE_APP_IMAGES,
        onSuccess: (data) => {
            toast.success(data?.message || "App image set updated successfully");
            queryClient.invalidateQueries("appImagesList");
            handleClose(true);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleClose = (forceClose = false) => {
        const force = forceClose === true;
        const isDirty = (
            formikRef.current?.dirty ||
            newFiles.length > 0 ||
            existingImages.length !== (modal.data?.images?.length || 0)
        );

        if (!force && isDirty) {
            Modal.confirm({
                title: "Unsaved Changes",
                content: "You have unsaved changes. Are you sure you want to discard them and exit?",
                okText: "Discard",
                okType: "danger",
                cancelText: "Stay",
                onOk: () => {
                    formikRef.current?.resetForm();
                    setModal({ name: null, state: false, data: null });
                },
            });
        } else {
            formikRef.current?.resetForm();
            setModal({ name: null, state: false, data: null });
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
        setNewFiles((prev) => [...prev, ...previews]);
        setImageError("");
        e.target.value = null;
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
        const previews = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
        setNewFiles((prev) => [...prev, ...previews]);
        setImageError("");
    };

    const removeExisting = (idx) => setExistingImages((prev) => prev.filter((_, i) => i !== idx));
    const removeNew = (idx) => {
        URL.revokeObjectURL(newFiles[idx].preview);
        setNewFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (values) => {
        if (existingImages.length === 0 && newFiles.length === 0) {
            setImageError("At least one image is required");
            return;
        }
        const formData = new FormData();
        formData.append("_id", modal.data._id);
        formData.append("name", values.name.trim());
        formData.append("key", values.key.trim().toUpperCase());
        formData.append("existingImages", JSON.stringify(existingImages));
        newFiles.forEach(({ file }) => formData.append("images", file));
        updateMutation.mutate(formData);
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                        <FaImages size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">Edit Image Set</span>
                    </div>
                </div>
            }
            open={modal.name === "Edit" && modal.state}
            onCancel={handleClose}
            footer={null}
            centered
            width={800}
            className="modern-modal"
            destroyOnClose
        >
            <div className="p-1">
                <Formik
                    enableReinitialize
                    innerRef={formikRef}
                    initialValues={{
                        name: modal.data?.name || "",
                        key: modal.data?.key || "",
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values, isSubmitting }) => (
                        <Form className="space-y-4">
                            <div className="modal-section space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Basic Information</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="md:col-span-1">
                                        <FormField
                                            label="Title"
                                            name="name"
                                            placeholder="e.g. Home Banner"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-1">
                                        <FormField
                                            label="Key"
                                            name="key"
                                            placeholder="ID_KEY"
                                            required
                                            onChange={(e) => setFieldValue("key", e.target.value.toUpperCase())}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-section space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Media Management</p>
                                {/* Existing Images */}
                                {existingImages.length > 0 && (
                                    <div className="space-y-1.5 relative px-1">
                                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight pl-1">Current Images</label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {existingImages.map((url, idx) => (
                                                <div key={idx} className="relative group rounded overflow-hidden border border-slate-100 aspect-video bg-slate-50">
                                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExisting(idx)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                                    >
                                                        <FaTimes size={8} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Uploads */}
                                <div className="flex flex-col gap-1.5 px-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight pl-1">Add New Images</label>
                                    <div
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border border-dashed border-slate-200 rounded p-4 flex flex-col items-center justify-center cursor-pointer hover:border-[#006666] hover:bg-teal-50/20 transition-all text-center group"
                                    >
                                        <FaImages size={16} className="text-slate-300 group-hover:text-[#006666] mb-1" />
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Drop or <span className="text-[#006666]">browse</span> images</p>
                                        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
                                    </div>
                                    {imageError && <span className="text-red-500 text-[10px] font-medium ml-1">{imageError}</span>}

                                    {/* New Preview Grid */}
                                    {newFiles.length > 0 && (
                                        <div className="grid grid-cols-5 gap-2 mt-2">
                                            {newFiles.map((item, idx) => (
                                                <div key={idx} className="relative group rounded overflow-hidden border border-emerald-100 aspect-video bg-slate-50">
                                                    <img src={item.preview} alt="" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeNew(idx)}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                                    >
                                                        <FaTimes size={8} />
                                                    </button>
                                                    <div className="absolute bottom-0 left-0 right-0 bg-emerald-600 text-[8px] text-white font-bold py-0.5 text-center uppercase tracking-tighter shadow-sm">New</div>
                                                </div>
                                            ))}
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="aspect-video border border-dashed border-slate-200 rounded flex items-center justify-center cursor-pointer hover:border-[#006666] hover:bg-teal-50/20 transition-all text-slate-300 hover:text-[#006666]"
                                            >
                                                <FaPlus size={10} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleClose}
                                />
                                <CustomButton
                                    label="Update Image Set"
                                    htmlType="submit"
                                    loading={updateMutation.isPending}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default EditAppImagesModal;
