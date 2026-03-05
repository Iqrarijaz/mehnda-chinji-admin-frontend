"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaStore, FaMapMarkerAlt, FaPhoneAlt, FaTag, FaCheckCircle } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_BUSINESS } from "@/app/api/admin/business";

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
                <div className="flex items-center gap-3 px-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaStore size={18} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 block">Edit Business</span>
                        <span className="text-xs text-slate-500 font-normal">Modify commercial profile and status</span>
                    </div>
                </div>
            }
            centered
            width={720}
            open={modal?.name === "Update" && modal?.state}
            onCancel={handleClose}
            footer={null}
            className="modern-modal"
        >
            <div className="p-2 pt-4">
                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form className="space-y-6">
                            {updateMutation.status === "loading" && <Loading />}

                            {/* Status & Identity Section */}
                            <div className="modal-section">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Core Information</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-1">
                                        <FormField label="Business Name" name="name" placeholder="Business name" required />
                                    </div>
                                    <div className="md:col-span-1">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 font-semibold text-sm">Operation Status</label>
                                            <Select
                                                value={values.status}
                                                onChange={(value) => setFieldValue("status", value)}
                                                className="!h-[44px] !rounded-xl overflow-hidden border-2 border-slate-100"
                                                size="large"
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
                            <div className="modal-section">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Categorization & Contact</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormField label="Category (English)" name="categoryEn" placeholder="Category" required icon={<FaTag className="opacity-30" />} />
                                    <FormField label="Category (Urdu)" name="categoryUr" placeholder="Category" icon={<FaTag className="opacity-30" />} />
                                    <FormField label="Primary Phone" name="phone" placeholder="Phone number" required icon={<FaPhoneAlt className="opacity-30" />} />
                                    <FormField label="Physical Address" name="address" placeholder="Address" required icon={<FaMapMarkerAlt className="opacity-30" />} />
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="modal-section !mb-0">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Description</p>
                                <FormField label="Business Details" name="description" placeholder="About the business..." type="textarea" />
                            </div>

                            {/* Modal Footer Actions */}
                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                                <Button
                                    onClick={handleClose}
                                    className="modal-footer-btn-secondary"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={updateMutation.isLoading || isSubmitting}
                                    className="modal-footer-btn-primary"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default UpdateBusinessModal;
