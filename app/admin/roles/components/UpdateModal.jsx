import React, { useRef } from "react";
import { Modal, Input } from "antd";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

const UpdateRoleModal = React.memo(({ modal, setModal }) => {
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
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-400 block mt-1 transition-colors duration-300">Update Role</span>
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
                    enableReinitialize
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, setFieldValue, handleChange, handleBlur, isSubmitting }) => (
                        <Form className="space-y-2">
                            {updateRole.isPending ? (
                                <FormSkeleton fields={4} />
                            ) : (
                                <>
                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Role Definition</p>
                                        <div className="space-y-2">
                                            <FormField
                                                label="Role Title"
                                                name="name"
                                                placeholder="MODERATOR"
                                                required
                                                disabled
                                            />

                                            <div className="flex flex-col gap-1.5 mt-2">
                                                <FormField
                                                    label="Role Description"
                                                    name="description"
                                                    placeholder="Describe role access..."
                                                    type="textarea"
                                                    required
                                                />
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
                                    loading={isSubmitting || updateRole.isPending}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

UpdateRoleModal.displayName = "UpdateRoleModal";

export default UpdateRoleModal;
