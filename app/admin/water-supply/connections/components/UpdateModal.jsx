"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

import FormField from "@/components/InnerPage/FormField";
import SelectBox from "@/components/SelectBox";
import { UPDATE_CONNECTION } from "@/app/api/admin/water-supply";
import CustomButton from "@/components/shared/CustomButton";
import { FormSkeleton } from "@/components/shared/Skeletons";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    phoneNumber: Yup.string()
        .matches(/^03[0-9]{9}$/, "Phone number must be 11 digits starting with 03")
        .required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    status: Yup.string().required("Status is required"),
});

const UpdateConnectionModal = React.memo(({ modal, setModal }) => {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();
    const isModalOpen = modal?.state && modal?.name === "Update";

    const updateConnection = useMutation({
        mutationKey: ["updateConnection"],
        mutationFn: UPDATE_CONNECTION,
        onSuccess: (data) => {
            toast.success(data?.data?.message || "Connection updated successfully!");
            queryClient.invalidateQueries([ADMIN_KEYS.WATER_SUPPLY.CONNECTIONS_LIST]);
            handleCloseModal(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to update connection.");
        },
    });

    const handleSubmit = React.useCallback((values, { setSubmitting }) => {
        updateConnection.mutate({
            _id: modal.data._id,
            name: values.name,
            phoneNumber: values.phoneNumber,
            address: values.address,
            status: values.status,
        }, {
            onSettled: () => setSubmitting(false)
        });
    }, [updateConnection, modal]);

    const handleCloseModal = React.useCallback((force = false) => {
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
    }, [setModal]);

    useEffect(() => {
        if (isModalOpen && modal?.data) {
            formikRef.current?.setValues({
                name: modal.data.name || "",
                phoneNumber: modal.data.phoneNumber || "",
                address: modal.data.address || "",
                status: modal.data.status || "ACTIVE",
            });
        }
    }, [isModalOpen, modal?.data]);

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-[#006666] dark:text-teal-400 transition-colors duration-300">
                        <FaEdit size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-500 block mt-1 transition-colors duration-300">Edit Connection</span>
                    </div>
                </div>
            }
            centered
            width={600}
            open={isModalOpen}
            onCancel={() => handleCloseModal(false)}
            footer={null}
            destroyOnClose={true}
            className="modern-modal"
        >
            <div className="p-1">
                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded border border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{modal?.data?.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{modal?.data?.connectionId}</p>
                </div>

                <Formik
                    innerRef={formikRef}
                    initialValues={{ status: "ACTIVE" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-2">
                            {updateConnection.isLoading ? (
                                <FormSkeleton fields={1} />
                            ) : (
                                <>
                                    <div className="modal-section">
                                        <div className="grid grid-cols-1 gap-3">
                                            <FormField 
                                                label="Full Name" 
                                                name="name" 
                                                placeholder="e.g. John Doe" 
                                                required 
                                                className="!h-[32px] !text-xs !rounded" 
                                                labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1" 
                                            />
                                            
                                            <FormField 
                                                label="Phone Number (11 Digits, starts with 03)" 
                                                name="phoneNumber" 
                                                placeholder="03XXXXXXXXX" 
                                                maxLength={11}
                                                required 
                                                className="!h-[32px] !text-xs !rounded" 
                                                labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1" 
                                            />

                                            <FormField 
                                                label="Address / Location" 
                                                name="address" 
                                                placeholder="Enter detailed address" 
                                                required 
                                                className="!h-[32px] !text-xs !rounded" 
                                                labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1" 
                                            />

                                            <div className="flex flex-col gap-1.5 overflow-hidden">
                                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight ml-1 transition-colors duration-300">Status <span className="text-red-500">*</span></label>
                                                <SelectBox
                                                    value={values.status}
                                                    handleChange={(val) => setFieldValue("status", val)}
                                                    options={[
                                                        { value: "ACTIVE", label: "ACTIVE" },
                                                        { value: "SUSPENDED", label: "SUSPENDED" },
                                                        { value: "CANCELLED", label: "CANCELLED" }
                                                    ]}
                                                    className="modern-select-box"
                                                />
                                                {errors.status && touched.status && <span className="text-red-500 text-[10px] font-medium ml-1">{errors.status}</span>}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 transition-colors">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={() => handleCloseModal(false)}
                                />
                                <CustomButton
                                    label="Save Changes"
                                    htmlType="submit"
                                    loading={isSubmitting || updateConnection.isLoading}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

export default UpdateConnectionModal;
