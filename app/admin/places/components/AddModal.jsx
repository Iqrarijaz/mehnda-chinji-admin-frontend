"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { Button, Modal, Input } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaMapMarkerAlt, FaAddressCard, FaPhoneAlt, FaClock, FaTools, FaChevronRight } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_PLACE } from "@/app/api/admin/places";
import { PLACE_CATEGORIES } from "@/config/config";
import SelectBox from "@/components/SelectBox";

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
                <div className="flex items-center gap-3 px-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaMapMarkerAlt size={18} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 block">Add New Place</span>
                        <span className="text-xs text-slate-500 font-normal">Create a new location or point of interest</span>
                    </div>
                </div>
            }
            centered
            width={780}
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
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-6">
                            {createPlace.status === "loading" ? (
                                <FormSkeleton fields={8} />
                            ) : (
                                <>
                                    {/* Section 1: Basic Info */}
                                    <div className="modal-section">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Location Overview</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="md:col-span-1">
                                                <FormField label="Place Name" name="name" placeholder="e.g. Masjid Al-Noor" required />
                                            </div>
                                            <div className="md:col-span-1">
                                                <div className="flex flex-col gap-2">
                                                    <label className="text-slate-700 font-semibold text-sm">Category <span className="text-red-500">*</span></label>
                                                    <SelectBox
                                                        options={PLACE_CATEGORIES.map((cat) => ({
                                                            value: cat.value,
                                                            label: cat.label
                                                        }))}
                                                        handleChange={(value) => setFieldValue("categoryId", value)}
                                                        value={values.categoryId}
                                                        placeholder="Select a category"
                                                        width="100%"
                                                        className="modern-select-box"
                                                    />
                                                    {errors.categoryId && touched.categoryId && (
                                                        <div className="text-red-500 text-xs font-medium">{errors.categoryId}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <FormField label="Description" name="description" placeholder="Provide a brief description of the place..." type="textarea" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Geographic Details */}
                                    <div className="modal-section">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Geographic Details</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="md:col-span-2">
                                                <FormField label="Physical Address" name="address" placeholder="Full address" required icon={<FaChevronRight className="opacity-20 translate-y-0.5" />} />
                                            </div>
                                            <div className="md:col-span-2">
                                                <FormField label="Google Map Link / Location" name="googleAddress" placeholder="Link to Google Maps location" icon={<FaMapMarkerAlt className="opacity-30" />} />
                                            </div>
                                            <FormField label="Latitude" name="lat" type="number" placeholder="0.000000" required />
                                            <FormField label="Longitude" name="lng" type="number" placeholder="0.000000" required />
                                        </div>
                                    </div>

                                    {/* Section 3: Contacts (Dynamic FieldArray) */}
                                    <div className="modal-section">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contact Information</p>
                                            <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">At least one required</span>
                                        </div>

                                        <FieldArray name="contact">
                                            {({ push, remove }) => (
                                                <div className="space-y-3">
                                                    {values.contact.map((_, index) => (
                                                        <div key={index} className="flex gap-3 items-start animate-in fade-in slide-in-from-top-2 duration-300">
                                                            <div className="flex-1 bg-slate-50 p-2 rounded-xl flex gap-3 border border-slate-100 shadow-sm">
                                                                <div className="flex-1">
                                                                    <Input
                                                                        value={values.contact[index].name}
                                                                        onChange={(e) => setFieldValue(`contact.${index}.name`, e.target.value)}
                                                                        placeholder="Label (e.g. Office)"
                                                                        className="!border-none !bg-transparent !shadow-none !h-[40px] font-semibold"
                                                                    />
                                                                </div>
                                                                <div className="w-[1px] h-6 bg-slate-200 self-center" />
                                                                <div className="flex-[1.5] flex items-center">
                                                                    <FaPhoneAlt size={12} className="text-slate-300 mx-2" />
                                                                    <Input
                                                                        value={values.contact[index].number}
                                                                        onChange={(e) => setFieldValue(`contact.${index}.number`, e.target.value)}
                                                                        placeholder="Number"
                                                                        className="!border-none !bg-transparent !shadow-none !h-[40px]"
                                                                    />
                                                                </div>
                                                            </div>
                                                            {values.contact.length > 1 && (
                                                                <Button
                                                                    type="text"
                                                                    danger
                                                                    onClick={() => remove(index)}
                                                                    icon={<FaTrash size={14} />}
                                                                    className="!h-[56px] !w-[56px] !rounded-xl bg-red-50/50 hover:bg-red-50 flex items-center justify-center"
                                                                />
                                                            )}
                                                        </div>
                                                    ))}

                                                    <Button
                                                        type="dashed"
                                                        onClick={() => push({ name: "", number: "" })}
                                                        icon={<FaPlus size={12} />}
                                                        className="w-full !h-[50px] !rounded-xl !border-2 !border-dashed !border-slate-200 !text-slate-400 hover:!text-teal-600 hover:!border-teal-200 font-bold transition-all"
                                                    >
                                                        Add Another Contact
                                                    </Button>
                                                </div>
                                            )}
                                        </FieldArray>
                                    </div>

                                    {/* Section 4: Operational Data */}
                                    <div className="modal-section !mb-0">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Operational Data</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormField label="Operational Timings" name="timing" placeholder="e.g. 9:00 AM - 5:00 PM" icon={<FaClock className="opacity-30" />} />
                                            <FormField label="Offered Services" name="services" placeholder="e.g. Prayer, Education" icon={<FaTools className="opacity-30" />} />
                                        </div>
                                    </div>
                                </>
                            )}

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
                                    loading={createPlace.isLoading || isSubmitting}
                                    className="modal-footer-btn-primary"
                                >
                                    Register Place
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default AddPlaceModal;
