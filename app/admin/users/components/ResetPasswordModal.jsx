"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal } from "antd";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { RESET_USER_PASSWORD } from "@/app/api/admin/users";

// Validation schema
const validationSchema = Yup.object().shape({
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

// Initial values
const initialValues = {
    password: "",
    confirmPassword: "",
};

function ResetPasswordModal({ modal, setModal }) {
    const formikRef = useRef(null);

    const resetPassword = useMutation({
        mutationKey: ["resetUserPassword"],
        mutationFn: RESET_USER_PASSWORD,
        onSuccess: (data) => {
            toast.success(data?.message || "Password reset successfully");
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = (values) => {
        resetPassword.mutate({
            _id: modal?.data?._id,
            password: values.password
        });
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
            title={`Reset Password for ${modal?.data?.name || 'User'}`}
            centered
            width={500}
            open={modal?.name === "ResetPassword" && modal?.state}
            onCancel={handleCloseModal}
            footer={null}
        >
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting }) => (
                    <Form className="space-y-4">
                        {resetPassword.status === "loading" && <Loading />}

                        <FormField
                            label="New Password"
                            name="password"
                            type="password"
                            required
                            placeholder="Enter new password"
                        />

                        <FormField
                            label="Confirm New Password"
                            name="confirmPassword"
                            type="password"
                            required
                            placeholder="Confirm new password"
                        />

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button onClick={handleCloseModal}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmitting}
                                className="bg-primary hover:bg-primary/90"
                            >
                                Reset Password
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}

export default ResetPasswordModal;
