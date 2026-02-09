"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Input } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_ROLE } from "@/app/api/admin/roles";
import PermissionsSelector from "./PermissionsSelector";

// Validation schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Role name is required"),
    description: Yup.string().required("Description is required"),
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
            title="Update Role"
            className="!rounded"
            centered
            width={800}
            open={modal?.name === "Edit" && modal?.state}
            onCancel={handleCloseModal}
            footer={null}
        >
            <div className="mb-4 flex justify-end">
                <Button
                    className="reset-button"
                    onClick={() => formikRef.current?.resetForm({ values: initialValues })}
                >
                    Reset
                </Button>
            </div>

            <Formik
                innerRef={formikRef}
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, setFieldValue, handleChange, handleBlur }) => (
                    <Form>
                        <div className="bg-gray-100 p-4 rounded max-h-[60vh] overflow-y-auto">
                            {updateRole.status === "loading" && <Loading />}

                            {/* Name */}
                            <FormField
                                label="Role Name"
                                name="name"
                                placeholder="Enter role name"
                                required
                            />

                            {/* Description */}
                            <div className="mb-3">
                                <label className="text-black font-[500] mb-1 block">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <Input.TextArea
                                    name="description"
                                    placeholder="Enter description"
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    rows={2}
                                    className="w-full"
                                />
                                {touched.description && errors.description && (
                                    <div className="text-red-500 text-sm mt-1">{errors.description}</div>
                                )}
                            </div>

                            {/* Permissions */}
                            <div className="mb-3">
                                <label className="text-black font-[500] mb-2 block">Permissions</label>
                                <PermissionsSelector
                                    selectedPermissions={values.permissions}
                                    onChange={(newPermissions) => setFieldValue("permissions", newPermissions)}
                                />
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end mt-4 gap-4">
                            <Button onClick={handleCloseModal} className="modal-cancel-button">
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={updateRole.isLoading}
                                className="modal-add-button"
                            >
                                Update
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}

export default UpdateRoleModal;
