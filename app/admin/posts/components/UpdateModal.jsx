"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal, Select, Input, Upload } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { PlusOutlined, FileTextOutlined } from "@ant-design/icons";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_POST, UPLOAD_POST_IMAGES, DELETE_POST_IMAGE } from "@/app/api/admin/posts";

const { TextArea } = Input;
const { Option } = Select;

const POST_TYPES = [
    { value: "GENERAL", label: "General" },
    { value: "DEATH", label: "Death Announcement" },
    { value: "ACCIDENT", label: "Accident" },
    { value: "EVENT", label: "Event" },
    { value: "ANNOUNCEMENT", label: "Announcement" }
];

const validationSchema = Yup.object().shape({
    content: Yup.string().required("Content is required"),
    type: Yup.string().required("Type is required"),
});

function UpdatePostModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const updatePost = useMutation({
        mutationKey: ["updatePost"],
        mutationFn: (payload) => UPDATE_POST(payload),
        onSuccess: (data) => {
            toast.success(data?.message || "Post updated successfully");
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
            _id: modal?.data?._id,
            content: values.content,
            type: values.type,
            images: values.images,
            metadata: metadata,
            status: values.status
        };
        updatePost.mutate(payload);
    };

    const handleCloseModal = () => {
        setModal({ name: null, state: false, data: null });
    };

    const initialValues = {
        content: modal?.data?.content || "",
        type: modal?.data?.type || "GENERAL",
        status: modal?.data?.status || "ACTIVE",
        images: modal?.data?.images || [],
        metadata: {
            deceasedName: modal?.data?.metadata?.deceasedName || "",
            dateOfDeath: modal?.data?.metadata?.dateOfDeath ? new Date(modal.data.metadata.dateOfDeath).toISOString().split('T')[0] : "",
            relationship: modal?.data?.metadata?.relationship || "",
            location: modal?.data?.metadata?.location || "",
            severity: modal?.data?.metadata?.severity || "MEDIUM",
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <FileTextOutlined style={{ fontSize: '18px' }} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-900 block">Edit Post</span>
                        <span className="text-xs text-slate-500 font-normal">Update content or adjust metadata for this post</span>
                    </div>
                </div>
            }
            centered
            width={600}
            open={modal?.name === "Update" && modal?.state}
            onCancel={handleCloseModal}
            footer={null}
            className="modern-modal"
        >
            <div className="p-1">
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, setFieldValue, handleChange, handleBlur, isSubmitting }) => (
                        <Form className="space-y-4">
                            {updatePost.status === "loading" && <Loading />}

                            <div className="modal-section pb-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Configuration</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-slate-700 font-semibold text-xs">Post Type</label>
                                        <Select
                                            value={values.type}
                                            onChange={(value) => setFieldValue("type", value)}
                                            className="!h-[36px] !rounded-lg overflow-hidden border-2 border-slate-100 [&>div]:!shadow-none [&>div]:!border-none"
                                            size="middle"
                                        >
                                            {POST_TYPES.map(type => (
                                                <Option key={type.value} value={type.value}>{type.label}</Option>
                                            ))}
                                        </Select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-slate-700 font-semibold text-xs">Status</label>
                                        <Select
                                            value={values.status}
                                            onChange={(value) => setFieldValue("status", value)}
                                            className="!h-[36px] !rounded-lg overflow-hidden border-2 border-slate-100 [&>div]:!shadow-none [&>div]:!border-none"
                                            size="middle"
                                        >
                                            <Option value="ACTIVE">Active</Option>
                                            <Option value="ARCHIVED">Archived</Option>
                                            <Option value="PENDING">Pending</Option>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-section">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Content</p>
                                <div className="flex flex-col gap-1.5">
                                    <TextArea
                                        name="content"
                                        placeholder="Update post content"
                                        value={values.content}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        rows={4}
                                        className="!rounded-xl !border-2 !border-slate-100 focus:!border-teal-500 !p-3 !text-sm"
                                    />
                                    {touched.content && errors.content && (
                                        <div className="text-red-500 text-[10px] font-medium">{errors.content}</div>
                                    )}
                                </div>
                            </div>

                            {(values.type === "DEATH" || values.type === "ACCIDENT") && (
                                <div className="modal-section bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        Type-Specific Data
                                    </p>
                                    <div className="space-y-3">
                                        {values.type === "DEATH" && (
                                            <>
                                                <FormField label="Deceased Name" name="metadata.deceasedName" className="!h-[36px] !text-sm" />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <FormField label="Date of Death" name="metadata.dateOfDeath" type="date" className="!h-[36px] !text-sm" />
                                                    <FormField label="Relationship" name="metadata.relationship" className="!h-[36px] !text-sm" />
                                                </div>
                                            </>
                                        )}
                                        {values.type === "ACCIDENT" && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <FormField label="Location" name="metadata.location" className="!h-[36px] !text-sm" />
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-slate-700 font-semibold text-xs">Severity</label>
                                                    <Select
                                                        value={values.metadata.severity}
                                                        onChange={(value) => setFieldValue("metadata.severity", value)}
                                                        className="!h-[36px] !rounded-lg border-2 border-slate-100"
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

                            <div className="modal-section">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Media</p>
                                <div className="bg-slate-50 rounded-xl p-3 border-2 border-slate-100 border-dashed">
                                    <Upload
                                        listType="picture-card"
                                        className="post-image-upload-compact scale-[0.85] origin-left"
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
                                                <PlusOutlined style={{ fontSize: '18px', color: '#64748b' }} />
                                                <div className="text-[10px] font-semibold text-slate-500">Update</div>
                                            </div>
                                        )}
                                    </Upload>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleCloseModal}
                                />
                                <CustomButton
                                    label="Update Post"
                                    htmlType="submit"
                                    loading={updatePost.isLoading || isSubmitting}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default UpdatePostModal;
