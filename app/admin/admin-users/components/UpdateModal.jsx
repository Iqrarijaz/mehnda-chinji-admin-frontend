"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select, Input } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import md5 from "md5";
import { FaUserEdit, FaUserShield, FaEnvelope, FaPhone, FaLock, FaChevronRight, FaInfoCircle } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_ADMIN_USER } from "@/app/api/admin/admin-users";
import { GET_ACTIVE_ROLES } from "@/app/api/admin/roles";

const { Option } = Select;

// Validation schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string(),
    accessRoleId: Yup.string().required("Permission role is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
});

function UpdateAdminUserModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const { data: rolesData, isLoading: rolesLoading } = useQuery(
        "activeRolesList",
        GET_ACTIVE_ROLES,
        {
            staleTime: 30000,
            enabled: modal?.name === "Edit" && modal?.state,
        }
    );

    const updateAdminUser = useMutation({
        mutationKey: ["updateAdminUser"],
        mutationFn: UPDATE_ADMIN_USER,
        onSuccess: (data) => {
            toast.success(data?.message || "Admin user updated successfully");
            queryClient.invalidateQueries("adminUsersList");
            queryClient.invalidateQueries("adminUsersStatusCounts");
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
        role: modal?.data?.role || "",
        accessRoleId: modal?.data?.accessRoleId?._id || modal?.data?.accessRoleId || "",
        password: "",
        status: modal?.data?.status || "ACTIVE",
    };

    const handleSubmit = (values) => {
        const payload = { ...values };
        if (payload.password) {
            payload.password = md5(payload.password);
        } else {
            delete payload.password;
        }
        payload._id = modal?.data?._id;
        updateAdminUser.mutate(payload);
    };

    const handleCloseModal = () => {
        setModal({ name: null, state: false, data: null });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 px-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaUserEdit size={18} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 block">Edit Admin User</span>
                        <span className="text-xs text-slate-500 font-normal">Modify team member credentials and access</span>
                    </div>
                </div>
            }
            centered
            width={640}
            open={modal?.name === "Edit" && modal?.state}
            onCancel={handleCloseModal}
            footer={null}
            className="modern-modal"
        >
            <div className="p-2 pt-4">
                <Formik
                    enableReinitialize
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, setFieldValue, handleChange, handleBlur, isSubmitting }) => (
                        <Form className="space-y-6">
                            {updateAdminUser.status === "loading" ? (
                                <FormSkeleton fields={5} />
                            ) : (
                                <>
                                    <div className="modal-section">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Personal Identity</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <FormField label="Full Name" name="name" placeholder="John Doe" required icon={<FaChevronRight className="opacity-20 translate-y-0.5" />} />
                                            <FormField label="Email Address" name="email" type="email" placeholder="john@example.com" disabled required icon={<FaEnvelope className="opacity-20" />} />
                                            <FormField label="Phone Number" name="phone" placeholder="+1..." icon={<FaPhone className="opacity-20" />} />

                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-slate-700 font-semibold text-sm">Update Password</label>
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase">Optional</span>
                                                </div>
                                                <div className="relative">
                                                    <FaLock className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-300 pointer-events-none" />
                                                    <Input.Password
                                                        name="password"
                                                        placeholder="Leave empty to keep current"
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className="!pl-11 !h-[44px] !rounded-xl !border-2 !border-slate-100 focus:!border-teal-500"
                                                    />
                                                </div>
                                                {touched.password && errors.password && <div className="text-red-500 text-xs font-medium">{errors.password}</div>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-section !mb-0">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Access Control & Status</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-slate-700 font-semibold text-sm">Permission Role <span className="text-red-500">*</span></label>
                                                <Select
                                                    value={values.accessRoleId}
                                                    onChange={(value) => {
                                                        const selectedRole = rolesData?.data?.find(r => r._id === value);
                                                        setFieldValue("accessRoleId", value);
                                                        setFieldValue("role", selectedRole?.name || "");
                                                    }}
                                                    placeholder="Select assigned role"
                                                    className="!h-[44px] !rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm"
                                                    size="large"
                                                    loading={rolesLoading}
                                                >
                                                    {rolesData?.data?.map((role) => (
                                                        <Option key={role._id} value={role._id}>{role.name}</Option>
                                                    ))}
                                                </Select>
                                                {touched.accessRoleId && errors.accessRoleId && <div className="text-red-500 text-xs font-medium">{errors.accessRoleId}</div>}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="text-slate-700 font-semibold text-sm">Account Status</label>
                                                <Select
                                                    value={values.status}
                                                    onChange={(value) => setFieldValue("status", value)}
                                                    className="!h-[44px] !rounded-xl overflow-hidden border-2 border-slate-100 shadow-sm"
                                                    size="large"
                                                >
                                                    <Option value="ACTIVE">Authorized / Active</Option>
                                                    <Option value="INACTIVE">Suspended / Inactive</Option>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                                <Button
                                    onClick={handleCloseModal}
                                    className="modal-footer-btn-secondary flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={updateAdminUser.isLoading || isSubmitting}
                                    className="modal-footer-btn-primary flex-1"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default UpdateAdminUserModal;
