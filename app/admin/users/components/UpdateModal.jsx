"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_USER } from "@/app/api/admin/users";

const { Option } = Select;

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string().required("Role is required"),
    gender: Yup.string().required("Gender is required"),
});

function UpdateUserModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const updateUser = useMutation({
        mutationKey: ["updateUser"],
        mutationFn: (payload) => UPDATE_USER(payload),
        onSuccess: (data) => {
            toast.success(data?.message || "User updated successfully");
            queryClient.invalidateQueries("usersList");
            setModal({ name: null, state: false, data: null });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const initialValues = {
        name: modal?.data?.name || "",
        email: modal?.data?.email || "",
        role: modal?.data?.role || "USER",
        phone: modal?.data?.phone || "",
        gender: modal?.data?.gender || "MALE",
    };

    const handleSubmit = (values) => {
        updateUser.mutate({ _id: modal?.data?._id, ...values });
    };

    return (
        <Modal
            title="Update User"
            centered
            width={600}
            open={modal.name === "Update" && modal.state}
            onCancel={() => setModal({ name: null, state: false, data: null })}
            footer={null}
        >
            <Formik
                innerRef={formikRef}
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                    <Form className="space-y-4">
                        {updateUser.status === "loading" && <Loading />}

                        <FormField label="Full Name" name="name" required />
                        <FormField label="Email" name="email" type="email" required />

                        <div className="flex flex-col gap-1">
                            <label className="text-black font-semibold">Role <span className="text-red-500">*</span></label>
                            <Select
                                value={values.role}
                                onChange={(val) => setFieldValue("role", val)}
                                size="large"
                            >
                                <Option value="USER">USER</Option>
                                <Option value="ADMIN">ADMIN</Option>
                                <Option value="SUPER_ADMIN">SUPER_ADMIN</Option>
                            </Select>
                            {errors.role && touched.role && <span className="text-red-500 text-sm">{errors.role}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-black font-semibold">Gender <span className="text-red-500">*</span></label>
                            <Select
                                value={values.gender}
                                onChange={(val) => setFieldValue("gender", val)}
                                size="large"
                            >
                                <Option value="MALE">MALE</Option>
                                <Option value="FEMALE">FEMALE</Option>
                                <Option value="OTHER">OTHER</Option>
                            </Select>
                            {errors.gender && touched.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
                        </div>

                        <FormField label="Phone" name="phone" />

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button onClick={() => setModal({ name: null, state: false, data: null })}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmitting}
                                className="bg-primary hover:bg-primary/90"
                            >
                                Update User
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}

export default UpdateUserModal;
