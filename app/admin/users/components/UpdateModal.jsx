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

import { FormSkeleton } from "@/components/shared/Skeletons";

const UpdateUserModal = React.memo(({ modal, setModal }) => {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const updateUser = useMutation({
        mutationKey: ["updateUser"],
        mutationFn: (payload) => UPDATE_USER(payload),
        onSuccess: (data) => {
            toast.success(data?.message || "User updated successfully");
            queryClient.invalidateQueries("usersList");
            queryClient.invalidateQueries("usersStatusCounts");
            setModal({ name: null, state: false, data: null });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const initialValues = React.useMemo(() => ({
        name: modal?.data?.name || "",
        email: modal?.data?.email || "",
        role: modal?.data?.role || "USER",
        phone: modal?.data?.phone || "",
        gender: modal?.data?.gender || "MALE",
    }), [modal?.data]);

    const handleSubmit = React.useCallback((values) => {
        updateUser.mutate({ _id: modal?.data?._id, ...values });
    }, [updateUser, modal?.data?._id]);

    const handleCancel = React.useCallback(() => {
        setModal({ name: null, state: false, data: null });
    }, [setModal]);

    return (
        <Modal
            title={<span className="text-xl font-bold text-slate-900 px-2 pt-1">Update User Details</span>}
            centered
            width={640}
            open={modal.name === "Update" && modal.state}
            onCancel={handleCancel}
            footer={null}
            className="modern-modal"
        >
            <div className="p-2 pt-4">
                <Formik
                    innerRef={formikRef}
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-6 relative">
                            {updateUser.isLoading ? (
                                <FormSkeleton fields={4} />
                            ) : (
                                <>
                                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
                                        <FormField
                                            label="Full Name"
                                            name="name"
                                            placeholder="Enter full name"
                                            required
                                        />
                                        <FormField
                                            label="Email Address"
                                            name="email"
                                            type="email"
                                            placeholder="email@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 font-semibold text-sm">Role <span className="text-red-500">*</span></label>
                                            <Select
                                                value={values.role}
                                                onChange={(val) => setFieldValue("role", val)}
                                                className="!h-[44px] !rounded-xl overflow-hidden border-2 border-slate-100"
                                                size="large"
                                            >
                                                <Option value="USER">USER</Option>
                                                <Option value="ADMIN">ADMIN</Option>
                                                <Option value="SUPER_ADMIN">SUPER_ADMIN</Option>
                                            </Select>
                                            {errors.role && touched.role && <span className="text-red-500 text-xs font-medium">{errors.role}</span>}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 font-semibold text-sm">Gender <span className="text-red-500">*</span></label>
                                            <Select
                                                value={values.gender}
                                                onChange={(val) => setFieldValue("gender", val)}
                                                className="!h-[44px] !rounded-xl overflow-hidden border-2 border-slate-100"
                                                size="large"
                                            >
                                                <Option value="MALE">MALE</Option>
                                                <Option value="FEMALE">FEMALE</Option>
                                                <Option value="OTHER">OTHER</Option>
                                            </Select>
                                            {errors.gender && touched.gender && <span className="text-red-500 text-xs font-medium">{errors.gender}</span>}
                                        </div>
                                    </div>

                                    <FormField
                                        label="Phone Number"
                                        name="phone"
                                        placeholder="+92 ..."
                                    />
                                </>
                            )}

                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                                <Button
                                    onClick={handleCancel}
                                    className="modal-footer-btn-secondary"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmitting}
                                    className="modal-footer-btn-primary"
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
});

export default UpdateUserModal;
