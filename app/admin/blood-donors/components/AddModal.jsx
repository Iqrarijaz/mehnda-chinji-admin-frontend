"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal, Select, Switch } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaHeartbeat, FaUser, FaPhone, FaMapMarkerAlt, FaIdCard, FaTint, FaChevronRight } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_BLOOD_DONOR } from "@/app/api/admin/blood-donors";
import CustomButton from "@/components/shared/CustomButton";
import { BLOOD_GROUPS } from "@/config/config";

const { Option } = Select;

// Validation schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    bloodGroup: Yup.string().required("Blood group selection is required"),
    phone: Yup.string().required("Contact phone is required"),
    city: Yup.string().required("Base city is required"),
    userId: Yup.string().required("Linked user ID is required"),
});

// Initial values
const initialValues = {
    name: "",
    bloodGroup: "",
    phone: "",
    city: "",
    village: "",
    userId: "",
    available: true
};

function AddDonorModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const createDonor = useMutation({
        mutationKey: ["createDonor"],
        mutationFn: CREATE_BLOOD_DONOR,
        onSuccess: (data) => {
            toast.success(data?.message || "Blood donor profile registered");
            queryClient.invalidateQueries("bloodDonorsList");
            queryClient.invalidateQueries("bloodDonorsStatusCounts");
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to register donor");
        },
    });

    const handleSubmit = (values) => {
        createDonor.mutate(values);
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
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                        <FaHeartbeat size={18} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-900 block">Register Blood Donor</span>
                        <span className="text-xs text-slate-500 font-normal">Add a new life-saving volunteer</span>
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
                    {({ isSubmitting, values, setFieldValue, errors, touched, handleChange, handleBlur }) => (
                        <Form className="space-y-4">
                            {createDonor.isLoading ? (
                                <FormSkeleton fields={6} />
                            ) : (
                                <>
                                    <div className="modal-section bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Identity & Vitals</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <FormField label="Full Name" name="name" placeholder="Donor Name" required className="!h-[36px] !text-sm" icon={<FaUser className="opacity-20" size={12} />} />
                                            <FormField label="Linked User Account" name="userId" placeholder="User ID (Hex)" required className="!h-[36px] !text-sm" icon={<FaIdCard className="opacity-20" size={12} />} />

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-slate-700 font-semibold text-xs">Blood Group <span className="text-red-500">*</span></label>
                                                <Select
                                                    value={values.bloodGroup}
                                                    onChange={(val) => setFieldValue("bloodGroup", val)}
                                                    size="middle"
                                                    placeholder="Select Type"
                                                    className="!h-[36px] !rounded-lg overflow-hidden border-2 border-slate-100 shadow-sm [&>div]:!shadow-none [&>div]:!border-none"
                                                >
                                                    {BLOOD_GROUPS.map(bg => (
                                                        <Option key={bg} value={bg}>
                                                            <div className="flex items-center gap-2">
                                                                <FaTint className="text-red-500" size={10} />
                                                                <span className="font-bold text-xs">{bg}</span>
                                                            </div>
                                                        </Option>
                                                    ))}
                                                </Select>
                                                {errors.bloodGroup && touched.bloodGroup && <div className="text-red-500 text-[10px] font-medium">{errors.bloodGroup}</div>}
                                            </div>

                                            <FormField label="Mobile Number" name="phone" placeholder="Contact number" required className="!h-[36px] !text-sm" icon={<FaPhone className="opacity-20" size={12} />} />
                                        </div>
                                    </div>

                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Location & Availability</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <FormField label="Primary City" name="city" placeholder="e.g. Lahore" required className="!h-[36px] !text-sm" icon={<FaMapMarkerAlt className="opacity-20" size={12} />} />
                                            <FormField label="Village / Local Area" name="village" placeholder="e.g. Model Town" className="!h-[36px] !text-sm" icon={<FaChevronRight className="opacity-20" size={12} />} />

                                            <div className="md:col-span-2 p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                                                        <FaHeartbeat size={14} />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700 leading-tight">Current Availability</p>
                                                        <p className="text-[10px] text-slate-500 font-medium tracking-tight">Show this donor in emergency search results</p>
                                                    </div>
                                                </div>
                                                <Switch
                                                    checked={values.available}
                                                    onChange={(val) => setFieldValue("available", val)}
                                                    className={values.available ? "!bg-[#006666]" : "!bg-slate-300"}
                                                    size="small"
                                                />
                                            </div>
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
                                    label="Register Donor"
                                    htmlType="submit"
                                    loading={createDonor.isLoading || isSubmitting}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

// Helper icons not imported
const FaCheckCircle = (props) => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height={props.size} width={props.size} xmlns="http://www.w3.org/2000/svg">
        <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path>
    </svg>
);

export default AddDonorModal;
