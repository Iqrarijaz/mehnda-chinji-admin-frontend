"use client";
import React, { useRef, useEffect, useMemo } from "react";
import { Modal } from "antd";
import { FaUserEdit } from "react-icons/fa";
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
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                        <FaUserEdit size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">Update User Details</span>
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
                        <Form className="space-y-2">
                            {updateUser.isLoading ? (
                                <FormSkeleton fields={4} />
                            ) : (
                                <>
                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Account Info</p>
                                        <FormField label="Full Name" name="name" placeholder="Name" required className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" />
                                        <FormField label="Email Address" name="email" type="email" placeholder="Email" required className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" />
                                    </div>

                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Profile Data</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="flex flex-col gap-1.5 overflow-hidden">
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Role <span className="text-red-500">*</span></label>
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
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Gender <span className="text-red-500">*</span></label>
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
                                        <FormField label="Phone Number" name="phone" placeholder="+92 ..." className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1" />
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
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
