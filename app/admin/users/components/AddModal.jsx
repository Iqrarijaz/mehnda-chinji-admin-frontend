"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { UserOutlined } from "@ant-design/icons";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_USER } from "@/app/api/admin/users";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";
import { FormSkeleton } from "@/components/shared/Skeletons";

// Validation schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    role: Yup.string().required("Role is required"),
    gender: Yup.string().required("Gender is required"),
});

// Initial values
const initialValues = {
    name: "",
    email: "",
    password: "",
    role: "USER",
    phone: "",
    gender: "MALE",
};

const AddUserModal = React.memo(({ modal, setModal }) => {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const createUser = useMutation({
        mutationKey: ["createUser"],
        mutationFn: CREATE_USER,
        onSuccess: (data) => {
            toast.success(data?.message || "User added successfully");
            queryClient.invalidateQueries("usersList");
            queryClient.invalidateQueries("usersStatusCounts");
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = React.useCallback((values) => {
        createUser.mutate(values);
    }, [createUser]);

    const handleCloseModal = React.useCallback(() => {
        formikRef.current?.resetForm();
        setModal({ name: null, state: false, data: null });
    }, [setModal]);

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
                        <span className="text-lg font-bold text-slate-900 block">Add New User</span>
                        <span className="text-xs text-slate-500 font-normal">Create a new application user account</span>
                    </div>
                </div>
            }
            centered
            width={600}
            open={modal?.name === "Add" && modal?.state}
            onCancel={handleCloseModal}
            footer={null}
            className="modern-modal"
        >
            <div className="p-1">
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-4">
                            {createUser.isLoading ? (
                                <FormSkeleton fields={5} />
                            ) : (
                                <>
                                    <div className="modal-section bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Info</p>
                                        <FormField label="Full Name" name="name" placeholder="Enter full name" required className="!h-[36px] !text-sm" />
                                        <FormField label="Email Address" name="email" type="email" placeholder="email@example.com" required className="!h-[36px] !text-sm" />
                                        <FormField label="Password" name="password" type="password" placeholder="••••••••" required className="!h-[36px] !text-sm" />
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
                                    onClick={handleCloseModal}
                                />
                                <CustomButton
                                    label="Add User"
                                    htmlType="submit"
                                    loading={isSubmitting || createUser.isLoading}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

export default AddUserModal;
