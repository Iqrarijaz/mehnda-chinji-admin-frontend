"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal, Select, Input } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import md5 from "md5";
import { FaUserEdit, FaUserShield, FaEnvelope, FaPhone, FaLock, FaChevronRight, FaInfoCircle } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import SelectField from "@/components/InnerPage/SelectField";
import { UPDATE_ADMIN_USER } from "@/app/api/admin/admin-users";
import { GET_ACTIVE_ROLES } from "@/app/api/admin/roles";
import CustomButton from "@/components/shared/CustomButton";
import { ADMIN_KEYS } from "@/constants/queryKeys";

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

    const { data: rolesData, isLoading: rolesLoading } = useQuery({
        queryKey: [ADMIN_KEYS.ROLES.LIST, "active"],
        queryFn: GET_ACTIVE_ROLES,
        staleTime: 30000,
        enabled: modal?.name === "Edit" && modal?.state,
    });

    const updateAdminUser = useMutation({
        mutationKey: ["updateAdminUser"],
        mutationFn: UPDATE_ADMIN_USER,
        onSuccess: (data) => {
            toast.success(data?.message || "Admin user updated successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.ADMIN_USERS.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.ADMIN_USERS.COUNTS]);
            handleCloseModal(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Something went wrong");
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
        isDeleted: modal?.data?.isDeleted ?? false,
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

    const handleCloseModal = (forceClose = false) => {
        const force = forceClose === true;
        if (!force && formikRef.current?.dirty) {
            Modal.confirm({
                title: "Unsaved Changes",
                content: "You have unsaved changes. Are you sure you want to discard them and exit?",
                okText: "Discard",
                okType: "danger",
                cancelText: "Stay",
                onOk: () => {
                    formikRef.current?.resetForm();
                    setModal({ name: null, state: false, data: null });
                },
            });
        } else {
            formikRef.current?.resetForm();
            setModal({ name: null, state: false, data: null });
        }
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
            width={800}
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
                            {updateAdminUser.isPending ? (
                                <FormSkeleton fields={5} />
                            ) : (
                                <>
                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Identity Details</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <FormField label="Full Name" name="name" placeholder="John Doe" required />
                                            <FormField label="Email Address" name="email" type="email" placeholder="john@example.com" disabled required />
                                            <FormField label="Phone Number" name="phone" placeholder="+1..." />
                                            <FormField label="Update Password (Optional)" name="password" type="password" placeholder="••••••••" />
                                        </div>
                                    </div>

                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Permissions & Status</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <SelectField
                                                label="Permission Role"
                                                name="accessRoleId"
                                                required
                                                loading={rolesLoading}
                                                options={rolesData?.data?.map(role => ({ value: role._id, label: role.name })) || []}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    const selectedRole = rolesData?.data?.find(r => r._id === value);
                                                    setFieldValue("accessRoleId", value);
                                                    setFieldValue("role", selectedRole?.name || "");
                                                }}
                                            />

                                            <SelectField
                                                label="Account Status"
                                                name="status"
                                                value={values.status}
                                                onChange={(e) => setFieldValue("status", e.target.value)}
                                                options={[
                                                    { value: "ACTIVE", label: "Authorized / Active" },
                                                    { value: "INACTIVE", label: "Suspended / Inactive" }
                                                ]}
                                            />
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
                                    loading={updateAdminUser.isPending || isSubmitting}
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
