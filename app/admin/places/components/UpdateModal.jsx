import React, { useRef } from "react";
import { Modal, Select, Input } from "antd";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaMapMarkerAlt, FaPhoneAlt, FaClock, FaTools, FaChevronRight, FaCheckCircle } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_PLACE } from "@/app/api/admin/places";
import { PLACE_CATEGORIES } from "@/config/config";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";

const { Option } = Select;

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    address: Yup.string().required("Address is required"),
    lat: Yup.number().required("Latitude is required").typeError("Must be a number"),
    lng: Yup.number().required("Longitude is required").typeError("Must be a number"),
    categoryId: Yup.string().required("Category is required"),
    status: Yup.string().required("Status is required"),
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

    const updatePlace = useMutation({
        mutationKey: ["updatePlace"],
        mutationFn: (payload) => UPDATE_PLACE(payload),
        onSuccess: (data) => {
            toast.success(data?.message || "Place updated successfully");
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
        updatePlace.mutate({ _id: modal.data._id, ...values, contact: filteredContact });
    };

    const handleCloseModal = () => {
        setModal({ name: null, state: false, data: null });
    };

    const initialValues = {
        name: modal?.data?.name || "",
        description: modal?.data?.description || "",
        address: modal?.data?.address || "",
        timing: modal?.data?.timing || "",
        services: modal?.data?.services || "",
        googleAddress: modal?.data?.googleAddress || "",
        lat: modal?.data?.lat || "",
        lng: modal?.data?.lng || "",
        categoryId: modal?.data?.categoryId?._id || modal?.data?.categoryId || "",
        status: modal?.data?.status || "PENDING",
        contact: modal?.data?.contact?.length > 0 ? modal.data.contact : [{ name: "", number: "" }],
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaMapMarkerAlt size={18} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-900 block">Edit Place</span>
                        <span className="text-xs text-slate-500 font-normal">Update location details and operational status</span>
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
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-4">
                            {updatePlace.status === "loading" ? (
                                <FormSkeleton fields={6} />
                            ) : (
                                <>
                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Core Identification</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="md:col-span-1">
                                                <FormField label="Place Name" name="name" placeholder="Name" required className="!h-[36px] !text-sm" />
                                            </div>
                                            <div className="md:col-span-1">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-slate-700 font-semibold text-xs">Status <span className="text-red-500">*</span></label>
                                                    <SelectBox
                                                        value={values.status}
                                                        handleChange={(value) => setFieldValue("status", value)}
                                                        options={[
                                                            { value: "PENDING", label: "Pending Approval" },
                                                            { value: "ACTIVE", label: "Active / Verified" },
                                                            { value: "REJECTED", label: "Rejected" },
                                                            { value: "INACTIVE", label: "Inactive" }
                                                        ]}
                                                        className="modern-select-box [&>div]:!h-[36px] [&>div]:!rounded-lg [&>div]:!text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-slate-700 font-semibold text-xs">Category <span className="text-red-500">*</span></label>
                                                    <SelectBox
                                                        options={PLACE_CATEGORIES.map((cat) => ({
                                                            value: cat.value,
                                                            label: cat.label
                                                        }))}
                                                        handleChange={(value) => setFieldValue("categoryId", value)}
                                                        value={values.categoryId}
                                                        placeholder="Select category"
                                                        width="100%"
                                                        className="modern-select-box [&>div]:!h-[36px] [&>div]:!rounded-lg [&>div]:!text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <FormField label="Description" name="description" placeholder="Short description..." type="textarea" className="!h-20 !text-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Location Details</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="md:col-span-2">
                                                <FormField label="Full Address" name="address" required icon={<FaChevronRight className="opacity-20 translate-y-0.5" />} className="!h-[36px] !text-sm" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <FormField label="Google Maps Link" name="googleAddress" icon={<FaMapMarkerAlt className="opacity-30" />} className="!h-[36px] !text-sm" />
                                            </div>
                                            <FormField label="Latitude" name="lat" type="number" required className="!h-[36px] !text-sm" />
                                            <FormField label="Longitude" name="lng" type="number" required className="!h-[36px] !text-sm" />
                                        </div>
                                    </div>

                                    <div className="modal-section">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Manage Contacts</p>
                                        </div>
                                        <FieldArray name="contact">
                                            {({ push, remove }) => (
                                                <div className="space-y-2">
                                                    {values.contact.map((_, index) => (
                                                        <div key={index} className="flex gap-2 items-start">
                                                            <div className="flex-1 bg-slate-50 p-1.5 rounded-lg flex gap-2 border border-slate-100">
                                                                <div className="flex-1">
                                                                    <Input
                                                                        value={values.contact[index].name}
                                                                        onChange={(e) => setFieldValue(`contact.${index}.name`, e.target.value)}
                                                                        placeholder="Label"
                                                                        className="!border-none !bg-transparent !shadow-none !h-[32px] !text-sm font-semibold"
                                                                    />
                                                                </div>
                                                                <div className="w-[1px] h-5 bg-slate-200 self-center" />
                                                                <div className="flex-[1.5] flex items-center">
                                                                    <FaPhoneAlt size={10} className="text-slate-300 mx-1.5" />
                                                                    <Input
                                                                        value={values.contact[index].number}
                                                                        onChange={(e) => setFieldValue(`contact.${index}.number`, e.target.value)}
                                                                        placeholder="Number"
                                                                        className="!border-none !bg-transparent !shadow-none !h-[32px] !text-sm"
                                                                    />
                                                                </div>
                                                            </div>
                                                            {values.contact.length > 1 && (
                                                                <Button
                                                                    type="text"
                                                                    danger
                                                                    onClick={() => remove(index)}
                                                                    icon={<FaTrash size={12} />}
                                                                    className="!h-[46px] !w-[46px] !rounded-lg bg-red-50/50 hover:bg-red-50 flex items-center justify-center p-0"
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                    <Button
                                                        type="dashed"
                                                        onClick={() => push({ name: "", number: "" })}
                                                        icon={<FaPlus size={10} />}
                                                        className="w-full !h-[36px] !rounded-lg !border-2 !border-dashed !border-slate-200 !text-slate-400 hover:!text-teal-600 hover:!border-teal-200 font-bold transition-all text-sm"
                                                    >
                                                        Add Another Contact
                                                    </Button>
                                                </div>
                                            )}
                                        </FieldArray>
                                    </div>

                                    <div className="modal-section !mb-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Other Information</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <FormField label="Timings" name="timing" icon={<FaClock className="opacity-30" size={10} />} className="!h-[36px] !text-sm" />
                                            <FormField label="Services" name="services" icon={<FaTools className="opacity-30" size={10} />} className="!h-[36px] !text-sm" />
                                        </div>
                                    </div>
                                </>
                            )}

                             <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleCloseModal}
                                />
                                <CustomButton
                                    label="Update Place"
                                    htmlType="submit"
                                    loading={updatePlace.isLoading || isSubmitting}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default UpdatePlaceModal;
