"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal, Select, Input } from "antd";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import md5 from "md5";
import { FaUserEdit, FaUserShield, FaEnvelope, FaPhone, FaLock, FaChevronRight, FaInfoCircle } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_ADMIN_USER } from "@/app/api/admin/admin-users";
import { GET_ACTIVE_ROLES } from "@/app/api/admin/roles";
import CustomButton from "@/components/shared/CustomButton";

const { Option } = Select;

// Validation schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string(),
    accessRoleId: Yup.string().required("Permission role is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters"),
});

const UpdateAdminUserModal = React.memo(({ modal, setModal }) => {
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
                <div className="flex items-center gap-2 px-0">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                        <FaUserShield size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">Edit Admin User</span>
                    </div>
                </div>
            }
            centered
            width={600}
            open={modal?.name === "Edit" && modal?.state}
            onCancel={handleCloseModal}
            footer={null}
            className="modern-modal"
        >
            <div className="p-1">
                <Formik
                    enableReinitialize
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, setFieldValue, handleChange, handleBlur, isSubmitting }) => (
                        <Form className="space-y-2">
                            {updateAdminUser.isLoading ? (
                                <FormSkeleton fields={5} />
                            ) : (
                                <>
                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Identity Details</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <FormField label="Full Name" name="name" placeholder="John Doe" required className="!h-[32px] !text-xs" />
                                            <FormField label="Email Address" name="email" type="email" placeholder="john@example.com" disabled required className="!h-[32px] !text-xs" />
                                            <FormField label="Phone Number" name="phone" placeholder="+1..." className="!h-[32px] !text-xs" />
                                             <div className="flex flex-col gap-1.5">
                                                <div className="flex justify-between items-center">
                                                    <label className="text-slate-700 font-semibold text-xs">Update Password</label>
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase">Optional</span>
                                                </div>
                                                <div className="relative">
                                                    <FaLock className="absolute top-1/2 -translate-y-1/2 left-3 text-slate-300 pointer-events-none z-10" size={12} />
                                                    <Input.Password
                                                        name="password"
                                                        placeholder="••••••••"
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className="!pl-9 !h-[32px] !rounded-lg !border-2 !border-slate-100 focus:!border-teal-500 !text-xs"
                                                    />
                                                </div>
                                                {touched.password && errors.password && <div className="text-red-500 text-[10px] font-medium">{errors.password}</div>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Permissions & Status</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-slate-700 font-semibold text-xs">Permission Role <span className="text-red-500">*</span></label>
                                                 <Select
                                                    value={values.accessRoleId}
                                                    onChange={(value) => {
                                                        const selectedRole = rolesData?.data?.find(r => r._id === value);
                                                        setFieldValue("accessRoleId", value);
                                                        setFieldValue("role", selectedRole?.name || "");
                                                    }}
                                                    placeholder="Select role"
                                                    className="w-full modern-select-box"
                                                    size="middle"
                                                    loading={rolesLoading}
                                                >
                                                    {rolesData?.data?.map((role) => (
                                                        <Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>
                                                    ))}
                                                </Select>
                                                {touched.accessRoleId && errors.accessRoleId && <div className="text-red-500 text-[10px] font-medium">{errors.accessRoleId}</div>}
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-slate-700 font-semibold text-xs">Account Status</label>
                                                 <Select
                                                    value={values.status}
                                                    onChange={(value) => setFieldValue("status", value)}
                                                    className="w-full modern-select-box"
                                                    size="middle"
                                                >
                                                    <Select.Option value="ACTIVE">Authorized / Active</Select.Option>
                                                    <Select.Option value="INACTIVE">Suspended / Inactive</Select.Option>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                             <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleCloseModal}
                                />
                                <CustomButton
                                    label="Update Account"
                                    htmlType="submit"
                                    loading={updateAdminUser.isLoading || isSubmitting}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

export default UpdateAdminUserModal;
