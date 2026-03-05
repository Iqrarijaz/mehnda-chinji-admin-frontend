"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_BUSINESS } from "@/app/api/admin/business";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Business name is required"),
    categoryEn: Yup.string(),
    categoryUr: Yup.string(),
    description: Yup.string(),
    phone: Yup.string(),
    address: Yup.string(),
});

function UpdateBusinessModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const updateMutation = useMutation({
        mutationFn: UPDATE_BUSINESS,
        onSuccess: (data) => {
            toast.success(data?.message || "Business updated successfully");
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "businessList",
            });
            queryClient.invalidateQueries("businessStatusCounts");
            setModal({ name: null, state: false, data: null });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const initialValues = {
        name: modal?.data?.name || "",
        categoryEn: modal?.data?.categoryEn || "",
        categoryUr: modal?.data?.categoryUr || "",
        description: modal?.data?.description || "",
        phone: modal?.data?.phone || "",
        address: modal?.data?.address || "",
    };

    const handleSubmit = (values) => {
        updateMutation.mutate({ _id: modal?.data?._id, ...values });
    };

    return (
        <Modal
            title="Update Business"
            className="!rounded"
            centered
            width={680}
            open={modal?.name === "Update" && modal?.state}
            onCancel={() => setModal({ name: null, state: false, data: null })}
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
                {({ isSubmitting }) => (
                    <Form>
                        <div className="form-class bg-gray-100 p-6 rounded grid grid-cols-2 gap-x-4">
                            <div className="col-span-2">
                                <FormField label="Business Name *" name="name" />
                            </div>
                            <FormField label="Category (English)" name="categoryEn" />
                            <FormField label="Category (Urdu)" name="categoryUr" />
                            <FormField label="Phone" name="phone" />
                            <FormField label="Address" name="address" />
                            <div className="col-span-2">
                                <FormField label="Description" name="description" />
                            </div>
                        </div>

                        <div className="flex justify-end mt-4 gap-4">
                            <Button
                                onClick={() => setModal({ name: null, state: false, data: null })}
                                className="modal-cancel-button"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={updateMutation.isLoading}
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

export default UpdateBusinessModal;
