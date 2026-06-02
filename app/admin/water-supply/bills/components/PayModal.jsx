"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal, Timeline } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaMoneyBillWave, FaHistory } from "react-icons/fa";
import moment from "moment";

import SelectBox from "@/components/SelectBox";
import { PAY_BILL } from "@/app/api/admin/water-supply";
import CustomButton from "@/components/shared/CustomButton";
import { FormSkeleton } from "@/components/shared/Skeletons";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const validationSchema = Yup.object().shape({
    paymentMode: Yup.string().required("Payment Method is required"),
});

const PayBillModal = React.memo(({ modal, setModal }) => {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();
    
    const isPayOpen = modal?.state && modal?.name === "Pay";
    const isHistoryOpen = modal?.state && modal?.name === "History";

    const payBill = useMutation({
        mutationKey: ["payBill"],
        mutationFn: PAY_BILL,
        onSuccess: (data) => {
            toast.success(data?.data?.message || "Bill marked as paid!");
            queryClient.invalidateQueries([ADMIN_KEYS.WATER_SUPPLY.BILLS_LIST]);
            handleCloseModal(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to process payment.");
        },
    });

    const handleSubmit = React.useCallback((values, { setSubmitting }) => {
        payBill.mutate({ billId: modal.data._id, paymentMode: values.paymentMode }, {
            onSettled: () => setSubmitting(false)
        });
    }, [payBill, modal]);

    const handleCloseModal = React.useCallback((force = false) => {
        if (!force && formikRef.current?.dirty && isPayOpen) {
            Modal.confirm({
                title: "Unsaved Changes",
                content: "You have unsaved changes. Are you sure you want to discard them and exit?",
                okText: "Discard",
                okType: "danger",
                cancelText: "Stay",
                onOk: () => {
                    formikRef.current?.resetForm();
                    setModal({ name: null, state: false, data: null });
                },
            });
        } else {
            formikRef.current?.resetForm();
            setModal({ name: null, state: false, data: null });
        }
    }, [setModal, isPayOpen]);

    useEffect(() => {
        if (!isPayOpen && !isHistoryOpen) {
            formikRef.current?.resetForm();
        }
    }, [isPayOpen, isHistoryOpen]);

    if (isHistoryOpen) {
        return (
            <Modal
                title={
                    <div className="flex items-center gap-2 px-0 py-1">
                        <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-[#006666] dark:text-teal-400 transition-colors duration-300">
                            <FaHistory size={16} />
                        </div>
                        <div>
                            <span className="text-lg font-bold text-[#006666] dark:text-teal-500 block mt-1 transition-colors duration-300">Audit History</span>
                        </div>
                    </div>
                }
                open={isHistoryOpen}
                onCancel={() => handleCloseModal(true)}
                footer={null}
                centered
                className="modern-modal"
            >
                <div className="p-1">
                    <div className="modal-section mb-0">
                        <div className="max-h-[300px] overflow-y-auto p-4 custom-scrollbar">
                            {modal.data && modal.data.length > 0 ? (
                                <Timeline className="mt-2 ml-2">
                                    {modal.data.map((log, index) => (
                                        <Timeline.Item key={index} color="blue" className="pb-6">
                                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mb-0.5">{log.changes}</p>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                                {moment(log.date).format("MMM DD, YYYY hh:mm A")} • by <span className="font-bold text-[#006666] dark:text-teal-500">{log.updatedByModel}</span>
                                            </p>
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            ) : (
                                <div className="text-center py-8 flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-3 text-slate-300 dark:text-slate-600">
                                        <FaHistory size={20} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">No History Found</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 transition-colors">
                        <CustomButton
                            label="Close"
                            type="secondary"
                            onClick={() => handleCloseModal(true)}
                        />
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 transition-colors duration-300">
                        <FaMoneyBillWave size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-green-600 dark:text-green-500 block mt-1 transition-colors duration-300">Process Payment</span>
                    </div>
                </div>
            }
            centered
            width={500}
            open={isPayOpen}
            onCancel={() => handleCloseModal(false)}
            footer={null}
            className="modern-modal"
        >
            <div className="p-1">
                <div className="modal-section mb-3">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Billing Summary</p>
                    <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded flex justify-between items-center border border-slate-100 dark:border-slate-800 mb-2">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Billing Month</span>
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200">{modal?.data?.billingMonth}</span>
                    </div>
                    <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded flex justify-between items-center border border-red-100 dark:border-red-900/20">
                        <span className="text-[11px] font-bold text-red-500 dark:text-red-400 uppercase tracking-tight">Amount Due</span>
                        <span className="text-lg font-black text-red-600 dark:text-red-500 leading-none">{modal?.data?.amount}</span>
                    </div>
                </div>

                <Formik
                    innerRef={formikRef}
                    initialValues={{ paymentMode: "CASH" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-2">
                            {payBill.isLoading ? (
                                <FormSkeleton fields={1} />
                            ) : (
                                <>
                                    <div className="modal-section">
                                        <div className="flex flex-col gap-1.5 overflow-hidden">
                                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight ml-1 transition-colors duration-300">Payment Method <span className="text-red-500">*</span></label>
                                            <SelectBox
                                                value={values.paymentMode}
                                                handleChange={(val) => setFieldValue("paymentMode", val)}
                                                options={[
                                                    { value: "CASH", label: "Cash" },
                                                    { value: "BANK_TRANSFER", label: "Bank Transfer" },
                                                    { value: "APP", label: "App Transfer" }
                                                ]}
                                                className="modern-select-box"
                                            />
                                            {errors.paymentMode && touched.paymentMode && <span className="text-red-500 text-[10px] font-medium ml-1">{errors.paymentMode}</span>}
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
                                    label="Confirm Payment"
                                    htmlType="submit"
                                    className="!bg-green-600 hover:!bg-green-700"
                                    loading={isSubmitting || payBill.isLoading}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

export default PayBillModal;
