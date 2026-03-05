"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select, Input, Upload } from "antd";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_POST, UPLOAD_POST_IMAGES, DELETE_POST_IMAGE } from "@/app/api/admin/posts";
import { useQueryClient } from "react-query";
import { PlusOutlined } from "@ant-design/icons";

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

function UpdatePostModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const updatePost = useMutation({
        mutationKey: ["updatePost"],
        mutationFn: UPDATE_POST,
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
            console.error("Upload error:", error);
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
            console.error("Delete error:", error);
            toast.error("Failed to delete image");
        }
    };

    const handleSubmit = (values) => {
        // Build metadata based on type
        let metadata = {};
        if (values.type === "DEATH") {
            metadata = {
                deceasedName: values.metadata?.deceasedName || "",
                dateOfDeath: values.metadata?.dateOfDeath || "",
                relationship: values.metadata?.relationship || "",
            };
        } else if (values.type === "ACCIDENT") {
            metadata = {
                location: values.metadata?.location || "",
                severity: values.metadata?.severity || "",
            };
        }

        const payload = {
            _id: modal?.data?._id,
            content: values.content,
            type: values.type,
            images: values.images,
            metadata: metadata
        };

        updatePost.mutate(payload);
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

    // Prepare initial values from modal data
    const initialValues = {
        content: modal?.data?.content || "",
        type: modal?.data?.type || "GENERAL",
        images: modal?.data?.images || [],
        metadata: modal?.data?.metadata || {}
    };

    return (
        <Modal
            title="Update Post"
            className="!rounded"
            open={modal?.name === "Update" && modal?.state}
            onCancel={handleCloseModal}
            footer={null}
            width={700}
        >
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, errors, touched, setFieldValue, handleChange, handleBlur }) => (
                    <Form className="flex flex-col gap-4">
                        {updatePost.status === "loading" && <Loading />}


                        {/* Type Selection */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">
                                Type <span className="text-red-500">*</span>
                            </label>
                            <Select
                                value={values.type}
                                onChange={(value) => setFieldValue("type", value)}
                                placeholder="Select post type"
                                className="w-full"
                            >
                                {POST_TYPES.map(type => (
                                    <Option key={type.value} value={type.value}>
                                        {type.label}
                                    </Option>
                                ))}
                            </Select>
                            {touched.type && errors.type && (
                                <span className="text-red-500 text-xs">{errors.type}</span>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">
                                Content <span className="text-red-500">*</span>
                            </label>
                            <TextArea
                                name="content"
                                placeholder="Enter post content"
                                value={values.content}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                rows={4}
                            />
                            {touched.content && errors.content && (
                                <span className="text-red-500 text-xs">{errors.content}</span>
                            )}
                        </div>

                        {/* Type-specific metadata fields */}
                        {values.type === "DEATH" && (
                            <>
                                <FormField
                                    label="Deceased Name"
                                    name="metadata.deceasedName"
                                    placeholder="Enter deceased person's name"
                                    value={values.metadata?.deceasedName || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <FormField
                                    label="Date of Death"
                                    name="metadata.dateOfDeath"
                                    type="date"
                                    value={values.metadata?.dateOfDeath || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <FormField
                                    label="Relationship"
                                    name="metadata.relationship"
                                    placeholder="e.g., Father, Mother, Brother"
                                    value={values.metadata?.relationship || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </>
                        )}

                        {values.type === "ACCIDENT" && (
                            <>
                                <FormField
                                    label="Location"
                                    name="metadata.location"
                                    placeholder="Enter accident location"
                                    value={values.metadata?.location || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">Severity</label>
                                    <Select
                                        value={values.metadata?.severity || ""}
                                        onChange={(value) => setFieldValue("metadata.severity", value)}
                                        placeholder="Select severity"
                                        className="w-full"
                                    >
                                        <Option value="LOW">Low</Option>
                                        <Option value="MEDIUM">Medium</Option>
                                        <Option value="HIGH">High</Option>
                                    </Select>
                                </div>
                            </>
                        )}

                        {/* Images */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Images (Max 5)</label>
                            <Upload
                                listType="picture-card"
                                fileList={Array.isArray(values.images) ? values.images.map((url, index) => ({
                                    uid: index,
                                    name: `image-${index}`,
                                    status: 'done',
                                    url: url,
                                })) : []}
                                customRequest={(options) => handleUpload(options, setFieldValue, values.images)}
                                onRemove={(file) => handleRemove(file, setFieldValue, values.images)}
                                accept="image/*"
                            >
                                {values.images.length < 5 && (
                                    <div>
                                        <PlusOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                )}
                            </Upload>
                            <span className="text-xs text-gray-500">Upload up to 5 images for this post.</span>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-2 mt-4">
                            <Button onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={updatePost.isLoading}
                            >
                                Update Post
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}

export default UpdatePostModal;
