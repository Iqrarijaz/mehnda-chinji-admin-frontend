"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal, Select, Switch } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaHeartbeat, FaUser, FaPhone, FaMapMarkerAlt, FaIdCard, FaTint, FaChevronRight, FaEdit } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_BLOOD_DONOR } from "@/app/api/admin/blood-donors";
import CustomButton from "@/components/shared/CustomButton";
import SelectBox from "@/components/SelectBox";
import { BLOOD_GROUPS } from "@/config/config";

const { Option } = Select;

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
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                        <FaEdit size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">Edit Donor Profile</span>
                    </div>
                </div>
            }
            centered
            width={600}
            open={modal.name === "Update" && modal.state}
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
                        <Form className="space-y-2">
                            {updateDonor.isLoading ? (
                                <FormSkeleton fields={5} />
                            ) : (
                                <>
                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Identity & Vitals</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <FormField label="Full Name" name="name" placeholder="Donor Name" required className="!h-[32px] !text-xs" icon={<FaChevronRight className="opacity-20" size={10} />} />

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-slate-700 font-semibold text-xs">Blood Group <span className="text-red-500">*</span></label>
                                                 <Select
                                                    value={values.bloodGroup}
                                                    onChange={(val) => setFieldValue("bloodGroup", val)}
                                                    size="middle"
                                                    className="w-full modern-select-box"
                                                >
                                                    {BLOOD_GROUPS.map(bg => (
                                                        <Select.Option key={bg} value={bg}>
                                                            <div className="flex items-center gap-2">
                                                                <FaTint className="text-red-500" size={10} />
                                                                <span className="font-bold text-xs">{bg}</span>
                                                            </div>
                                                        </Select.Option>
                                                    ))}
                                                </Select>
                                                {errors.bloodGroup && touched.bloodGroup && <div className="text-red-500 text-[10px] font-medium">{errors.bloodGroup}</div>}
                                            </div>
 
                                            <FormField label="Mobile Number" name="phone" placeholder="Contact number" required className="!h-[32px] !text-xs" icon={<FaPhone className="opacity-20" size={10} />} />
                                        </div>
                                    </div>

                                    <div className="modal-section !mb-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Location & Availability</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <FormField label="Primary City" name="city" placeholder="e.g. Lahore" required className="!h-[32px] !text-xs" icon={<FaMapMarkerAlt className="opacity-20" size={10} />} />
                                            <FormField label="Village / Local Area" name="village" placeholder="e.g. Model Town" className="!h-[32px] !text-xs" icon={<FaChevronRight className="opacity-20" size={10} />} />

                                            <div className="md:col-span-2 p-2.5 bg-slate-50/50 rounded-lg border border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-md bg-teal-50 flex items-center justify-center text-teal-600">
                                                        <FaHeartbeat size={12} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-bold text-slate-700 leading-tight">Current Availability</p>
                                                        <p className="text-[9px] text-slate-500 font-medium tracking-tight">Show this donor in emergency search results</p>
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

                             <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                                <CustomButton
                                  label="Cancel"
                                  type="secondary"
                                  onClick={handleCloseModal}
                                />
                                <CustomButton
                                  label="Update Donor"
                                  htmlType="submit"
                                  loading={updateDonor.isLoading || isSubmitting}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default UpdateDonorModal;
