"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaUserPlus } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_USER } from "@/app/api/admin/users";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";
import { FormSkeleton } from "@/components/shared/Skeletons";
import { ADMIN_KEYS } from "@/constants/queryKeys";

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
            queryClient.invalidateQueries([ADMIN_KEYS.USERS.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.USERS.COUNTS]);
            handleCloseModal(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Something went wrong");
        },
    });

    const handleSubmit = React.useCallback((values) => {
        createUser.mutate(values);
    }, [createUser]);

    const handleCloseModal = React.useCallback((force = false) => {
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
    }, [setModal]);

    useEffect(() => {
        if (!modal.state) {
            formikRef.current?.resetForm();
        }
    }, [modal.state]);

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-[#006666] dark:text-teal-400 transition-colors duration-300">
                        <FaUserPlus size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-500 block mt-1 transition-colors duration-300">Add New User</span>
                    </div>
                </div>
            }
            centered
            width={600}
            open={modal?.name === "Add" && modal?.state}
            onCancel={() => handleCloseModal(false)}
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
                        <Form className="space-y-2">
                            {createUser.isLoading ? (
                                <FormSkeleton fields={5} />
                            ) : (
                                <>
                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">Account Info</p>
                                        <FormField label="Full Name" name="name" placeholder="Name" required className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1 transition-colors duration-300" />
                                        <FormField label="Email Address" name="email" type="email" placeholder="Email" required className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1 transition-colors duration-300" />
                                        <FormField label="Password" name="password" type="password" placeholder="••••••••" required className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1 transition-colors duration-300" />
                                    </div>

                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">Profile Data</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex flex-col gap-1.5 overflow-hidden">
                                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight ml-1 transition-colors duration-300">Role <span className="text-red-500">*</span></label>
                                                <SelectBox
                                                    value={values.role}
                                                    handleChange={(val) => setFieldValue("role", val)}
                                                    options={[
                                                        { value: "USER", label: "USER" },
                                                        { value: "ADMIN", label: "ADMIN" },
                                                        { value: "SUPER_ADMIN", label: "SUPER_ADMIN" }
                                                    ]}
                                                    className="modern-select-box"
                                                />
                                                {errors.role && touched.role && <span className="text-red-500 text-[10px] font-medium ml-1">{errors.role}</span>}
                                            </div>

                                            <div className="flex flex-col gap-1.5 overflow-hidden">
                                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight ml-1 transition-colors duration-300">Gender <span className="text-red-500">*</span></label>
                                                <SelectBox
                                                    value={values.gender}
                                                    handleChange={(val) => setFieldValue("gender", val)}
                                                    options={[
                                                        { value: "MALE", label: "MALE" },
                                                        { value: "FEMALE", label: "FEMALE" },
                                                        { value: "OTHER", label: "OTHER" }
                                                    ]}
                                                    className="modern-select-box"
                                                />
                                                {errors.gender && touched.gender && <span className="text-red-500 text-[10px] font-medium ml-1">{errors.gender}</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-1 mt-2 mb-2">
                                        <FormField label="Phone Number" name="phone" placeholder="+92 ..." className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1 transition-colors duration-300" />
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 transition-colors">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={() => handleCloseModal(false)}
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
