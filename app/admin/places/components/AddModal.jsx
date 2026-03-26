"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { Modal, Input } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaMapMarkerAlt, FaPhoneAlt, FaClock, FaTools, FaChevronRight } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_PLACE } from "@/app/api/admin/places";
import { PLACE_CATEGORIES } from "@/config/config";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";

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

// Initial values
const initialValues = {
    name: "",
    description: "",
    address: "",
    timing: "",
    services: "",
    googleAddress: "",
    lat: "",
    lng: "",
    categoryId: "",
    contact: [{ name: "", number: "" }],
    images: [],
};

function AddPlaceModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const createPlace = useMutation({
        mutationKey: ["createPlace"],
        mutationFn: CREATE_PLACE,
        onSuccess: (data) => {
            toast.success(data?.message || "Place added successfully");
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "placesList",
            });
            queryClient.invalidateQueries("placeStatusCounts");
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = (values) => {
        const filteredContact = values.contact.filter(c => c.name.trim() !== "" && c.number.trim() !== "");
        createPlace.mutate({ ...values, contact: filteredContact });
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
                        <FaMapMarkerAlt size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">Add New Place</span>
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
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-2">
                            {createPlace.status === "loading" ? (
                                <FormSkeleton fields={6} />
                            ) : (
                                <>
                                    {/* Section 1: Basic Info */}
                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Location Overview</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="md:col-span-1">
                                                <FormField label="Place Name" name="name" placeholder="Name" required className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" />
                                            </div>
                                            <div className="md:col-span-1">
                                                <div className="flex flex-col gap-1.5 overflow-hidden">
                                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Category <span className="text-red-500">*</span></label>
                                                    <SelectBox
                                                        options={PLACE_CATEGORIES.map((cat) => ({
                                                            value: cat.value,
                                                            label: cat.label
                                                        }))}
                                                        handleChange={(value) => setFieldValue("categoryId", value)}
                                                        value={values.categoryId}
                                                        placeholder="Select Category"
                                                        width="100%"
                                                        className="modern-select-box"
                                                    />
                                                    {errors.categoryId && touched.categoryId && (
                                                        <div className="text-red-500 text-[10px] font-medium ml-1">{errors.categoryId}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <FormField label="Description" name="description" placeholder="Brief description..." type="textarea" className="!h-16 !text-xs !rounded" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Geographic Details */}
                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Geographic Details</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="md:col-span-2">
                                                <FormField label="Physical Address" name="address" placeholder="Full address" required className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <FormField label="Google Map Link" name="googleAddress" placeholder="Maps URL" className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" />
                                            </div>
                                            <FormField label="Latitude" name="lat" type="number" placeholder="0.00" required className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" />
                                            <FormField label="Longitude" name="lng" type="number" placeholder="0.00" required className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" />
                                        </div>
                                    </div>

                                    {/* Section 3: Contacts */}
                                    <div className="modal-section">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Information</p>
                                        </div>

                                        <FieldArray name="contact">
                                            {({ push, remove }) => (
                                                <div className="space-y-2">
                                                    {values.contact.map((_, index) => (
                                                        <div key={index} className="flex gap-2 items-start">
                                                            <div className="flex-1 bg-slate-50 p-1 rounded-md flex gap-2 border border-slate-100">
                                                                <div className="flex-1">
                                                                    <Input
                                                                        value={values.contact[index].name}
                                                                        onChange={(e) => setFieldValue(`contact.${index}.name`, e.target.value)}
                                                                        placeholder="Label"
                                                                        className="!border-none !bg-transparent !shadow-none !h-[28px] !text-xs font-bold text-slate-600"
                                                                    />
                                                                </div>
                                                                <div className="w-[1px] h-4 bg-slate-200 self-center" />
                                                                <div className="flex-[1.5] flex items-center">
                                                                    <Input
                                                                        value={values.contact[index].number}
                                                                        onChange={(e) => setFieldValue(`contact.${index}.number`, e.target.value)}
                                                                        placeholder="Number"
                                                                        className="!border-none !bg-transparent !shadow-none !h-[28px] !text-xs"
                                                                    />
                                                                </div>
                                                            </div>
                                                            {values.contact.length > 1 && (
                                                                <CustomButton
                                                                    type="secondary"
                                                                    onClick={() => remove(index)}
                                                                    icon={<FaTrash size={10} />}
                                                                    className="!h-[30px] !w-[30px] !rounded-md flex items-center justify-center p-0"
                                                                    danger
                                                                />
                                                            )}
                                                        </div>
                                                    ))}

                                                    <CustomButton
                                                        type="secondary"
                                                        onClick={() => push({ name: "", number: "" })}
                                                        icon={<FaPlus size={10} />}
                                                        className="w-full !h-[30px] !rounded-md font-bold text-[10px] uppercase tracking-tight"
                                                        label="Add More Contact"
                                                    />
                                                </div>
                                            )}
                                        </FieldArray>
                                    </div>

                                    {/* Section 4: Operational Data */}
                                    <div className="modal-section !mb-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Operational Data</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <FormField label="Timings" name="timing" placeholder="9:00 AM - 5:00 PM" className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" />
                                            <FormField label="Services" name="services" placeholder="Prayer, Help" className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Modal Footer Actions */}
                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleCloseModal}
                                />
                                <CustomButton
                                    label="Add Place"
                                    htmlType="submit"
                                    loading={createPlace.isLoading || isSubmitting}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default AddPlaceModal;
