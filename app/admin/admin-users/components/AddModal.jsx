"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select, Input } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import md5 from "md5";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_ADMIN_USER } from "@/app/api/admin/admin-users";
import { GET_ACTIVE_ROLES } from "@/app/api/admin/roles";

const { Option } = Select;

// Validation schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string(),
    accessRoleId: Yup.string().required("Role is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

// Initial values
const initialValues = {
    name: "",
    email: "",
    phone: "",
    role: "",
    accessRoleId: "",
    password: "",
    status: "ACTIVE",
};

function AddAdminUserModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    // Fetch active roles for dropdown
    const { data: rolesData, isLoading: rolesLoading } = useQuery(
        "activeRolesList",
        GET_ACTIVE_ROLES,
        {
            staleTime: 30000,
            enabled: modal?.name === "Add" && modal?.state,
        }
    );

    const createAdminUser = useMutation({
        mutationKey: ["createAdminUser"],
        mutationFn: CREATE_ADMIN_USER,
        onSuccess: (data) => {
            toast.success(data?.message || "Admin user created successfully");
            queryClient.invalidateQueries("adminUsersList");
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = (values) => {
        const payload = { ...values };

        // Hash password
        if (payload.password) {
            payload.password = md5(payload.password);
        }

        createAdminUser.mutate(payload);
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
            title="Add Admin User"
            className="!rounded"
            centered
            width={600}
            open={modal?.name === "Add" && modal?.state}
            onCancel={handleCloseModal}
            footer={null}
            afterClose={() => formikRef.current?.resetForm()}
        >
            <div className="mb-4 flex justify-end">
                <Button
                    className="reset-button"
                    onClick={() => formikRef.current?.resetForm()}
                >
                    Reset
                </Button>
            </div>

            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, setFieldValue, handleChange, handleBlur }) => (
                    <Form>
                        <div className="bg-gray-100 p-4 rounded max-h-[60vh] overflow-y-auto">
                            {createAdminUser.status === "loading" && <Loading />}

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
                                <label className="text-black font-[500] mb-1 block">
                                    Password <span className="text-red-500">*</span>
                                </label>
                                <Input.Password
                                    name="password"
                                    placeholder="Enter password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="w-full"
                                />
                                {touched.password && errors.password && (
                                    <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                                )}
                            </div>

                            {/* Role */}
                            <div className="mb-3">
                                <label className="text-black font-[500] mb-1 block">
                                    Role <span className="text-red-500">*</span>
                                </label>
                                <Select
                                    value={values.accessRoleId}
                                    onChange={(value) => {
                                        const selectedRole = rolesData?.data?.find(r => r._id === value);
                                        setFieldValue("accessRoleId", value);
                                        setFieldValue("role", selectedRole?.name || "");
                                    }}
                                    placeholder="Select role"
                                    className="w-full"
                                    loading={rolesLoading}
                                >
                                    {rolesData?.data?.map((role) => (
                                        <Option key={role._id} value={role._id}>
                                            {role.name}
                                        </Option>
                                    ))}
                                </Select>
                                {touched.accessRoleId && errors.accessRoleId && (
                                    <div className="text-red-500 text-sm mt-1">{errors.accessRoleId}</div>
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
                                loading={createAdminUser.isLoading}
                                className="modal-add-button"
                            >
                                Add
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}

export default AddAdminUserModal;
