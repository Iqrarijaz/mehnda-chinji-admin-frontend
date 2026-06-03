"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal, DatePicker } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";
import moment from "moment";

import FormField from "@/components/InnerPage/FormField";
import { UPDATE_EXPENSE } from "@/app/api/admin/water-supply";
import CustomButton from "@/components/shared/CustomButton";
import { FormSkeleton } from "@/components/shared/Skeletons";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    amount: Yup.number().min(1, "Invalid amount").required("Amount is required"),
});

const UpdateExpenseModal = React.memo(({ modal, setModal }) => {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();
    const isModalOpen = modal?.state && modal?.name === "Update";

    const [expenseDate, setExpenseDate] = React.useState(moment());

    const updateExpense = useMutation({
        mutationKey: ["updateExpense"],
        mutationFn: UPDATE_EXPENSE,
        onSuccess: (data) => {
            toast.success(data?.data?.message || "Expense updated successfully!");
            queryClient.invalidateQueries([ADMIN_KEYS.WATER_SUPPLY.EXPENSES_LIST]);
            handleCloseModal(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to update expense.");
        },
    });

    const handleSubmit = React.useCallback((values, { setSubmitting }) => {
        updateExpense.mutate({
            _id: modal.data._id,
            ...values,
            expenseDate: expenseDate ? expenseDate.toISOString() : undefined
        }, {
            onSettled: () => setSubmitting(false)
        });
    }, [updateExpense, expenseDate, modal]);

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
                title: modal.data.title || "",
                amount: modal.data.amount || "",
            });
            if (modal.data.expenseDate) {
                setExpenseDate(moment(modal.data.expenseDate));
            }
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
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-500 block mt-1 transition-colors duration-300">Edit Operational Expense</span>
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
                <Formik
                    innerRef={formikRef}
                    initialValues={{ title: "", amount: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-2">
                            {updateExpense.isLoading ? (
                                <FormSkeleton fields={2} />
                            ) : (
                                <>
                                    <div className="modal-section">
                                        <FormField label="Expense Title/Description" name="title" placeholder="e.g. Motor Repair, Electricity Bill" required className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1" />
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                            <FormField label="Amount" name="amount" type="number" placeholder="1000" required className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1" />
                                            
                                            <div className="flex flex-col gap-1.5 overflow-hidden">
                                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight ml-1 transition-colors duration-300">Date Incurred</label>
                                                <DatePicker 
                                                    value={expenseDate} 
                                                    onChange={setExpenseDate} 
                                                    className="w-full !h-[32px] rounded border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900/40" 
                                                    allowClear={false}
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
                                    onClick={() => handleCloseModal(false)}
                                />
                                <CustomButton
                                    label="Update Expense"
                                    htmlType="submit"
                                    loading={isSubmitting || updateExpense.isLoading}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

export default UpdateExpenseModal;
