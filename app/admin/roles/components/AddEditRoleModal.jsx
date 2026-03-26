"use client";
import React from "react";
import { Modal, Form, Input } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CREATE_ROLE, UPDATE_ROLE } from "@/app/api/admin/roles";
import { FaEdit, FaShieldAlt } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

import PermissionsSelector from "./PermissionsSelector";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Role name is required"),
    description: Yup.string().required("Description is required"),
});

const AddEditRoleModal = ({ modal, setModal }) => {
    const queryClient = useQueryClient();
    const isEdit = modal.name === "Edit";

    const mutation = useMutation(isEdit ? UPDATE_ROLE : CREATE_ROLE, {
        onSuccess: () => {
            queryClient.invalidateQueries("rolesList");
            toast.success(`Role ${isEdit ? "updated" : "created"} successfully`);
            handleCancel();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || `Failed to ${isEdit ? "update" : "create"} role`);
        },
    });

    const handleSubmit = (values, { setSubmitting }) => {
        mutation.mutate(isEdit ? { ...values, _id: modal.data._id } : values);
        setSubmitting(false);
    };

    const handleCancel = () => {
        setModal({ name: null, data: null, state: false });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                        {isEdit ? <FaEdit size={16} /> : <FaShieldAlt size={16} />}
                    </div>
                    <span className="text-lg font-bold text-[#006666] block mt-1">{isEdit ? "Edit" : "Add"} Role</span>
                </div>
            }
            open={modal.state}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
            width={700}
            className="modern-modal"
            centered
        >
            <Formik
                initialValues={{
                    name: modal.data?.name || "",
                    description: modal.data?.description || "",
                    permissions: modal.data?.permissions || [],
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
                    <Form layout="vertical" onFinish={handleSubmit} className="space-y-2">
                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Role Name <span className="text-red-500">*</span></label>
                            <Input
                                name="name"
                                placeholder="Enter role name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="!h-[32px] !text-xs !rounded"
                            />
                            {errors.name && touched.name && <div className="text-red-500 text-[10px] font-medium ml-1">{errors.name}</div>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Description <span className="text-red-500">*</span></label>
                            <Input.TextArea
                                name="description"
                                placeholder="Describe role access..."
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className="!rounded !text-xs !py-1.5 !h-16"
                            />
                            {errors.description && touched.description && <div className="text-red-500 text-[10px] font-medium ml-1">{errors.description}</div>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Access Permissions</label>
                            <div className="bg-slate-50/50 p-2 rounded border border-slate-100 mt-1">
                                <PermissionsSelector
                                    selectedPermissions={values.permissions}
                                    onChange={(newPermissions) => setFieldValue("permissions", newPermissions)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                            <CustomButton label="Cancel" type="secondary" onClick={handleCancel} />
                            <CustomButton
                                label={isEdit ? "Update Role" : "Create Role"}
                                htmlType="submit"
                                loading={isSubmitting || mutation.isLoading}
                            />
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default AddEditRoleModal;
