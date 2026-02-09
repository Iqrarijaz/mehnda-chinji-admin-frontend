"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select, Input } from "antd";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_POST } from "@/app/api/admin/posts";
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

// Initial values
const initialValues = {
    title: "",
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
                deceasedName: values.metadata.deceasedName,
                dateOfDeath: values.metadata.dateOfDeath,
                relationship: values.metadata.relationship,
            };
        } else if (values.type === "EVENT") {
            metadata = {
                eventName: values.metadata.eventName,
                eventDate: values.metadata.eventDate,
                location: values.metadata.location,
            };
        } else if (values.type === "ANNOUNCEMENT") {
            metadata = {
                priority: values.metadata.priority,
                expiryDate: values.metadata.expiryDate,
            };
        }

        const payload = {
            title: values.title,
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

                            {/* Title */}
                            <FormField
                                label="Title"
                                name="title"
                                placeholder="Enter post title"
                                required
                            />

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

                            {values.type === "EVENT" && (
                                <>
                                    <FormField
                                        label="Event Name"
                                        name="metadata.eventName"
                                        placeholder="Enter event name"
                                    />
                                    <FormField
                                        label="Event Date"
                                        name="metadata.eventDate"
                                        type="datetime-local"
                                    />
                                    <FormField
                                        label="Location"
                                        name="metadata.location"
                                        placeholder="Enter event location"
                                    />
                                </>
                            )}

                            {values.type === "ANNOUNCEMENT" && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-lg text-black mb-1">Priority</label>
                                        <Select
                                            value={values.metadata.priority}
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
                                    />
                                </>
                            )}

                            {/* Images */}
                            <div className="mb-4">
                                <label className="block text-lg text-black mb-1">Images (URLs)</label>
                                <TextArea
                                    placeholder="Enter image URLs separated by commas"
                                    value={values.images.join(", ")}
                                    onChange={(e) => {
                                        const urls = e.target.value.split(",").map(url => url.trim()).filter(url => url);
                                        setFieldValue("images", urls);
                                    }}
                                    rows={2}
                                />
                                <span className="text-xs text-gray-500">Enter image URLs separated by commas</span>
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
