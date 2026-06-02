"use client";
import React, { useRef, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaFileInvoiceDollar } from "react-icons/fa";
import moment from "moment";

import FormField from "@/components/InnerPage/FormField";
import SelectBox from "@/components/SelectBox";
import { CREATE_BILL, LIST_CONNECTIONS } from "@/app/api/admin/water-supply";
import CustomButton from "@/components/shared/CustomButton";
import { FormSkeleton } from "@/components/shared/Skeletons";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const validationSchema = Yup.object().shape({
    connectionId: Yup.string().required("Connection is required"),
    amount: Yup.number().min(1, "Invalid amount").required("Amount is required"),
    billingMonth: Yup.string().required("Billing Month is required"),
});

const initialValues = {
    connectionId: "",
    amount: "",
    billingMonth: moment().format("YYYY-MM"),
};

const AddBillModal = React.memo(({ modal, setModal }) => {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();
    const isModalOpen = modal?.state && modal?.name === "Add";

    const [connections, setConnections] = useState([]);
    const [loadingConns, setLoadingConns] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            fetchConnections();
        }
    }, [isModalOpen]);

    const fetchConnections = async () => {
        setLoadingConns(true);
        try {
            const res = await LIST_CONNECTIONS({ limit: 1000, status: "ACTIVE" });
            if (res?.data?.docs) {
                setConnections(res.data.docs.map(c => ({
                    value: c._id,
                    label: `${c.connectionId} - ${c.name}`
                })));
            }
        } catch (error) {
            console.error("Error fetching connections", error);
        }
        setLoadingConns(false);
    };

    const createBill = useMutation({
        mutationKey: ["createBill"],
        mutationFn: CREATE_BILL,
        onSuccess: (data) => {
            toast.success(data?.data?.message || "Bill generated successfully!");
            queryClient.invalidateQueries([ADMIN_KEYS.WATER_SUPPLY.BILLS_LIST]);
            handleCloseModal(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to generate bill.");
        },
    });

    const handleSubmit = React.useCallback((values, { setSubmitting }) => {
        createBill.mutate(values, {
            onSettled: () => setSubmitting(false)
        });
    }, [createBill]);

    const handleCloseModal = React.useCallback((force = false) => {
        if (!force && formikRef.current?.dirty) {
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
    }, [setModal]);

    useEffect(() => {
        if (!isModalOpen) {
            formikRef.current?.resetForm();
        }
    }, [isModalOpen]);

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-[#006666] dark:text-teal-400 transition-colors duration-300">
                        <FaFileInvoiceDollar size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-500 block mt-1 transition-colors duration-300">Generate New Bill</span>
                    </div>
                </div>
            }
            centered
            width={600}
            open={isModalOpen}
            onCancel={() => handleCloseModal(false)}
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
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-2">
                            {createBill.isLoading || loadingConns ? (
                                <FormSkeleton fields={3} />
                            ) : (
                                <>
                                    <div className="modal-section">
                                        <div className="flex flex-col gap-1.5 overflow-hidden mb-3">
                                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight ml-1 transition-colors duration-300">Select Connection <span className="text-red-500">*</span></label>
                                            <SelectBox
                                                value={values.connectionId}
                                                handleChange={(val) => {
                                                    setFieldValue("connectionId", val);
                                                }}
                                                options={connections}
                                                className="modern-select-box"
                                                showSearch={true}
                                            />
                                            {errors.connectionId && touched.connectionId && <span className="text-red-500 text-[10px] font-medium ml-1">{errors.connectionId}</span>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <FormField label="Billing Month (YYYY-MM)" name="billingMonth" placeholder="2023-10" required className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1" />
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
                                    label="Generate Bill"
                                    htmlType="submit"
                                    loading={isSubmitting || createBill.isLoading}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

export default AddBillModal;
