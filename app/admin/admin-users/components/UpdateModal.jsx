"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select, Input } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import md5 from "md5";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_ADMIN_USER } from "@/app/api/admin/admin-users";
import { GET_ROLES } from "@/app/api/admin/roles";

const { Option } = Select;

// Validation schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string(),
    role: Yup.string().required("Role type is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
});

function UpdateAdminUserModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    // Fetch roles for dropdown
    const { data: rolesData } = useQuery("allRolesList", () => GET_ROLES({ limit: 100 }), {
        staleTime: 30000,
        enabled: modal?.name === "Edit" && modal?.state,
    });

    const updateAdminUser = useMutation({
        mutationKey: ["updateAdminUser"],
        mutationFn: UPDATE_ADMIN_USER,
        onSuccess: (data) => {
            toast.success(data?.message || "Admin user updated successfully");
            queryClient.invalidateQueries("adminUsersList");
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const initialValues = {
        name: modal?.data?.name || "",
        email: modal?.data?.email || "",
        phone: modal?.data?.phone || "",
        role: modal?.data?.role || "ADMIN",
        password: "",
        status: modal?.data?.status || "ACTIVE",
    };

    const handleSubmit = (values) => {
        const payload = { ...values };

        // Hash password only when provided
        if (payload.password) {
            payload.password = md5(payload.password);
        } else {
            delete payload.password; // Don't send password if not changing
        }

        payload._id = modal?.data?._id;

        updateAdminUser.mutate(payload);
    };

    const handleCloseModal = () => {
        setModal({ name: null, state: false, data: null });
    };

    return (
        <Modal
            title="Update Admin User"
            className="!rounded"
            centered
            width={600}
            open={modal?.name === "Edit" && modal?.state}
            onCancel={handleCloseModal}
            footer={null}
        >
            <div className="mb-4 flex justify-end">
                <Button
                    className="reset-button"
                    onClick={() => formikRef.current?.resetForm({ values: initialValues })}
                >
                    Reset
                </Button>
            </div>

            <Formik
                innerRef={formikRef}
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, setFieldValue, handleChange, handleBlur }) => (
                    <Form>
                        <div className="bg-gray-100 p-4 rounded max-h-[60vh] overflow-y-auto">
                            {updateAdminUser.status === "loading" && <Loading />}

                            {/* Name */}
                            <FormField
                                label="Name"
                                name="name"
                                placeholder="Enter name"
                                required
                            />

                            {/* Email */}
                            <FormField
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="Enter email"
                                disabled
                                required
                            />

                            {/* Phone */}
                            <FormField
                                label="Phone"
                                name="phone"
                                placeholder="Enter phone number"
                            />

                            {/* Password */}
                            <div className="mb-3">
                                <label className="text-black font-[500] mb-1 block">Password</label>
                                <Input.Password
                                    name="password"
                                    placeholder="Enter new password (leave empty to keep current)"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full"
                                />
                                {touched.password && errors.password && (
                                    <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                                )}
                                <span className="text-xs text-gray-500">Leave empty to keep current password</span>
                            </div>

                            {/* Role Type */}
                            <div className="mb-3">
                                <label className="text-black font-[500] mb-1 block">
                                    Role Type <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    value={values.role}
                                    onChange={(value) => setFieldValue("role", value)}
                                    placeholder="Select role type"
                                    className="w-full"
                                >
                                    <Option value="ADMIN">Admin</Option>
                                    <Option value="USER">User</Option>
                                </Select>
                                {touched.role && errors.role && (
                                    <div className="text-red-500 text-sm mt-1">{errors.role}</div>
                                )}
                            </div>

                            {/* Status */}
                            <div className="mb-3">
                                <label className="text-black font-[500] mb-1 block">Status</label>
                                <Select
                                    value={values.status}
                                    onChange={(value) => setFieldValue("status", value)}
                                    className="w-full"
                                >
                                    <Option value="ACTIVE">Active</Option>
                                    <Option value="INACTIVE">Inactive</Option>
                                </Select>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end mt-4 gap-4">
                            <Button onClick={handleCloseModal} className="modal-cancel-button">
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={updateAdminUser.isLoading}
                                className="modal-add-button"
                            >
                                Update
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}

export default UpdateAdminUserModal;
