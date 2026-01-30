"use client";
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CREATE_ADMIN_USER, UPDATE_ADMIN_USER } from "@/app/api/admin/admin-users";
import { GET_ROLES } from "@/app/api/admin/roles";
import md5 from "md5";

const { Option } = Select;

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string(),
    role: Yup.string().required("Role type is required"),
    password: Yup.string().when("isEdit", {
        is: false,
        then: () => Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
        otherwise: () => Yup.string(),
    }),
});

const AddEditAdminUserModal = ({ modal, setModal }) => {
    const queryClient = useQueryClient();
    const isEdit = modal.name === "Edit";

    // Fetch roles for dropdown
    const { data: rolesData } = useQuery("allRolesList", () => GET_ROLES({ limit: 100 }), {
        staleTime: 30000,
    });

    const mutation = useMutation(isEdit ? UPDATE_ADMIN_USER : CREATE_ADMIN_USER, {
        onSuccess: () => {
            queryClient.invalidateQueries("adminUsersList");
            toast.success(`Admin user ${isEdit ? "updated" : "created"} successfully`);
            handleCancel();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || `Failed to ${isEdit ? "update" : "create"} admin user`);
        },
    });

    const handleSubmit = (values, { setSubmitting }) => {
        const payload = { ...values };

        // Hash password only when creating or when password is provided during edit
        if (payload.password) {
            payload.password = md5(payload.password);
        } else if (isEdit) {
            delete payload.password; // Don't send password if not changing
        }

        if (isEdit) {
            payload.id = modal.data._id;
        }

        mutation.mutate(payload);
        setSubmitting(false);
    };

    const handleCancel = () => {
        setModal({ name: null, data: null, state: false });
    };

    return (
        <Modal
            title={`${isEdit ? "Edit" : "Add"} Admin User`}
            open={modal.state}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
            width={600}
        >
            <Formik
                initialValues={{
                    name: modal.data?.name || "",
                    email: modal.data?.email || "",
                    phone: modal.data?.phone || "",
                    role: modal.data?.role || "ADMIN",
                    accessRoleId: modal.data?.accessRoleId?._id || modal.data?.accessRoleId || "",
                    status: modal.data?.status || "ACTIVE",
                    password: "",
                    isEdit: isEdit,
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                }) => (
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Name"
                            validateStatus={errors.name && touched.name ? "error" : ""}
                            help={errors.name && touched.name ? errors.name : ""}
                        >
                            <Input
                                name="name"
                                placeholder="Enter name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            validateStatus={errors.email && touched.email ? "error" : ""}
                            help={errors.email && touched.email ? errors.email : ""}
                        >
                            <Input
                                name="email"
                                type="email"
                                placeholder="Enter email"
                                value={values.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={isEdit}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Phone"
                            validateStatus={errors.phone && touched.phone ? "error" : ""}
                            help={errors.phone && touched.phone ? errors.phone : ""}
                        >
                            <Input
                                name="phone"
                                placeholder="Enter phone number"
                                value={values.phone}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            validateStatus={errors.password && touched.password ? "error" : ""}
                            help={errors.password && touched.password ? errors.password : isEdit ? "Leave empty to keep current password" : ""}
                        >
                            <Input.Password
                                name="password"
                                placeholder={isEdit ? "Enter new password (optional)" : "Enter password"}
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Role Type"
                            validateStatus={errors.role && touched.role ? "error" : ""}
                            help={errors.role && touched.role ? errors.role : ""}
                        >
                            <Select
                                value={values.role}
                                onChange={(value) => setFieldValue("role", value)}
                                placeholder="Select role type"
                            >
                                <Option value="ADMIN">Admin</Option>
                                <Option value="USER">User</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="Permission Role">
                            <Select
                                value={values.accessRoleId}
                                onChange={(value) => setFieldValue("accessRoleId", value)}
                                placeholder="Select permission role"
                                allowClear
                            >
                                {rolesData?.data?.docs?.map((role) => (
                                    <Option key={role._id} value={role._id}>
                                        {role.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item label="Status">
                            <Select
                                value={values.status}
                                onChange={(value) => setFieldValue("status", value)}
                            >
                                <Option value="ACTIVE">Active</Option>
                                <Option value="INACTIVE">Inactive</Option>
                            </Select>
                        </Form.Item>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmitting || mutation.isLoading}
                                className="bg-[#0F172A]"
                            >
                                {isEdit ? "Update" : "Create"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default AddEditAdminUserModal;
