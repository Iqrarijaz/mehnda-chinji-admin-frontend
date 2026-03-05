"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_BUSINESS } from "@/app/api/admin/business";

const { Option } = Select;

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Business name is required"),
    userId: Yup.string().required("User ID is required"),
    categoryEn: Yup.string(),
    description: Yup.string(),
    phone: Yup.string(),
    address: Yup.string(),
});

const initialValues = {
    name: "",
    userId: "",
    categoryEn: "",
    categoryUr: "",
    description: "",
    phone: "",
    address: "",
};

function AddBusinessModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const createMutation = useMutation({
        mutationFn: CREATE_BUSINESS,
        onSuccess: (data) => {
            toast.success(data?.message || "Business created successfully");
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "businessList",
            });
            queryClient.invalidateQueries("businessStatusCounts");
            handleClose();
        },
        onError: (error) => {
            toast.error(
                error?.response?.data?.message || "Something went wrong"
            );
        },
    });

    const handleSubmit = (values) => {
        createMutation.mutate(values);
    };

    const handleClose = () => {
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
            title="Add Business"
            className="!rounded"
            centered
            width={680}
            open={modal?.name === "Add" && modal?.state}
            onCancel={handleClose}
            footer={null}
            afterClose={() => formikRef.current?.resetForm()}
        >
            <div className="mb-4 flex justify-end">
                <Button
                    className="reset-button"
                    onClick={() => formikRef.current?.resetForm()}
                >
                    Reset
                </Button>
            </div>

            <Formik
                innerRef={formikRef}
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
                            <div className="col-span-2">
                                <FormField label="User ID *" name="userId" placeholder="MongoDB User ObjectId" />
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
                            <Button onClick={handleClose} className="modal-cancel-button">
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={createMutation.isLoading}
                                className="modal-add-button"
                            >
                                Add
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}

export default AddBusinessModal;
