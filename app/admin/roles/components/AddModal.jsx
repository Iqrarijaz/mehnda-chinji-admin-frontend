"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Input } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaUserShield, FaAlignLeft, FaCheckSquare } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_ROLE } from "@/app/api/admin/roles";
import PermissionsSelector from "./PermissionsSelector";

// Validation schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Role title is required"),
    description: Yup.string().required("Role description is required"),
});

// Initial values
const initialValues = {
    name: "",
    description: "",
    permissions: [],
};

function AddRoleModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const createRole = useMutation({
        mutationKey: ["createRole"],
        mutationFn: CREATE_ROLE,
        onSuccess: (data) => {
            toast.success(data?.message || "Role created successfully");
            queryClient.invalidateQueries("rolesList");
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = (values) => {
        createRole.mutate({
            ...values,
            name: values.name.toUpperCase()
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
            title={
                <div className="flex items-center gap-3 px-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaUserShield size={18} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 block">Create New Role</span>
                        <span className="text-xs text-slate-500 font-normal">Define access levels and permissions</span>
                    </div>
                </div>
            }
            centered
            width={720}
            open={modal?.name === "Add" && modal?.state}
            onCancel={handleCloseModal}
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
                    {({ values, errors, touched, setFieldValue, handleChange, handleBlur, isSubmitting }) => (
                        <Form className="space-y-6">
                            {createRole.status === "loading" && <Loading />}

                            <div className="modal-section">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Role Definition</p>
                                <div className="space-y-4">
                                    <FormField
                                        label="Role Title"
                                        name="name"
                                        placeholder="e.g. MODERATOR"
                                        required
                                        icon={<FaUserShield className="opacity-30" />}
                                    />

                                    <div className="flex flex-col gap-2">
                                        <label className="text-slate-700 font-semibold text-sm">Role Description <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <FaAlignLeft className="absolute top-4 left-4 text-slate-300 pointer-events-none" />
                                            <Input.TextArea
                                                name="description"
                                                placeholder="Explain what this role allows users to do..."
                                                value={values.description}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                rows={3}
                                                className="!pl-11 !rounded-2xl !border-2 !border-slate-100 focus:!border-teal-500 !py-3"
                                            />
                                        </div>
                                        {touched.description && errors.description && (
                                            <div className="text-red-500 text-xs font-medium">{errors.description}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="modal-section !mb-0">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Access Permissions</p>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                    <PermissionsSelector
                                        selectedPermissions={values.permissions}
                                        onChange={(newPermissions) => setFieldValue("permissions", newPermissions)}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                                <Button
                                    onClick={handleCloseModal}
                                    className="modal-footer-btn-secondary"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={createRole.isLoading || isSubmitting}
                                    className="modal-footer-btn-primary"
                                >
                                    Create Role
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default AddRoleModal;
