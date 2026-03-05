"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select, Input, Upload } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { PlusOutlined, FileTextOutlined } from "@ant-design/icons";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_POST, UPLOAD_POST_IMAGES, DELETE_POST_IMAGE } from "@/app/api/admin/posts";

const { TextArea } = Input;
const { Option } = Select;

// Post types
const POST_TYPES = [
    { value: "GENERAL", label: "General" },
    { value: "DEATH", label: "Death Announcement" },
    { value: "ACCIDENT", label: "Accident" },
    { value: "EVENT", label: "Event" },
    { value: "ANNOUNCEMENT", label: "Announcement" }
];

// Validation schema
const validationSchema = Yup.object().shape({
    content: Yup.string().required("Content is required"),
    type: Yup.string().required("Type is required"),
});

// Initial values
const initialValues = {
    content: "",
    type: "GENERAL",
    images: [],
    metadata: {
        deceasedName: "",
        dateOfDeath: "",
        relationship: "",
        location: "",
        severity: "MEDIUM",
    }
};

function AddPostModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const createPost = useMutation({
        mutationKey: ["createPost"],
        mutationFn: CREATE_POST,
        onSuccess: (data) => {
            toast.success(data?.message || "Post added successfully");
            queryClient.invalidateQueries("postsList");
            queryClient.invalidateQueries("postsListInfinite");
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const uploadImages = useMutation({
        mutationKey: ["uploadImages"],
        mutationFn: UPLOAD_POST_IMAGES,
    });

    const deleteImage = useMutation({
        mutationKey: ["deleteImage"],
        mutationFn: DELETE_POST_IMAGE,
    });

    const handleUpload = async (options, setFieldValue, currentImages) => {
        const { file, onSuccess, onError } = options;
        if (currentImages.length >= 5) {
            toast.warning("Maximum 5 images allowed");
            onError("Limit reached");
            return;
        }
        const formData = new FormData();
        formData.append("images", file);
        try {
            const response = await uploadImages.mutateAsync(formData);
            const newImageUrl = response.data[0];
            setFieldValue("images", [...currentImages, newImageUrl]);
            onSuccess(newImageUrl);
        } catch (error) {
            toast.error("Failed to upload image");
            onError(error);
        }
    };

    const handleRemove = async (file, setFieldValue, currentImages) => {
        const imageUrl = file.url || file.response;
        if (!imageUrl) return;
        try {
            await deleteImage.mutateAsync({ imageUrl });
            const updatedImages = currentImages.filter(img => img !== imageUrl);
            setFieldValue("images", updatedImages);
            toast.info("Image removed");
        } catch (error) {
            toast.error("Failed to delete image");
        }
    };

    const handleSubmit = (values) => {
        let metadata = {};
        if (values.type === "DEATH") {
            metadata = {
                deceasedName: values.metadata.deceasedName,
                dateOfDeath: values.metadata.dateOfDeath,
                relationship: values.metadata.relationship,
            };
        } else if (values.type === "ACCIDENT") {
            metadata = {
                location: values.metadata.location,
                severity: values.metadata.severity,
            };
        }
        const payload = {
            content: values.content,
            type: values.type,
            images: values.images,
            metadata: metadata
        };
        createPost.mutate(payload);
    };

    const handleCloseModal = () => {
        formikRef.current?.resetForm();
        setModal({ name: null, state: false, data: null });
    };

    useEffect(() => {
        if (!modal.state) {
            formikRef.current?.resetForm();
        }
    }, [modal.state]);

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 px-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <FileTextOutlined style={{ fontSize: '20px' }} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 block">Create New Post</span>
                        <span className="text-xs text-slate-500 font-normal">Share news, events or announcements</span>
                    </div>
                </div>
            }
            centered
            width={720}
            open={modal?.name === "Add" && modal?.state}
            onCancel={handleCloseModal}
            footer={null}
            className="modern-modal"
        >
            <div className="p-2 pt-4">
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, setFieldValue, handleChange, handleBlur, isSubmitting }) => (
                        <Form className="space-y-6">
                            {createPost.status === "loading" && <Loading />}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                {/* Type Selection */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-slate-700 font-semibold text-sm">
                                        Post Type <span className="text-red-500">*</span>
                                    </label>
                                    <Select
                                        value={values.type}
                                        onChange={(value) => setFieldValue("type", value)}
                                        className="!h-[44px] !rounded-xl overflow-hidden border-2 border-slate-100"
                                        size="large"
                                    >
                                        {POST_TYPES.map(type => (
                                            <Option key={type.value} value={type.value}>
                                                {type.label}
                                            </Option>
                                        ))}
                                    </Select>
                                    {touched.type && errors.type && (
                                        <div className="text-red-500 text-xs font-medium">{errors.type}</div>
                                    )}
                                </div>

                                {/* Reset Hint */}
                                <div className="flex justify-end pt-7">
                                    <Button
                                        type="text"
                                        size="small"
                                        className="text-slate-400 hover:text-red-500 transition-colors"
                                        onClick={() => formikRef.current?.resetForm()}
                                    >
                                        Clear all fields
                                    </Button>
                                </div>
                            </div>

                            {/* Content Area */}
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-700 font-semibold text-sm">
                                    Content <span className="text-red-500">*</span>
                                </label>
                                <TextArea
                                    name="content"
                                    placeholder="What would you like to share?"
                                    value={values.content}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    rows={5}
                                    className="!rounded-2xl !border-2 !border-slate-100 focus:!border-teal-500 !p-4 !text-[15px]"
                                />
                                {touched.content && errors.content && (
                                    <div className="text-red-500 text-xs font-medium">{errors.content}</div>
                                )}
                            </div>

                            {/* Conditional Metadata Sections */}
                            {(values.type === "DEATH" || values.type === "ACCIDENT") && (
                                <div className="modal-section bg-slate-50/50 p-5 rounded-2xl border border-dashed border-slate-200">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                        {values.type} Specific Information
                                    </p>
                                    <div className="space-y-4">
                                        {values.type === "DEATH" && (
                                            <>
                                                <FormField label="Deceased Name" name="metadata.deceasedName" placeholder="Name" />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField label="Date of Death" name="metadata.dateOfDeath" type="date" />
                                                    <FormField label="Relationship" name="metadata.relationship" placeholder="e.g. Brother" />
                                                </div>
                                            </>
                                        )}
                                        {values.type === "ACCIDENT" && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField label="Location" name="metadata.location" placeholder="Where did it happen?" />
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-700 font-semibold text-sm">Severity</label>
                                                    <Select
                                                        value={values.metadata.severity}
                                                        onChange={(value) => setFieldValue("metadata.severity", value)}
                                                        className="!h-[44px] !rounded-xl border-2 border-slate-100"
                                                    >
                                                        <Option value="LOW">Low</Option>
                                                        <Option value="MEDIUM">Medium</Option>
                                                        <Option value="HIGH">High</Option>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Media Upload */}
                            <div className="flex flex-col gap-3">
                                <label className="text-slate-700 font-semibold text-sm">Images (Optional - Max 5)</label>
                                <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-100 border-dashed">
                                    <Upload
                                        listType="picture-card"
                                        className="post-image-upload"
                                        fileList={values.images.map((url, index) => ({
                                            uid: index,
                                            name: `image-${index}`,
                                            status: 'done',
                                            url: url,
                                        }))}
                                        customRequest={(options) => handleUpload(options, setFieldValue, values.images)}
                                        onRemove={(file) => handleRemove(file, setFieldValue, values.images)}
                                        accept="image/*"
                                    >
                                        {values.images.length < 5 && (
                                            <div className="flex flex-col items-center justify-center gap-1">
                                                <PlusOutlined style={{ fontSize: '20px', color: '#64748b' }} />
                                                <div className="text-[11px] font-semibold text-slate-500">Add Image</div>
                                            </div>
                                        )}
                                    </Upload>
                                    <p className="text-xs text-slate-400 mt-2 italic px-1">
                                        Tip: High quality images get more engagement.
                                    </p>
                                </div>
                            </div>

                            {/* Modal Footer Actions */}
                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                                <Button
                                    onClick={handleCloseModal}
                                    className="modal-footer-btn-secondary"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={createPost.isLoading}
                                    disabled={isSubmitting}
                                    className="modal-footer-btn-primary"
                                >
                                    Publish Post
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default AddPostModal;
