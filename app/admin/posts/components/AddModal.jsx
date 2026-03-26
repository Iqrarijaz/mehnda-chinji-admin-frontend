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
    },
    isDeleted: false,
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
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                        <FileTextOutlined style={{ fontSize: '16px' }} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">Create New Post</span>
                    </div>
                </div>
            }
            centered
            width={600}
            open={modal?.name === "Add" && modal?.state}
            onCancel={handleCloseModal}
            footer={null}
            className="modern-modal"
        >
            <div className="p-1">
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, setFieldValue, handleChange, handleBlur, isSubmitting }) => (
                        <Form className="space-y-2">
                            {createPost.status === "loading" && <Loading />}

                            <div className="modal-section pb-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Basic Info</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-slate-700 font-semibold text-xs">Post Type <span className="text-red-500">*</span></label>
                                        <Select
                                            value={values.type}
                                            onChange={(value) => setFieldValue("type", value)}
                                            className="w-full modern-select-box"
                                            size="middle"
                                        >
                                            {POST_TYPES.map(type => (
                                                <Option key={type.value} value={type.value}>{type.label}</Option>
                                            ))}
                                        </Select>
                                        {touched.type && errors.type && (
                                            <div className="text-red-500 text-[10px] font-medium">{errors.type}</div>
                                        )}
                                    </div>

                                    <div className="flex justify-end pt-5">
                                        <CustomButton
                                            label="Clear all fields"
                                            type="secondary"
                                            size="small"
                                            className="!h-auto !py-1 !text-slate-400 hover:!text-red-500 transition-colors text-[10px] font-medium !bg-transparent !border-none shadow-none"
                                            onClick={() => formikRef.current?.resetForm()}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="modal-section">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Content</p>
                                <div className="flex flex-col gap-1.5">
                                    <TextArea
                                        name="content"
                                        placeholder="What would you like to share?"
                                        value={values.content}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        rows={3}
                                        className="!rounded !border-2 !border-slate-100 focus:!border-teal-500 !p-2 !text-xs"
                                    />
                                    {touched.content && errors.content && (
                                        <div className="text-red-500 text-[10px] font-medium">{errors.content}</div>
                                    )}
                                </div>
                            </div>

                            {(values.type === "DEATH" || values.type === "ACCIDENT") && (
                                <div className="modal-section">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                                        {values.type} Information
                                    </p>
                                    <div className="space-y-2">
                                        {values.type === "DEATH" && (
                                            <>
                                            <>
                                                <FormField label="Deceased Name" name="metadata.deceasedName" placeholder="Name" className="!h-[32px] !text-xs" />
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <FormField label="Date of Death" name="metadata.dateOfDeath" type="date" className="!h-[32px] !text-xs" />
                                                    <FormField label="Relationship" name="metadata.relationship" placeholder="e.g. Brother" className="!h-[32px] !text-xs" />
                                                </div>
                                            </>
                                            </>
                                        )}
                                        {values.type === "ACCIDENT" && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <FormField label="Location" name="metadata.location" placeholder="Where did it happen?" className="!h-[32px] !text-xs" />
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-slate-700 font-semibold text-xs">Severity</label>
                                                    <Select
                                                        value={values.metadata.severity}
                                                        onChange={(value) => setFieldValue("metadata.severity", value)}
                                                        className="w-full modern-select-box"
                                                    >
                                                        <Select.Option value="LOW">Low</Select.Option>
                                                        <Select.Option value="MEDIUM">Medium</Select.Option>
                                                        <Select.Option value="HIGH">High</Select.Option>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="modal-section !mb-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Media</p>
                                <div className="bg-slate-50/50 rounded p-2 border-2 border-slate-100 border-dashed">
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
                                            <div className="flex flex-col items-center justify-center gap-0.5">
                                                <PlusOutlined style={{ fontSize: '14px', color: '#64748b' }} />
                                                <div className="text-[9px] font-semibold text-slate-500 uppercase tracking-tight">Add</div>
                                            </div>
                                        )}
                                    </Upload>
                                </div>
                            </div>

                             <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleCloseModal}
                                />
                                <CustomButton
                                    label="Publish Post"
                                    htmlType="submit"
                                    loading={createPost.isLoading || isSubmitting}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default AddPostModal;
