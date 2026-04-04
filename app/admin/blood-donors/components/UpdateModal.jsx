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
import { ADMIN_KEYS } from "@/constants/queryKeys";

const { Option } = Select;

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    bloodGroup: Yup.string().required("Blood group selection is required"),
    phone: Yup.string().required("Contact phone is required"),
    city: Yup.string().required("Base city is required"),
    address: Yup.string().required("Address is required"),
});

function UpdateDonorModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const updateDonor = useMutation({
        mutationKey: ["updateDonor"],
        mutationFn: (payload) => UPDATE_BLOOD_DONOR(payload),
        onSuccess: (data) => {
            toast.success(data?.message || "Donor profile updated");
            queryClient.invalidateQueries([ADMIN_KEYS.BLOOD_DONORS.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.BLOOD_DONORS.COUNTS]);
            handleCloseModal(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to update donor");
        },
    });

    const initialValues = {
        name: modal?.data?.name || modal?.data?.userId?.name || "",
        bloodGroup: modal?.data?.bloodGroup || "",
        phone: modal?.data?.phone || modal?.data?.userId?.phone || "",
        city: modal?.data?.city || modal?.data?.userId?.city || "",
        village: modal?.data?.village || "",
        address: modal?.data?.address || "",
        lastDonationDate: modal?.data?.lastDonationDate ? modal?.data?.lastDonationDate.split('T')[0] : "",
        available: modal?.data?.available ?? true,
        isDeleted: modal?.data?.isDeleted ?? false
    };

    const handleSubmit = (values) => {
        updateDonor.mutate({ _id: modal?.data?._id, ...values });
    };

    const handleCloseModal = (force = false) => {
        if (!force && formikRef.current?.dirty) {
            Modal.confirm({
                title: "Unsaved Changes",
                content: "You have unsaved changes. Are you sure you want to discard them and exit?",
                okText: "Discard",
                okType: "danger",
                cancelText: "Stay",
                onOk: () => {
                    setModal({ name: null, state: false, data: null });
                },
            });
        } else {
            setModal({ name: null, state: false, data: null });
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-[#006666] dark:text-teal-400 transition-colors duration-300">
                        <FaEdit size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-500 block mt-1 transition-colors duration-300">Edit Donor Profile</span>
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
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">Identity & Vitals</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <FormField label="Full Name" name="name" placeholder="Donor Name" required className="!h-[32px] !text-xs" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" icon={<FaChevronRight className="opacity-20" size={10} />} />

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1 transition-colors duration-300">Blood Group <span className="text-red-500">*</span></label>
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
 
                                            <FormField label="Mobile Number" name="phone" placeholder="Contact number" required className="!h-[32px] !text-xs" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" icon={<FaPhone className="opacity-20" size={10} />} />
                                        </div>
                                    </div>

                                    <div className="modal-section !mb-0">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">Location & Availability</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <FormField label="Primary City" name="city" placeholder="e.g. Lahore" required className="!h-[32px] !text-xs" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" icon={<FaMapMarkerAlt className="opacity-20" size={10} />} />
                                            <FormField label="Village / Local Area" name="village" placeholder="e.g. Model Town" className="!h-[32px] !text-xs" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" icon={<FaChevronRight className="opacity-20" size={10} />} />
                                            <FormField label="Full Address" name="address" placeholder="e.g. Street 1, House 2" required className="!h-[32px] !text-xs md:col-span-2" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" icon={<FaMapMarkerAlt className="opacity-20" size={10} />} />
                                            <FormField label="Last Donation Date" name="lastDonationDate" type="date" className="!h-[32px] !text-xs md:col-span-2" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" icon={<FaChevronRight className="opacity-20" size={10} />} />

                                            <div className="md:col-span-2 p-2.5 bg-slate-50/50 dark:bg-slate-900/30 rounded border border-slate-100 dark:border-slate-800 flex items-center justify-between transition-colors duration-300">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-teal-600 dark:text-teal-400 transition-colors duration-300">
                                                        <FaHeartbeat size={12} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-tight transition-colors duration-300">Current Availability</p>
                                                        <p className="text-[9px] text-slate-500 dark:text-slate-500 font-medium tracking-tight transition-colors duration-300">Show this donor in emergency search results</p>
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

                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 transition-colors">
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
