"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal, DatePicker } from "antd";
import moment from "moment";
import dayjs from "dayjs";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

import FormField from "@/components/InnerPage/FormField";
import { UPDATE_BILL } from "@/app/api/admin/water-supply";
import CustomButton from "@/components/shared/CustomButton";
import { FormSkeleton } from "@/components/shared/Skeletons";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const validationSchema = Yup.object().shape({
    amount: Yup.number().min(1, "Invalid amount").required("Amount is required"),
    billingMonth: Yup.string().required("Billing Month is required"),
});

const UpdateBillModal = React.memo(({ modal, setModal }) => {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();
    const isModalOpen = modal?.state && modal?.name === "Update";

    const updateBill = useMutation({
        mutationKey: ["updateBill"],
        mutationFn: UPDATE_BILL,
        onSuccess: (data) => {
            toast.success(data?.data?.message || "Bill updated successfully!");
            queryClient.invalidateQueries([ADMIN_KEYS.WATER_SUPPLY.BILLS_LIST]);
            handleCloseModal(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to update bill.");
        },
    });

    const handleSubmit = React.useCallback((values, { setSubmitting }) => {
        updateBill.mutate({
            _id: modal.data._id,
            billingMonth: values.billingMonth,
            amount: values.amount,
        }, {
            onSettled: () => setSubmitting(false)
        });
    }, [updateBill, modal]);

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
        if (isModalOpen && modal.data) {
            formikRef.current?.setValues({
                amount: modal.data.amount || "",
                billingMonth: modal.data.billingMonth || "",
            });
        }
    }, [isModalOpen, modal.data]);

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-[#006666] dark:text-teal-400 transition-colors duration-300">
                        <FaEdit size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-500 block mt-1 transition-colors duration-300">Edit Pending Bill</span>
                    </div>
                </div>
            }
            centered
            width={500}
            open={isModalOpen}
            onCancel={() => handleCloseModal(false)}
            footer={null}
            destroyOnClose={true}
            className="modern-modal"
        >
            <div className="p-1">
                <Formik
                    innerRef={formikRef}
                    initialValues={{ amount: "", billingMonth: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-2">
                            {updateBill.isLoading ? (
                                <FormSkeleton fields={2} />
                            ) : (
                                <>
                                    <div className="modal-section">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex flex-col space-y-1">
                                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight ml-1">
                                                    Billing Month <span className="text-red-500">*</span>
                                                </label>
                                                <DatePicker
                                                    picker="month"
                                                    format="YYYY-MM"
                                                    value={values.billingMonth ? dayjs(values.billingMonth, "YYYY-MM") : null}
                                                    onChange={(date, dateString) => setFieldValue("billingMonth", dateString)}
                                                    className={`!h-[32px] !text-xs !rounded !w-full ${errors.billingMonth && touched.billingMonth ? '!border-red-500' : ''}`}
                                                    allowClear={false}
                                                />
                                                {errors.billingMonth && touched.billingMonth && (
                                                    <div className="text-red-500 text-[10px] ml-1 font-bold">{errors.billingMonth}</div>
                                                )}
                                            </div>
                                            <FormField label="Amount" name="amount" type="number" placeholder="500" required className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1" />
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
                                    label="Update Bill"
                                    htmlType="submit"
                                    loading={isSubmitting || updateBill.isLoading}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

export default UpdateBillModal;
