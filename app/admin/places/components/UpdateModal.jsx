"use client";
import React, { useRef } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select, Input } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_PLACE } from "@/app/api/admin/places";
import { PLACE_CATEGORIES } from "@/config/config";
import SelectBox from "@/components/SelectBox";

const { Option } = Select;

// Validation schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    address: Yup.string().required("Address is required"),
    lat: Yup.number().required("Latitude is required").typeError("Must be a number"),
    lng: Yup.number().required("Longitude is required").typeError("Must be a number"),
    categoryId: Yup.string().required("Category is required"),
    contact: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Contact name is required"),
            number: Yup.string().required("Contact number is required"),
        })
    )
});

function UpdatePlaceModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    // Categories are now constants
    const categoriesLoading = false;

    const updatePlace = useMutation({
        mutationKey: ["updatePlace"],
        mutationFn: (payload) => UPDATE_PLACE(payload),
        onSuccess: (data) => {
            toast.success(data?.message || "Place updated successfully");
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "placesList",
            });
            queryClient.invalidateQueries("placeStatusCounts");
            setModal({ name: null, state: false, data: null });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const initialValues = {
        name: modal?.data?.name || "",
        description: modal?.data?.description || "",
        address: modal?.data?.address || "",
        timing: modal?.data?.timing || "",
        services: modal?.data?.services || "",
        googleAddress: modal?.data?.googleAddress || "",
        lat: modal?.data?.location?.lat || modal?.data?.location?.coordinates?.[1] || "",
        lng: modal?.data?.location?.lng || modal?.data?.location?.coordinates?.[0] || "",
        categoryId: modal?.data?.categoryId || "",
        contact: modal?.data?.contact?.length > 0 ? modal?.data?.contact : [{ name: "", number: "" }],
    };

    const handleSubmit = (values) => {
        // Filter out empty contacts
        const filteredContact = values.contact.filter(c => c.name.trim() !== "" && c.number.trim() !== "");
        updatePlace.mutate({ _id: modal?.data?._id, ...values, contact: filteredContact });
    };

    const categories = PLACE_CATEGORIES;

    return (
        <Modal
            title="Update Place"
            className="!rounded-2xl"
            centered
            width={800}
            open={modal.name === "Update" && modal.state}
            onCancel={() => setModal({ name: null, state: false, data: null })}
            footer={null}
        >
            <div className="mb-4 flex justify-end">
                <Button
                    className="reset-button"
                    onClick={() =>
                        formikRef.current?.resetForm({
                            values: initialValues,
                        })
                    }
                >
                    Reset
                </Button>
            </div>

            <Formik
                innerRef={formikRef}
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                    <Form>
                        <div className="bg-gray-100 p-2 rounded max-h-[60vh] overflow-y-auto">
                            {(updatePlace.status === "loading" || categoriesLoading) && <Loading />}

                            {/* Name */}
                            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                                <FormField label="Name" name="name" required />
                            </div>

                            {/* Category */}
                            <div className="grid gap-4 mb-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))] mt-2">
                                <div>
                                    <label className="block text-lg text-black mb-1">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <SelectBox
                                        options={categories.map((cat) => ({
                                            value: cat.value,
                                            label: cat.label
                                        }))}
                                        handleChange={(value) => setFieldValue("categoryId", value)}
                                        value={values.categoryId}
                                        placeholder="Select a category"
                                        showSearch
                                        loading={categoriesLoading}
                                    />
                                    {errors.categoryId && touched.categoryId && (
                                        <div className="text-red-500 text-sm mt-1">{errors.categoryId}</div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="grid gap-4 mt-2 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                                <FormField label="Description" name="description" as="textarea" />
                            </div>

                            {/* Address */}
                            <div className="grid gap-4 mt-2 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                                <FormField label="Address" name="address" required />
                            </div>

                            {/* Google Address */}
                            <div className="grid gap-4 mt-2 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                                <FormField label="Google Address" name="googleAddress" />
                            </div>

                            {/* Location */}
                            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                                <FormField label="Latitude" name="lat" type="number" required />
                                <FormField label="Longitude" name="lng" type="number" required />
                            </div>

                            {/* Contact */}
                            <h3 className="font-semibold mt-4 mb-2 text-lg">Contact <span className="text-red-500">*</span></h3>
                            <FieldArray name="contact">
                                {({ push, remove }) => (
                                    <div className="space-y-2">
                                        {values.contact.map((_, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-wrap gap-2 items-start"
                                            >
                                                <div className="flex-1 min-w-[200px]">
                                                    <Input
                                                        value={values.contact[index].name}
                                                        onChange={(e) =>
                                                            setFieldValue(`contact.${index}.name`, e.target.value)
                                                        }
                                                        placeholder="Name (e.g. Office, Mobile)"
                                                        size="large"
                                                    />
                                                    {errors.contact?.[index]?.name && touched.contact?.[index]?.name && (
                                                        <div className="text-red-500 text-xs mt-1">{errors.contact[index].name}</div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-[200px]">
                                                    <Input
                                                        value={values.contact[index].number}
                                                        onChange={(e) =>
                                                            setFieldValue(`contact.${index}.number`, e.target.value)
                                                        }
                                                        placeholder="Phone number"
                                                        size="large"
                                                    />
                                                    {errors.contact?.[index]?.number && touched.contact?.[index]?.number && (
                                                        <div className="text-red-500 text-xs mt-1">{errors.contact[index].number}</div>
                                                    )}
                                                </div>
                                                {values.contact.length > 1 && (
                                                    <Button
                                                        type="text"
                                                        danger
                                                        onClick={() => remove(index)}
                                                        icon={<FaTrash />}
                                                        className="mt-2"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                        <Button
                                            type="dashed"
                                            onClick={() => push({ name: "", number: "" })}
                                            icon={<FaPlus />}
                                            className="w-full"
                                        >
                                            Add Contact
                                        </Button>
                                    </div>
                                )}
                            </FieldArray>

                            {/* Additional Info */}
                            <h3 className="font-semibold mt-6 mb-2 text-lg">Additional Info</h3>
                            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                                <FormField label="Timing" name="timing" />
                                <FormField label="Services" name="services" />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end mt-4 gap-4">
                            <Button
                                className="modal-cancel-button"
                                onClick={() => setModal({ name: null, state: false, data: null })}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmitting}
                                className="modal-add-button"
                            >
                                Update
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}

export default UpdatePlaceModal;
