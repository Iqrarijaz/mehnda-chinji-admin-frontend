"use client";
import React, { useRef, useEffect, useMemo } from "react";
import { Modal } from "antd";
import { FaShieldAlt } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { UPDATE_MARKETPLACE_STATUS } from "@/app/api/admin/marketplace";
import SelectField from "@/components/InnerPage/SelectField";
import CustomButton from "@/components/shared/CustomButton";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const validationSchema = Yup.object().shape({
    status: Yup.string().required("Please select a status"),
    rejectedReason: Yup.string().when("status", {
        is: "rejected",
        then: () => Yup.string().required("Reason for rejection is required"),
        otherwise: () => Yup.string().notRequired(),
    }),
});

const statusOptions = [
    { label: "Pending Audit", value: "pending" },
    { label: "Approve (Live)", value: "live" },
    { label: "Reject Listing", value: "rejected" },
    { label: "Mark as Sold", value: "sold" }
];

const StatusListingModal = React.memo(({ modal, setModal }) => {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const initialValues = useMemo(() => ({
        status: modal.data?.status || "",
        rejectedReason: modal.data?.rejectedReason || "",
    }), [modal.data]);

    useEffect(() => {
        if (modal.name === "Status" && modal.data) {
            formikRef.current?.resetForm();
        }
    }, [modal.state, modal.name, modal.data]);

    const handleClose = () => {
        formikRef.current?.resetForm();
        setModal({ name: null, data: null, state: false });
    };

    const handleStatusUpdate = useMutation({
        mutationKey: ["updateMarketplaceStatus"],
        mutationFn: UPDATE_MARKETPLACE_STATUS,
        onSuccess: (data) => {
            toast.success(data?.message || "Listing status updated successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.MARKETPLACE.LIST]);
            handleClose();
        },
        onError: (error) => {
            toast.error(error?.errorMessage || error?.message || "Failed to update status");
        },
    });

    const onSubmit = (values, { setSubmitting }) => {
        handleStatusUpdate.mutate({
            listingId: modal.data._id,
            status: values.status,
            rejectedReason: values.status === "rejected" ? values.rejectedReason : undefined
        }, {
            onSettled: () => setSubmitting(false)
        });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-[#006666] dark:text-teal-400 transition-colors duration-300">
                        <FaShieldAlt size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-500 block mt-1 transition-colors duration-300">Moderate Marketplace Listing</span>
                    </div>
                </div>
            }
            centered
            width={450}
            open={modal.name === "Status" && modal.state}
            onCancel={handleClose}
            footer={null}
            className="modern-modal"
            destroyOnClose
        >
            <div className="p-1">
                <Formik
                    innerRef={formikRef}
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting, values }) => (
                        <Form className="space-y-2 mt-2">
                            <div className="modal-section">
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">Status Update</p>
                                
                                <SelectField 
                                    label="Listing Status" 
                                    name="status" 
                                    options={statusOptions} 
                                />

                                {values.status === "rejected" && (
                                    <div className="mt-3 mb-1.5">
                                        <label className="text-slate-700 dark:text-slate-400 font-semibold text-xs mb-1 transition-colors block" htmlFor="rejectedReason">
                                            Reason for Rejection <span className="text-red-500">*</span>
                                        </label>
                                        <Field
                                            as="textarea"
                                            name="rejectedReason"
                                            rows={3}
                                            placeholder="e.g. Inappropriate images, invalid price, fake contact details..."
                                            className="formit-input focus:outline-none w-full px-4 py-2 border-2 border-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-sans text-[12px] text-slate-600 rounded"
                                        />
                                        <ErrorMessage name="rejectedReason" component="div" className="text-red-500 text-xs mt-1 font-medium" />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
                                <CustomButton label="Cancel" type="secondary" onClick={handleClose} disabled={isSubmitting || handleStatusUpdate.isPending} />
                                <CustomButton label="Update Status" htmlType="submit" loading={isSubmitting || handleStatusUpdate.isPending} />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

export default StatusListingModal;
