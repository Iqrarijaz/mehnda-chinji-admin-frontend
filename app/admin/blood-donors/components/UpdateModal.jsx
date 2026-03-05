"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select, Switch } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaUserEdit, FaTint, FaPhone, FaMapMarkerAlt, FaHeartbeat, FaChevronRight } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_BLOOD_DONOR } from "@/app/api/admin/blood-donors";

const { Option } = Select;

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    bloodGroup: Yup.string().required("Blood group selection is required"),
    phone: Yup.string().required("Contact phone is required"),
    city: Yup.string().required("Base city is required"),
});

function UpdateDonorModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const updateDonor = useMutation({
        mutationKey: ["updateDonor"],
        mutationFn: (payload) => UPDATE_BLOOD_DONOR(payload),
        onSuccess: (data) => {
            toast.success(data?.message || "Donor profile updated");
            queryClient.invalidateQueries("bloodDonorsList");
            queryClient.invalidateQueries("bloodDonorsStatusCounts");
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update donor");
        },
    });

    const initialValues = {
        name: modal?.data?.name || "",
        bloodGroup: modal?.data?.bloodGroup || "",
        phone: modal?.data?.phone || "",
        city: modal?.data?.city || "",
        village: modal?.data?.village || "",
        available: modal?.data?.available ?? true
    };

    const handleSubmit = (values) => {
        updateDonor.mutate({ _id: modal?.data?._id, ...values });
    };

    const handleCloseModal = () => {
        setModal({ name: null, state: false, data: null });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 px-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaUserEdit size={18} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 block">Edit Donor Profile</span>
                        <span className="text-xs text-slate-500 font-normal">Modify volunteer vitals and contact info</span>
                    </div>
                </div>
            }
            centered
            width={640}
            open={modal.name === "Update" && modal.state}
            onCancel={handleCloseModal}
            footer={null}
            className="modern-modal"
        >
            <div className="p-2 pt-4">
                <Formik
                    enableReinitialize
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-6">
                            {updateDonor.status === "loading" && <Loading />}

                            <div className="modal-section">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Identity & Vitals</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormField label="Full Name" name="name" placeholder="Donor Name" required icon={<FaChevronRight className="opacity-20 translate-y-0.5" />} />

                                    <div className="flex flex-col gap-2">
                                        <label className="text-slate-700 font-semibold text-sm">Blood Group <span className="text-red-500">*</span></label>
                                        <Select
                                            value={values.bloodGroup}
                                            onChange={(val) => setFieldValue("bloodGroup", val)}
                                            size="large"
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
                                                <FaHeartbeat size={14} />
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
                                    loading={isSubmitting || updateDonor.isLoading}
                                    className="modal-footer-btn-primary flex-1"
                                >
                                    Update Profile
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default UpdateDonorModal;
