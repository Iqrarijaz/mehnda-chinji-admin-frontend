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
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#006666]">
                        <FaStore size={18} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-900 block">Register Business</span>
                        <span className="text-xs text-slate-500 font-normal">Add a new commercial entity to the platform</span>
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
            <div className="p-1 mt-4">
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            {createBusiness.status === "loading" ? (
                                <FormSkeleton fields={5} />
                            ) : (
                                <>
                                    {/* Basic Info Section */}
                                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 space-y-4">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identity & Ownership</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="md:col-span-2">
                                                <FormField
                                                    label="Business Name"
                                                    name="name"
                                                    placeholder="e.g. Al-Falah General Store"
                                                    required
                                                    className="!h-[36px] !text-xs !rounded-lg"
                                                    labelClassName="!text-xs !font-bold !text-slate-600"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <FormField
                                                    label="Owner User ID"
                                                    name="userId"
                                                    placeholder="MongoDB ObjectId of the user"
                                                    required
                                                    className="!h-[36px] !text-xs !rounded-lg"
                                                    labelClassName="!text-xs !font-bold !text-slate-600"
                                                />
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
                                                placeholder="e.g. Retail"
                                                required
                                                className="!h-[36px] !text-xs !rounded-lg"
                                                labelClassName="!text-xs !font-bold !text-slate-600"
                                                icon={<FaTag className="opacity-20 text-[10px]" />}
                                            />
                                            <FormField
                                                label="Category (Urdu)"
                                                name="categoryUr"
                                                placeholder="e.g. ریٹیل"
                                                className="!h-[36px] !text-xs !rounded-lg font-notoUrdu"
                                                labelClassName="!text-xs !font-bold !text-slate-600"
                                                icon={<FaTag className="opacity-20 text-[10px]" />}
                                            />
                                            <FormField
                                                label="Contact Phone"
                                                name="phone"
                                                placeholder="+92 300 1234567"
                                                required
                                                className="!h-[36px] !text-xs !rounded-lg"
                                                labelClassName="!text-xs !font-bold !text-slate-600"
                                                icon={<FaPhoneAlt className="opacity-20 text-[10px]" />}
                                            />
                                            <FormField
                                                label="Business Address"
                                                name="address"
                                                placeholder="123 Street, City"
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
                                            label="Description"
                                            name="description"
                                            placeholder="Brief about what this business does..."
                                            type="textarea"
                                            className="!text-xs !rounded-lg"
                                            labelClassName="!text-xs !font-bold !text-slate-600"
                                            autoSize={{ minRows: 2, maxRows: 4 }}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Modal Footer Actions */}
                            <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
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
