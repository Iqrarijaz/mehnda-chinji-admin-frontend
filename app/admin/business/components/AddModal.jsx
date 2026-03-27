"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaStore, FaMapMarkerAlt, FaPhoneAlt, FaTag } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_BUSINESS } from "@/app/api/admin/business";
import CustomButton from "@/components/shared/CustomButton";

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
    isDeleted: false,
};

function AddBusinessModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const createBusiness = useMutation({
        mutationFn: CREATE_BUSINESS,
        onSuccess: (data) => {
            toast.success(data?.message || "Business created successfully");
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "businessList",
            });
            queryClient.invalidateQueries("businessStatusCounts");
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = (values) => {
        createBusiness.mutate(values);
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
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                        <FaStore size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">Register Business</span>
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
                    {({ isSubmitting }) => (
                        <Form className="space-y-3">
                            {createBusiness.status === "loading" ? (
                                <FormSkeleton fields={5} />
                            ) : (
                                <>
                                    {/* Basic Info Section */}
                                    <div className="bg-slate-50/50 p-3 rounded border border-slate-100/50 space-y-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Identity & Ownership</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="md:col-span-2">
                                                <FormField
                                                    label="Business Name"
                                                    name="name"
                                                    placeholder="Name"
                                                    required
                                                    className="!h-[32px] !text-xs !rounded"
                                                    labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <FormField
                                                    label="Owner User ID"
                                                    name="userId"
                                                    placeholder="User ID"
                                                    required
                                                    className="!h-[32px] !text-xs !rounded"
                                                    labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details Section */}
                                    <div className="p-3 rounded border border-slate-100 space-y-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Categorization & Contact</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <FormField
                                                label="Category (EN)"
                                                name="categoryEn"
                                                placeholder="Retail"
                                                required
                                                className="!h-[32px] !text-xs !rounded"
                                                labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                                            />
                                            <FormField
                                                label="Category (UR)"
                                                name="categoryUr"
                                                placeholder="ریٹیل"
                                                className="!h-[32px] !text-xs !rounded font-notoUrdu text-right"
                                                labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                                            />
                                            <FormField
                                                label="Phone"
                                                name="phone"
                                                placeholder="+92..."
                                                required
                                                className="!h-[32px] !text-xs !rounded"
                                                labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                                            />
                                            <FormField
                                                label="Address"
                                                name="address"
                                                placeholder="Full Address"
                                                required
                                                className="!h-[32px] !text-xs !rounded"
                                                labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Description Section */}
                                    <div className="px-1 mt-1">
                                        <FormField
                                            label="Description"
                                            name="description"
                                            placeholder="Brief description..."
                                            type="textarea"
                                            className="!text-xs !rounded !h-16"
                                            labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Modal Footer Actions */}
                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleCloseModal}
                                />
                                <CustomButton
                                    label="Register Business"
                                    htmlType="submit"
                                    loading={createBusiness.isLoading || isSubmitting}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default AddBusinessModal;
