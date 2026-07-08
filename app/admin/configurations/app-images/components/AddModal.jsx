"use client";
import React, { useState, useRef, useEffect } from "react";
import { Modal } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaImages, FaPlus, FaTimes } from "react-icons/fa";
import { CREATE_APP_IMAGES } from "@/app/api/admin/app-images";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormField from "@/components/InnerPage/FormField";
import CustomButton from "@/components/shared/CustomButton";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    key: Yup.string().required("Key is required"),
});

function AddAppImagesModal({ modal, setModal }) {
    const queryClient = useQueryClient();
    const fileInputRef = useRef(null);
    const formikRef = useRef(null);

    const [previewFiles, setPreviewFiles] = useState([]); // [{file, preview}]
    const [imageError, setImageError] = useState("");

    const createMutation = useMutation({
        mutationFn: CREATE_APP_IMAGES,
        onSuccess: (data) => {
            toast.success(data?.message || "App image set created successfully");
            queryClient.invalidateQueries("appImagesList");
            handleClose(true);
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleClose = (forceClose = false) => {
        const force = forceClose === true;
        const isDirty = formikRef.current?.dirty || previewFiles.length > 0;

        if (!force && isDirty) {
            Modal.confirm({
                title: "Unsaved Changes",
                content: "You have unsaved changes. Are you sure you want to discard them and exit?",
                okText: "Discard",
                okType: "danger",
                cancelText: "Stay",
                onOk: () => {
                    formikRef.current?.resetForm();
                    setPreviewFiles([]);
                    setImageError("");
                    setModal({ name: null, state: false, data: null });
                },
            });
        } else {
            formikRef.current?.resetForm();
            setPreviewFiles([]);
            setImageError("");
            setModal({ name: null, state: false, data: null });
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newPreviews = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
        }));
        setPreviewFiles((prev) => [...prev, ...newPreviews]);
        setImageError("");
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
        setImageError("");
    };

    const removePreview = (idx) => {
        URL.revokeObjectURL(previewFiles[idx].preview);
        setPreviewFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = (values) => {
        if (previewFiles.length === 0) {
            setImageError("At least one image is required");
            return;
        }
        
        const formData = new FormData();
        formData.append("name", values.name.trim());
        formData.append("key", values.key.trim().toUpperCase());
        previewFiles.forEach(({ file }) => formData.append("images", file));
        createMutation.mutate(formData);
    };

    useEffect(() => {
        if (!modal?.state) {
            formikRef.current?.resetForm();
            setPreviewFiles([]);
            setImageError("");
        }
    }, [modal?.state]);

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                        <FaImages size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">New Image Set</span>
                    </div>
                </div>
            }
            open={modal.name === "Add" && modal.state}
            onCancel={handleClose}
            footer={null}
            centered
            width={800}
            className="modern-modal"
        >
            <div className="p-1">
                <Formik
                    innerRef={formikRef}
                    initialValues={{ name: "", key: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values, isSubmitting }) => (
                        <Form className="space-y-1">
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

                            <div className="modal-section space-y-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Media Assets</p>
                                {/* Drag & Drop Upload */}
                                <div className="flex flex-col gap-1.5">
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

                                    {/* Preview Grid */}
                                    {previewFiles.length > 0 && (
                                        <div className="grid grid-cols-5 gap-2 mt-2">
                                            {previewFiles.map((item, idx) => (
                                                <div key={idx} className="relative group rounded overflow-hidden border border-slate-100 aspect-video bg-slate-50">
                                                    <img src={item.preview} alt="" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); removePreview(idx); }}
                                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                                                    >
                                                        <FaTimes size={8} />
                                                    </button>
                                                </div>
                                            ))}
                                            <div
                                                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
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
                                    label="Create Image Set"
                                    htmlType="submit"
                                    loading={createMutation.isPending}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default AddAppImagesModal;
