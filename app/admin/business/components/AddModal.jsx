"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaStore, FaMapMarkerAlt, FaPhoneAlt, FaTag } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_BUSINESS } from "@/app/api/admin/business";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Business name is required"),
    userId: Yup.string().required("Owner User ID is required"),
    categoryEn: Yup.string().required("English category is required"),
    phone: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
});

const initialValues = {
    name: "",
    userId: "",
    categoryEn: "",
    categoryUr: "",
    description: "",
    phone: "",
    address: "",
};

function AddBusinessModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: CREATE_BUSINESS,
        onSuccess: (data) => {
            toast.success(data?.message || "Business created successfully");
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
        createMutation.mutate(values);
    };

    const handleClose = () => {
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
                        <FaStore size={18} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 block">Register Business</span>
                        <span className="text-xs text-slate-500 font-normal">Add a new commercial entity to the platform</span>
                    </div>
                </div>
            }
            centered
            width={720}
            open={modal?.name === "Add" && modal?.state}
            onCancel={handleClose}
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
                    {({ isSubmitting }) => (
                        <Form className="space-y-6">
                            {createMutation.status === "loading" && <Loading />}

                            {/* Basic Info Section */}
                            <div className="modal-section">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Identity & Ownership</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="md:col-span-2">
                                        <FormField label="Business Name" name="name" placeholder="e.g. Al-Falah General Store" required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <FormField label="Owner User ID" name="userId" placeholder="MongoDB ObjectId of the user" required />
                                    </div>
                                </div>
                            </div>

                            {/* Details Section */}
                            <div className="modal-section">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Categorization & Contact</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <FormField label="Category (English)" name="categoryEn" placeholder="e.g. Retail" required icon={<FaTag className="opacity-30" />} />
                                    <FormField label="Category (Urdu)" name="categoryUr" placeholder="e.g. ریٹیل" icon={<FaTag className="opacity-30" />} />
                                    <FormField label="Contact Phone" name="phone" placeholder="+92 300 1234567" required icon={<FaPhoneAlt className="opacity-30" />} />
                                    <FormField label="Business Address" name="address" placeholder="123 Street, City" required icon={<FaMapMarkerAlt className="opacity-30" />} />
                                </div>
                            </div>

                            {/* Description Section */}
                            <div className="modal-section !mb-0">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Additional Information</p>
                                <FormField label="Description" name="description" placeholder="Brief about what this business does..." type="textarea" />
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
                                    loading={createMutation.isLoading || isSubmitting}
                                    className="modal-footer-btn-primary"
                                >
                                    Create Business
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default AddBusinessModal;
