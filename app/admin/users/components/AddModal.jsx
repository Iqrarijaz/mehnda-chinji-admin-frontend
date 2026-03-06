"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_USER } from "@/app/api/admin/users";

const { Option } = Select;

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

import { FormSkeleton } from "@/components/shared/Skeletons";

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
            title={<span className="text-xl font-bold text-slate-900 px-2 pt-2">Add New User</span>}
            centered
            width={600}
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
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-5 relative">
                            {createUser.isLoading ? (
                                <FormSkeleton fields={5} />
                            ) : (
                                <>
                                    <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
                                        <FormField label="Full Name" name="name" placeholder="Enter full name" required />
                                        <FormField label="Email Address" name="email" type="email" placeholder="email@example.com" required />
                                        <FormField label="Password" name="password" type="password" placeholder="••••••••" required />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-700 font-semibold text-sm">Role <span className="text-red-500">*</span></label>
                                            <Select
                                                value={values.role}
                                                onChange={(val) => setFieldValue("role", val)}
                                                className="!h-[42px] !rounded-xl overflow-hidden border-2 border-slate-100"
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
                                                className="!h-[42px] !rounded-xl overflow-hidden border-2 border-slate-100"
                                                size="large"
                                            >
                                                <Option value="MALE">MALE</Option>
                                                <Option value="FEMALE">FEMALE</Option>
                                                <Option value="OTHER">OTHER</Option>
                                            </Select>
                                            {errors.gender && touched.gender && <span className="text-red-500 text-xs font-medium">{errors.gender}</span>}
                                        </div>
                                    </div>

                                    <FormField label="Phone Number" name="phone" placeholder="+92 ..." />
                                </>
                            )}

                            <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                                <Button
                                    onClick={handleCloseModal}
                                    className="!h-[44px] !px-8 !rounded-xl !border-slate-200 !text-slate-600 font-semibold hover:!border-slate-400"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={isSubmitting}
                                    className="!h-[44px] !px-8 !rounded-xl !bg-[#006666] !border-none font-bold shadow-lg shadow-teal-900/10 hover:!bg-[#004d4d] transition-all"
                                >
                                    Add User
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

export default AddUserModal;
