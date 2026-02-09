"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select } from "antd";
import { useMutation } from "react-query";
import { toast } from "react-toastify";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_CATEGORY } from "@/app/api/admin/categories";
import { useQueryClient } from "react-query";
import SelectBox from "@/components/SelectBox";

const { Option } = Select;

// Validation schema
const validationSchema = Yup.object().shape({
    name_en: Yup.string().required("Required"),
    name_ur: Yup.string().required("Required"),
    type: Yup.string().oneOf(["PLACES", "SERVICES"]).required("Required"),
});

// Initial values
const initialValues = {
    name_en: "",
    name_ur: "",
    type: "PLACES",
};

function AddBusinessCategoryModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const createBusinessCategory = useMutation({
        mutationKey: ["createBusinessCategory"],
        mutationFn: CREATE_CATEGORY,
        onSuccess: (data) => {
            toast.success(data?.message || "Category added successfully");

            // Invalidate all queries that start with "categoriesList"
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "categoriesList",
            });
            handleCloseModal();
        },

        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = (values) => {
        createBusinessCategory.mutate(values);
    };

    const handleCloseModal = () => {
        formikRef.current?.resetForm();
        setModal({ name: null, state: false, data: null });
    };

    // Reset form when modal closes
    useEffect(() => {
        if (!modal.state) {
            formikRef.current?.resetForm();
        }
    }, [modal.state]);

    return (
        <Modal
            title="Add Category"
            className="!rounded"
            centered
            width={600}
            open={modal?.name === "Add" && modal?.state}
            onCancel={handleCloseModal}
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
                {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                    <Form>
                        <div className="form-class bg-gray-100 p-6 rounded">
                            {createBusinessCategory.status === "loading" && <Loading />}
                            <FormField label="Name English" name="name_en" />
                            <FormField label="Name Urdu" name="name_ur" />

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <SelectBox options={["PLACES", "SERVICES"]} handleChange={(value) => setFieldValue("type", value)} defaultValue={values.type} className="custom-select-no-focus" />
                                {errors.type && touched.type && (
                                    <div className="text-red-500 text-sm mt-1">{errors.type}</div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end mt-4 gap-6">
                            <Button
                                onClick={handleCloseModal}
                                className="modal-cancel-button"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmitting && createBusinessCategory.status !== "error"}
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

export default AddBusinessCategoryModal;