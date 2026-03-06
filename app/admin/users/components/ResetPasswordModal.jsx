"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal } from "antd";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { FaLock } from "react-icons/fa";

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
                <div className="flex items-center gap-3 px-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaLock size={18} />
                    </div>
                    <span className="text-xl font-bold text-slate-900">Reset Password</span>
                </div>
            }
            centered
            width={480}
            open={modal.name === "ResetPassword" && modal.state}
            onCancel={handleCancel}
            footer={null}
            className="modern-modal"
        >
            <div className="p-2 pt-4">
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-6">
                            {resetPassword.status === "loading" ? (
                                <FormSkeleton fields={2} />
                            ) : (
                                <>
                                    <p className="text-slate-500 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        Enter a new secure password for <strong>{modal?.data?.name || "this user"}</strong>.
                                        Make sure it's at least 6 characters long.
                                    </p>

                                    <div className="space-y-5">
                                        <FormField
                                            label="New Password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <FormField
                                            label="Confirm New Password"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                                <Button
                                    onClick={handleCancel}
                                    className="modal-footer-btn-secondary"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmitting}
                                    className="modal-footer-btn-primary"
                                >
                                    Update Password
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default ResetPasswordModal;
