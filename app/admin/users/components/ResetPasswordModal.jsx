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
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaLock size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-900 block">Reset Password</span>
                        <span className="text-xs text-slate-500 font-normal">Security update for user account</span>
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
                        <Form className="space-y-4">
                            {resetPassword.status === "loading" ? (
                                <FormSkeleton fields={2} />
                            ) : (
                                <>
                                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                                        <p className="text-slate-600 text-xs leading-relaxed">
                                            Creating a new secure password for <span className="font-bold text-slate-900">{modal?.data?.name || "this user"}</span>.
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <FormField
                                            label="New Password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            className="!h-[36px] !text-sm"
                                        />
                                        <FormField
                                            label="Confirm New Password"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            className="!h-[36px] !text-sm"
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
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
