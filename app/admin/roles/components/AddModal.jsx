import React, { useRef, useEffect } from "react";
import { Modal, Input } from "antd";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaShieldAlt, FaAlignLeft, FaCheckSquare } from "react-icons/fa";
import CustomButton from "@/components/shared/CustomButton";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
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
    isDeleted: false,
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
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                        <FaShieldAlt size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">Create New Role</span>
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
                    {({ values, errors, touched, setFieldValue, handleChange, handleBlur, isSubmitting }) => (
                        <Form className="space-y-2">
                            {createRole.isLoading ? (
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
                                                className="!h-[32px] !text-xs !rounded"
                                                labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                                            />

                                            <div className="flex flex-col gap-1.5">
                                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Role Description <span className="text-red-500">*</span></label>
                                                <div className="relative">
                                                    <Input.TextArea
                                                        name="description"
                                                        placeholder="Describe role access..."
                                                        value={values.description}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className="!rounded !border-slate-100 focus:!border-[#006666] !py-1 !text-xs !h-16"
                                                    />
                                                </div>
                                                {touched.description && errors.description && (
                                                    <div className="text-red-500 text-[10px] font-medium ml-1">{errors.description}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-section !mb-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Access Permissions</p>
                                        <div className="bg-slate-50/50 p-2 rounded border border-slate-100 mt-1">
                                            <PermissionsSelector
                                                selectedPermissions={values.permissions}
                                                onChange={(newPermissions) => setFieldValue("permissions", newPermissions)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleCloseModal}
                                />
                                <CustomButton
                                    label="Create Role"
                                    htmlType="submit"
                                    loading={createRole.isLoading || isSubmitting}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default AddRoleModal;
