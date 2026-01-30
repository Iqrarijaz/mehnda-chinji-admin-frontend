"use client";
import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { Formik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CREATE_ROLE, UPDATE_ROLE } from "@/app/api/admin/roles";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Role name is required"),
    description: Yup.string().required("Description is required"),
});

const AddEditRoleModal = ({ modal, setModal }) => {
    const queryClient = useQueryClient();
    const isEdit = modal.name === "Edit";

    const mutation = useMutation(isEdit ? UPDATE_ROLE : CREATE_ROLE, {
        onSuccess: () => {
            queryClient.invalidateQueries("rolesList");
            toast.success(`Role ${isEdit ? "updated" : "created"} successfully`);
            handleCancel();
        },
        onError: () => {
            toast.error(`Failed to ${isEdit ? "update" : "create"} role`);
        },
    });

    const handleSubmit = (values, { setSubmitting }) => {
        mutation.mutate(isEdit ? { ...values, _id: modal.data._id } : values);
        setSubmitting(false);
    };

    const handleCancel = () => {
        setModal({ name: null, data: null, state: false });
    };

    return (
        <Modal
            title={`${isEdit ? "Edit" : "Add"} Role`}
            open={modal.state}
            onCancel={handleCancel}
            footer={null}
            destroyOnClose
        >
            <Formik
                initialValues={{
                    name: modal.data?.name || "",
                    description: modal.data?.description || "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <Form layout="vertical" onFinish={handleSubmit}>
                        <Form.Item
                            label="Role Name"
                            validateStatus={errors.name && touched.name ? "error" : ""}
                            help={errors.name && touched.name ? errors.name : ""}
                        >
                            <Input
                                name="name"
                                placeholder="Enter role name"
                                value={values.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            validateStatus={errors.description && touched.description ? "error" : ""}
                            help={errors.description && touched.description ? errors.description : ""}
                        >
                            <Input.TextArea
                                name="description"
                                placeholder="Enter description"
                                value={values.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                rows={4}
                            />
                        </Form.Item>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button onClick={handleCancel}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmitting || mutation.isLoading}
                                className="bg-[#0F172A]"
                            >
                                {isEdit ? "Update" : "Create"}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default AddEditRoleModal;
