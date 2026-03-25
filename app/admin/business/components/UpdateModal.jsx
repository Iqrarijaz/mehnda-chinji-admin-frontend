"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal, Select } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaStore, FaMapMarkerAlt, FaPhoneAlt, FaTag, FaCheckCircle } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_BUSINESS } from "@/app/api/admin/business";
import CustomButton from "@/components/shared/CustomButton";

const { Option } = Select;

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Business name is required"),
    categoryEn: Yup.string().required("English category is required"),
    phone: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    status: Yup.string().required("Status is required"),
});

function UpdateBusinessModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: (payload) => UPDATE_BUSINESS(payload),
        onSuccess: (data) => {
            toast.success(data?.message || "Business updated successfully");
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "businessList",
            });
            queryClient.invalidateQueries("businessStatusCounts");
            handleClose();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = (values) => {
        updateMutation.mutate(values);
    };

    const handleClose = () => {
        setModal({ name: null, state: false, data: null });
    };

    const initialValues = {
        _id: modal?.data?._id || "",
        name: modal?.data?.name || "",
        categoryEn: modal?.data?.categoryEn || "",
        categoryUr: modal?.data?.categoryUr || "",
        description: modal?.data?.description || "",
        phone: modal?.data?.phone || "",
        address: modal?.data?.address || "",
        status: modal?.data?.status || "PENDING",
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#006666]">
                        <FaStore size={18} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-900 block">Edit Business</span>
                        <span className="text-xs text-slate-500 font-normal">Modify commercial profile and status</span>
                    </div>
                </div>
            }
            centered
            width={600}
            open={modal?.name === "Update" && modal?.state}
            onCancel={handleClose}
            footer={null}
            className="modern-modal"
        >
            <div className="p-1 mt-4">
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form className="space-y-4">
                            {updateMutation.status === "loading" ? (
                                <FormSkeleton fields={5} />
                            ) : (
                                <>
                                    {/* Status & Identity Section */}
                                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 space-y-4">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Core Information</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-1">
                                                <FormField
                                                    label="Business Name"
                                                    name="name"
                                                    placeholder="Business name"
                                                    required
                                                    className="!h-[36px] !text-xs !rounded-lg"
                                                    labelClassName="!text-xs !font-bold !text-slate-600"
                                                />
                                            </div>
                                            <div className="md:col-span-1">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-slate-600 font-bold text-xs uppercase tracking-tight">Operation Status</label>
                                                    <Select
                                                        value={values.status}
                                                        onChange={(value) => setFieldValue("status", value)}
                                                        className="!h-[36px] !rounded-lg overflow-hidden border-slate-100"
                                                    >
                                                        <Option value="PENDING">Pending Approval</Option>
                                                        <Option value="ACTIVE">Active / Verified</Option>
                                                        <Option value="REJECTED">Rejected</Option>
                                                        <Option value="SUSPENDED">Suspended</Option>
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Section */}
                                    <div className="p-4 rounded-xl border border-slate-100 space-y-4">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Categorization & Contact</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                label="Category (English)"
                                                name="categoryEn"
                                                placeholder="Category"
                                                required
                                                className="!h-[36px] !text-xs !rounded-lg"
                                                labelClassName="!text-xs !font-bold !text-slate-600"
                                                icon={<FaTag className="opacity-20 text-[10px]" />}
                                            />
                                            <FormField
                                                label="Category (Urdu)"
                                                name="categoryUr"
                                                placeholder="Category"
                                                className="!h-[36px] !text-xs !rounded-lg font-notoUrdu"
                                                labelClassName="!text-xs !font-bold !text-slate-600"
                                                icon={<FaTag className="opacity-20 text-[10px]" />}
                                            />
                                            <FormField
                                                label="Primary Phone"
                                                name="phone"
                                                placeholder="Phone number"
                                                required
                                                className="!h-[36px] !text-xs !rounded-lg"
                                                labelClassName="!text-xs !font-bold !text-slate-600"
                                                icon={<FaPhoneAlt className="opacity-20 text-[10px]" />}
                                            />
                                            <FormField
                                                label="Physical Address"
                                                name="address"
                                                placeholder="Address"
                                                required
                                                className="!h-[36px] !text-xs !rounded-lg"
                                                labelClassName="!text-xs !font-bold !text-slate-600"
                                                icon={<FaMapMarkerAlt className="opacity-20 text-[10px]" />}
                                            />
                                        </div>
                                    </div>

                                    {/* Description Section */}
                                    <div className="px-1">
                                        <FormField
                                            label="Business Details"
                                            name="description"
                                            placeholder="About the business..."
                                            type="textarea"
                                            className="!text-xs !rounded-lg"
                                            labelClassName="!text-xs !font-bold !text-slate-600"
                                            autoSize={{ minRows: 2, maxRows: 4 }}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Modal Footer Actions */}
                            <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleClose}
                                />
                                <CustomButton
                                    label="Save Changes"
                                    htmlType="submit"
                                    loading={updateMutation.isLoading || isSubmitting}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default UpdateBusinessModal;
