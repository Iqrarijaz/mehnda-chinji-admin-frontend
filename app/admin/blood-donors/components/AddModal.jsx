"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select, Switch } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaHeartbeat, FaUser, FaPhone, FaMapMarkerAlt, FaIdCard, FaTint, FaChevronRight } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_BLOOD_DONOR } from "@/app/api/admin/blood-donors";

const { Option } = Select;

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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
                <div className="flex items-center gap-3 px-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
                        <FaHeartbeat size={18} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 block">Register Blood Donor</span>
                        <span className="text-xs text-slate-500 font-normal">Add a new life-saving volunteer</span>
                    </div>
                </div>
            }
            centered
            width={640}
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
                    {({ isSubmitting, values, setFieldValue, errors, touched, handleChange, handleBlur }) => (
                        <Form className="space-y-6">
                            {createDonor.status === "loading" && <Loading />}

                            <div className="modal-section">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Identity & Vitals</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormField label="Full Name" name="name" placeholder="Donor Name" required icon={<FaUser className="opacity-20" />} />
                                    <FormField label="Linked User Account" name="userId" placeholder="User ID (Hex)" required icon={<FaIdCard className="opacity-20" />} />

                                    <div className="flex flex-col gap-2">
                                        <label className="text-slate-700 font-semibold text-sm">Blood Group <span className="text-red-500">*</span></label>
                                        <Select
                                            value={values.bloodGroup}
                                            onChange={(val) => setFieldValue("bloodGroup", val)}
                                            size="large"
                                            placeholder="Select Type"
                                            className="!h-[44px] !rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm"
                                        >
                                            {bloodGroups.map(bg => (
                                                <Option key={bg} value={bg}>
                                                    <div className="flex items-center gap-2">
                                                        <FaTint className="text-red-500" size={12} />
                                                        <span className="font-bold">{bg}</span>
                                                    </div>
                                                </Option>
                                            ))}
                                        </Select>
                                        {errors.bloodGroup && touched.bloodGroup && <div className="text-red-500 text-xs font-medium">{errors.bloodGroup}</div>}
                                    </div>

                                    <FormField label="Mobile Number" name="phone" placeholder="Contact number" required icon={<FaPhone className="opacity-20" />} />
                                </div>
                            </div>

                            <div className="modal-section">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Location & Availability</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormField label="Primary City" name="city" placeholder="e.g. Lahore" required icon={<FaMapMarkerAlt className="opacity-20" />} />
                                    <FormField label="Village / Local Area" name="village" placeholder="e.g. Model Town" icon={<FaChevronRight className="opacity-20 translate-y-0.5" />} />

                                    <div className="md:col-span-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                                                <FaCheckCircle size={14} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-700 leading-tight">Current Availability</p>
                                                <p className="text-[10px] text-slate-500 font-medium tracking-tight">Show this donor in emergency search results</p>
                                            </div>
                                        </div>
                                        <Switch
                                            checked={values.available}
                                            onChange={(val) => setFieldValue("available", val)}
                                            className={values.available ? "!bg-teal-500" : "!bg-slate-300"}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                                <Button
                                    onClick={handleCloseModal}
                                    className="modal-footer-btn-secondary flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmitting || createDonor.isLoading}
                                    className="modal-footer-btn-primary flex-1"
                                >
                                    Register Donor
                                </Button>
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
