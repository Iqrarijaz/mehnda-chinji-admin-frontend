"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select, Input, Upload } from "antd";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_POST, UPLOAD_POST_IMAGES, DELETE_POST_IMAGE } from "@/app/api/admin/posts";
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

// Initial values
const initialValues = {
    content: "",
    type: "GENERAL",
    images: [],
    metadata: {
        // DEATH type
        deceasedName: "",
        dateOfDeath: "",
        relationship: "",
        // EVENT type
        eventName: "",
        eventDate: "",
        location: "",
        // ANNOUNCEMENT type
        priority: "",
        expiryDate: "",
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
            title="Add Post"
            className="!rounded"
            centered
            width={800}
            open={modal?.name === "Add" && modal?.state}
            onCancel={handleCloseModal}
            footer={null}
            afterClose={() => formikRef.current?.resetForm()}
        >
            <div className="mb-4 flex justify-end">
                <Button
                    className="reset-button"
                    onClick={() => formikRef.current?.resetForm()}
                >
                    Reset
                </Button>
            </div>

            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, setFieldValue, handleChange, handleBlur, isSubmitting }) => (
                    <Form>
                        <div className="bg-gray-100 p-2 rounded max-h-[60vh] overflow-y-auto">

                            {createPost.status === "loading" && <Loading />}


                            {/* Type Selection */}
                            <div className="mb-4">
                                <label className="block text-lg text-black mb-1">
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
                                    <div className="text-red-500 text-sm mt-1">{errors.type}</div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="mb-4">
                                <label className="block text-lg text-black mb-1">
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
                                    <div className="text-red-500 text-sm mt-1">{errors.content}</div>
                                )}
                            </div>

                            {/* Type-specific metadata fields */}
                            {values.type === "DEATH" && (
                                <>
                                    <FormField
                                        label="Deceased Name"
                                        name="metadata.deceasedName"
                                        placeholder="Enter deceased person's name"
                                    />
                                    <FormField
                                        label="Date of Death"
                                        name="metadata.dateOfDeath"
                                        type="date"
                                    />
                                    <FormField
                                        label="Relationship"
                                        name="metadata.relationship"
                                        placeholder="e.g., Father, Mother, Brother"
                                    />
                                </>
                            )}

                            {values.type === "ACCIDENT" && (
                                <>
                                    <FormField
                                        label="Location"
                                        name="metadata.location"
                                        placeholder="Enter accident location"
                                    />
                                    <div className="mb-4">
                                        <label className="block text-lg text-black mb-1">Severity</label>
                                        <Select
                                            value={values.metadata.severity}
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
                            <div className="mb-4">
                                <label className="block text-lg text-black mb-1">Images (Max 5)</label>
                                <Upload
                                    listType="picture-card"
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
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    )}
                                </Upload>
                                <span className="text-xs text-gray-500">Upload up to 5 images for this post.</span>
                            </div>
                        </div>

                        {/* Submit Button - Outside scrollable area */}
                        <div className="flex justify-end gap-2 mt-4">
                            <Button onClick={handleCloseModal}>
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={createPost.isLoading}
                                disabled={isSubmitting}
                            >
                                Add Post
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}

export default AddPostModal;
