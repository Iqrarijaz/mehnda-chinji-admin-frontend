"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select, Input } from "antd";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_POST } from "@/app/api/admin/posts";
import { useQueryClient } from "react-query";

const { TextArea } = Input;
const { Option } = Select;

// Post types
const POST_TYPES = [
    { value: "GENERAL", label: "General" },
    { value: "DEATH", label: "Death Announcement" },
    { value: "EVENT", label: "Event" },
    { value: "ANNOUNCEMENT", label: "Announcement" }
];

// Validation schema
const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
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
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "postsList",
            });
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = (values) => {
        // Build metadata based on type
        let metadata = {};
        if (values.type === "DEATH") {
            metadata = {
                deceasedName: values.metadata?.deceasedName || "",
                dateOfDeath: values.metadata?.dateOfDeath || "",
                relationship: values.metadata?.relationship || "",
            };
        } else if (values.type === "EVENT") {
            metadata = {
                eventName: values.metadata?.eventName || "",
                eventDate: values.metadata?.eventDate || "",
                location: values.metadata?.location || "",
            };
        } else if (values.type === "ANNOUNCEMENT") {
            metadata = {
                priority: values.metadata?.priority || "",
                expiryDate: values.metadata?.expiryDate || "",
            };
        }

        const payload = {
            _id: modal?.data?._id,
            title: values.title,
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
        title: modal?.data?.title || "",
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

                        {/* Title */}
                        <FormField
                            label="Title"
                            name="title"
                            placeholder="Enter post title"
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.title && errors.title}
                            required
                        />

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

                        {values.type === "EVENT" && (
                            <>
                                <FormField
                                    label="Event Name"
                                    name="metadata.eventName"
                                    placeholder="Enter event name"
                                    value={values.metadata?.eventName || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <FormField
                                    label="Event Date"
                                    name="metadata.eventDate"
                                    type="datetime-local"
                                    value={values.metadata?.eventDate || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <FormField
                                    label="Location"
                                    name="metadata.location"
                                    placeholder="Enter event location"
                                    value={values.metadata?.location || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </>
                        )}

                        {values.type === "ANNOUNCEMENT" && (
                            <>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium">Priority</label>
                                    <Select
                                        value={values.metadata?.priority || ""}
                                        onChange={(value) => setFieldValue("metadata.priority", value)}
                                        placeholder="Select priority"
                                        className="w-full"
                                    >
                                        <Option value="LOW">Low</Option>
                                        <Option value="MEDIUM">Medium</Option>
                                        <Option value="HIGH">High</Option>
                                    </Select>
                                </div>
                                <FormField
                                    label="Expiry Date"
                                    name="metadata.expiryDate"
                                    type="date"
                                    value={values.metadata?.expiryDate || ""}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </>
                        )}

                        {/* Images (placeholder for now) */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Images (URLs)</label>
                            <TextArea
                                placeholder="Enter image URLs separated by commas"
                                value={Array.isArray(values.images) ? values.images.join(", ") : ""}
                                onChange={(e) => {
                                    const urls = e.target.value.split(",").map(url => url.trim()).filter(url => url);
                                    setFieldValue("images", urls);
                                }}
                                rows={2}
                            />
                            <span className="text-xs text-gray-500">Enter image URLs separated by commas</span>
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
