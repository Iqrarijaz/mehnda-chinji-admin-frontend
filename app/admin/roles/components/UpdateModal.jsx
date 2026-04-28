import React, { useRef } from "react";
import { Modal, Input } from "antd";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaEdit, FaAlignLeft } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_ROLE } from "@/app/api/admin/roles";
import { ADMIN_KEYS } from "@/constants/queryKeys";
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
            queryClient.invalidateQueries([ADMIN_KEYS.ROLES.LIST]);
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Something went wrong");
        },
    });

    const initialValues = {
        name: modal?.data?.name || "",
        description: modal?.data?.description || "",
        permissions: modal?.data?.permissions || [],
        isDeleted: modal?.data?.isDeleted ?? false,
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
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-[#006666] dark:text-teal-400 transition-colors duration-300">
                        <FaEdit size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-400 block mt-1 transition-colors duration-300">Edit Role</span>
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
                    innerRef={formikRef}
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, setFieldValue, handleChange, handleBlur, isSubmitting }) => (
                        <Form className="space-y-2">
                            {updateRole.isLoading ? (
                                <FormSkeleton fields={4} />
                            ) : (
                                <>
                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Role Definition</p>
                                        <div className="space-y-2">
                                            <FormField
                                                label="Role Title"
                                                name="name"
                                                placeholder="Role name"
                                                required
                                                className="!h-[32px] !text-xs !rounded"
                                                labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                                            />

                                            <div className="flex flex-col gap-1.5 ">
                                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight ml-1 transition-colors duration-300">Role Description <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <Input.TextArea
                                                        name="description"
                                                        placeholder="Describe role access..."
                                                        value={values.description}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className="!rounded !border-slate-100 dark:!border-slate-800 !bg-white dark:!bg-slate-900 !text-slate-700 dark:!text-slate-200 focus:!border-[#006666] !py-1 !text-xs !h-16 transition-all duration-300"
                                                    />
                                                </div>
                                                {touched.description && errors.description && (
                                                    <div className="text-red-500 text-[10px] font-medium ml-1 mt-1">{errors.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-section !mb-0 transition-colors duration-300">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">Access Permissions</p>
                                        <div className="bg-slate-50/50 dark:bg-slate-900/30 p-2 rounded border border-slate-100 dark:border-slate-800 mt-1 transition-colors duration-300">
                                            <PermissionsSelector
                                                selectedPermissions={values.permissions}
                                                onChange={(newPermissions) => setFieldValue("permissions", newPermissions)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 transition-colors duration-300">
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
