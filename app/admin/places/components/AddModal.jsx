"use client";
import React, { useRef, useEffect, useState } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select, Input } from "antd";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { FaPlus, FaTrash } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_PLACE } from "@/app/api/admin/places";
import { CATEGORIES } from "@/app/api/admin/categories";
import { useQueryClient } from "react-query";
import SelectBox from "@/components/SelectBox";

const { Option } = Select;

// Validation schema
const validationSchema = Yup.object().shape({
    name_en: Yup.string().required("Name (English) is required"),
    name_ur: Yup.string().required("Name (Urdu) is required"),
    address_en: Yup.string().required("Address (English) is required"),
    address_ur: Yup.string().required("Address (Urdu) is required"),
    lat: Yup.number().required("Latitude is required").typeError("Must be a number"),
    lng: Yup.number().required("Longitude is required").typeError("Must be a number"),
    categoryId: Yup.string().required("Category is required"),
});

// Initial values
const initialValues = {
    name_en: "",
    name_ur: "",
    description_en: "",
    description_ur: "",
    address_en: "",
    address_ur: "",
    mohala_en: "",
    mohala_ur: "",
    timing_en: "",
    timing_ur: "",
    services_en: "",
    services_ur: "",
    googleAddress: "",
    lat: "",
    lng: "",
    categoryId: "",
    phone: [""],
    images: [],
};

function AddPlaceModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    // Fetch categories for dropdown
    const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
        queryKey: ["categoriesList", { type: "PLACES", itemsPerPage: 100 }],
        queryFn: () => CATEGORIES({ type: "PLACES", itemsPerPage: 100 }),
        enabled: modal?.name === "Add" && modal?.state,
    });

    const createPlace = useMutation({
        mutationKey: ["createPlace"],
        mutationFn: CREATE_PLACE,
        onSuccess: (data) => {
            toast.success(data?.message || "Place added successfully");
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "placesList",
            });
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = (values) => {
        // Filter out empty phone numbers
        const filteredPhone = values.phone.filter(p => p && p.trim() !== "");
        createPlace.mutate({ ...values, phone: filteredPhone });
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

    const categories = categoriesData?.data || [];

    return (
        <Modal
            title="Add Place"
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
                {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                    <Form>
                        <div className="bg-gray-100 p-2 rounded max-h-[60vh] overflow-y-auto">

                            {(createPlace.status === "loading" || categoriesLoading) && <Loading />}

                            {/* Names */}
                            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                                <FormField label="Name (English)" name="name_en" required />
                                <FormField label="Name (Urdu)" name="name_ur" required />
                            </div>

                            {/* Category */}
                            <div className="grid gap-4 mb-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                                <div>
                                    <label className="block text-lg text-black mb-1">
                                        Category <span className="text-red-500">*</span>
                                    </label>

                                    <SelectBox
                                        options={categories.map((cat) => ({
                                            value: cat._id,
                                            label: `${cat.name?.en} - ${cat.name?.ur}`
                                        }))}
                                        handleChange={(value) => setFieldValue("categoryId", value)}
                                        value={values.categoryId}
                                        placeholder="Select a category"
                                        showSearch
                                        loading={categoriesLoading}
                                    />

                                    {errors.categoryId && touched.categoryId && (
                                        <div className="text-red-500 text-sm mt-1">
                                            {errors.categoryId}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Descriptions */}
                            <div className="grid gap-4 mt-2 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                                <FormField label="Description (English)" name="description_en" as="textarea" />
                                <FormField label="Description (Urdu)" name="description_ur" as="textarea" />
                            </div>

                            {/* Address */}
                            <div className="grid gap-4 mt-2 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                                <FormField label="Address (English)" name="address_en" required />
                                <FormField label="Address (Urdu)" name="address_ur" required />
                            </div>

                            {/* Mohala */}
                            <div className="grid gap-4 mt-2 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                                <FormField label="Mohala (English)" name="mohala_en" />
                                <FormField label="Mohala (Urdu)" name="mohala_ur" />
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
                            <h3 className="font-semibold mt-2 mb-2">Contact</h3>
                            <FieldArray name="phone">
                                {({ push, remove }) => (
                                    <div className="space-y-1">
                                        {values.phone.map((phone, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-wrap gap-1 items-center"
                                            >
                                                <Input
                                                    value={phone}
                                                    onChange={(e) =>
                                                        setFieldValue(`phone.${index}`, e.target.value)
                                                    }
                                                    placeholder="Phone number"
                                                    size="large"
                                                    className="min-w-[300px] flex-1"
                                                />

                                                {values.phone.length > 1 && (
                                                    <Button
                                                        type="text"
                                                        danger
                                                        onClick={() => remove(index)}
                                                        icon={<FaTrash />}
                                                    />
                                                )}
                                            </div>
                                        ))}

                                        <Button
                                            type="dashed"
                                            onClick={() => push("")}
                                            icon={<FaPlus />}
                                        >
                                            Add Phone
                                        </Button>
                                    </div>
                                )}
                            </FieldArray>

                            {/* Additional Info */}
                            <h3 className="font-semibold mt-6 mb-2">Additional Info</h3>
                            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
                                <FormField label="Timing (English)" name="timing_en" />
                                <FormField label="Timing (Urdu)" name="timing_ur" />
                                <FormField label="Services (English)" name="services_en" />
                                <FormField label="Services (Urdu)" name="services_ur" />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end mt-4 gap-4">
                            <Button onClick={handleCloseModal} className="modal-cancel-button">
                                Cancel
                            </Button>

                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmitting && createPlace.status !== "error"}
                                className="modal-add-button"
                            >
                                Add
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>

        </Modal>
    );
}

export default AddPlaceModal;
