"use client";
import React, { useRef, useEffect, useMemo } from "react";
import { Modal } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import { UPDATE_USER } from "@/app/api/admin/users";
import FormField from "@/components/InnerPage/FormField";
import { FormSkeleton } from "@/components/shared/Skeletons";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string().required("Role is required"),
    gender: Yup.string().required("Gender is required"),
});

const UpdateUserModal = React.memo(({ modal, setModal }) => {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const initialValues = useMemo(() => ({
        name: modal.data?.name || "",
        email: modal.data?.email || "",
        role: modal.data?.role || "USER",
        gender: modal.data?.gender || "MALE",
        phone: modal.data?.phone || "",
    }), [modal.data]);

    const updateUser = useMutation({
        mutationKey: ["updateUser"],
        mutationFn: UPDATE_USER,
        onSuccess: (data) => {
            toast.success(data?.message || "User updated successfully");
            queryClient.invalidateQueries("usersList");
            queryClient.invalidateQueries("usersStatusCounts");
            handleCancel();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = (values) => {
        updateUser.mutate({ _id: modal.data?._id, ...values });
    };

    const handleCancel = () => {
        setModal({ name: null, data: null, state: false });
    };

    useEffect(() => {
        if (!modal.state) {
            formikRef.current?.resetForm();
        }
    }, [modal.state]);

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <UserOutlined style={{ fontSize: '18px' }} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-900 block">Update User Details</span>
                        <span className="text-xs text-slate-500 font-normal">Modify profile information and account role</span>
                    </div>
                </div>
            }
            centered
            width={600}
            open={modal.name === "Update" && modal.state}
            onCancel={handleCancel}
            footer={null}
            className="modern-modal"
        >
            <div className="p-1">
                <Formik
                    innerRef={formikRef}
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-4">
                            {updateUser.isLoading ? (
                                <FormSkeleton fields={4} />
                            ) : (
                                <>
                                    <div className="modal-section bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Info</p>
                                        <FormField label="Full Name" name="name" placeholder="Enter full name" required className="!h-[36px] !text-sm" />
                                        <FormField label="Email Address" name="email" type="email" placeholder="email@example.com" required className="!h-[36px] !text-sm" />
                                    </div>

                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Profile Data</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-slate-700 font-semibold text-xs">Role <span className="text-red-500">*</span></label>
                                                <SelectBox
                                                    value={values.role}
                                                    handleChange={(val) => setFieldValue("role", val)}
                                                    options={[
                                                        { value: "USER", label: "USER" },
                                                        { value: "ADMIN", label: "ADMIN" },
                                                        { value: "SUPER_ADMIN", label: "SUPER_ADMIN" }
                                                    ]}
                                                    className="modern-select-box [&>div]:!h-[36px] [&>div]:!rounded-lg [&>div]:!text-sm"
                                                />
                                                {errors.role && touched.role && <span className="text-red-500 text-[10px] font-medium">{errors.role}</span>}
                                            </div>

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-slate-700 font-semibold text-xs">Gender <span className="text-red-500">*</span></label>
                                                <SelectBox
                                                    value={values.gender}
                                                    handleChange={(val) => setFieldValue("gender", val)}
                                                    options={[
                                                        { value: "MALE", label: "MALE" },
                                                        { value: "FEMALE", label: "FEMALE" },
                                                        { value: "OTHER", label: "OTHER" }
                                                    ]}
                                                    className="modern-select-box [&>div]:!h-[36px] [&>div]:!rounded-lg [&>div]:!text-sm"
                                                />
                                                {errors.gender && touched.gender && <span className="text-red-500 text-[10px] font-medium">{errors.gender}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <FormField label="Phone Number" name="phone" placeholder="+92 ..." className="!h-[36px] !text-sm" />
                                </>
                            )}

                            <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleCancel}
                                />
                                <CustomButton
                                    label="Save Changes"
                                    htmlType="submit"
                                    loading={isSubmitting || updateUser.isLoading}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

export default UpdateUserModal;
