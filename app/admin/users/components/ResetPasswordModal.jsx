import { Modal } from "antd";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { FaLock } from "react-icons/fa";
import React, { useRef, useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CustomButton from "@/components/shared/CustomButton";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { RESET_USER_PASSWORD } from "@/app/api/admin/users";

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
});

function ResetPasswordModal({ modal, setModal }) {
    const formikRef = useRef(null);

    const resetPassword = useMutation({
        mutationKey: ["resetPassword"],
        mutationFn: RESET_USER_PASSWORD,
        onSuccess: (data) => {
            toast.success(data?.message || "Password reset successfully");
            setModal({ name: null, state: false, data: null });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const initialValues = {
        password: "",
        confirmPassword: "",
    };

    const handleSubmit = (values) => {
        resetPassword.mutate({ _id: modal?.data?._id, password: values.password });
    };

    const handleCancel = () => {
        setModal({ name: null, state: false, data: null });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                        <FaLock size={14} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-red-700 block mt-1">Reset Password</span>
                    </div>
                </div>
            }
            centered
            width={480}
            open={modal.name === "ResetPassword" && modal.state}
            onCancel={handleCancel}
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
                        <Form className="space-y-2">
                            {resetPassword.status === "loading" ? (
                                <FormSkeleton fields={2} />
                            ) : (
                                <>
                                    <div className="p-2 bg-slate-50/50 rounded-md border border-slate-100 mb-1">
                                        <p className="text-slate-500 text-[10px] leading-tight font-medium uppercase tracking-tight">
                                            Resetting password for: <span className="font-bold text-slate-800">{modal?.data?.name || "this user"}</span>
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <FormField
                                            label="New Password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            className="!h-[32px] !text-xs !rounded-lg"
                                            labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                                        />
                                        <FormField
                                            label="Confirm New Password"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            className="!h-[32px] !text-xs !rounded-lg"
                                            labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                                        />
                                    </div>
                                </>
                            )}

                             <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleCancel}
                                />
                                <CustomButton
                                    label="Update Password"
                                    htmlType="submit"
                                    loading={isSubmitting || resetPassword.isLoading}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default ResetPasswordModal;
