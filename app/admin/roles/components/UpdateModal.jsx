import React, { useRef } from "react";
import { Modal, Input } from "antd";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaUserShield, FaAlignLeft } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_ROLE } from "@/app/api/admin/roles";
import PermissionsSelector from "./PermissionsSelector";

// Validation schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Role title is required"),
    description: Yup.string().required("Role description is required"),
});

function UpdateRoleModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const updateRole = useMutation({
        mutationKey: ["updateRole"],
        mutationFn: UPDATE_ROLE,
        onSuccess: (data) => {
            toast.success(data?.message || "Role updated successfully");
            queryClient.invalidateQueries("rolesList");
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const initialValues = {
        name: modal?.data?.name || "",
        description: modal?.data?.description || "",
        permissions: modal?.data?.permissions || [],
    };

    const handleSubmit = (values) => {
        updateRole.mutate({ ...values, _id: modal?.data?._id });
    };

    const handleCloseModal = () => {
        setModal({ name: null, state: false, data: null });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaUserShield size={18} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-slate-900 block">Edit Role</span>
                        <span className="text-xs text-slate-500 font-normal">Modify access levels and description</span>
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
                    innerRef={formikRef}
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, setFieldValue, handleChange, handleBlur, isSubmitting }) => (
                        <Form className="space-y-4">
                            {updateRole.isLoading ? (
                                <FormSkeleton fields={4} />
                            ) : (
                                <>
                                    <div className="modal-section bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Role Definition</p>
                                        <div className="space-y-3">
                                            <FormField
                                                label="Role Title"
                                                name="name"
                                                placeholder="Role name"
                                                required
                                                className="!h-[36px] !text-sm"
                                                icon={<FaUserShield className="opacity-20" size={12} />}
                                            />

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-slate-700 font-semibold text-xs">Role Description <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <FaAlignLeft className="absolute top-2.5 left-3 text-slate-300 pointer-events-none" size={12} />
                                                    <Input.TextArea
                                                        name="description"
                                                        placeholder="Explain what this role allows..."
                                                        value={values.description}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        rows={2}
                                                        className="!pl-9 !rounded-lg !border-2 !border-slate-100 focus:!border-[#006666] !py-2 !text-sm"
                                                    />
                                                </div>
                                                {touched.description && errors.description && (
                                                    <div className="text-red-500 text-[10px] font-medium">{errors.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-section !mb-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Access Permissions</p>
                                        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                            <PermissionsSelector
                                                selectedPermissions={values.permissions}
                                                onChange={(newPermissions) => setFieldValue("permissions", newPermissions)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleCloseModal}
                                />
                                <CustomButton
                                    label="Save Changes"
                                    htmlType="submit"
                                    loading={isSubmitting || updateRole.isLoading}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default UpdateRoleModal;
