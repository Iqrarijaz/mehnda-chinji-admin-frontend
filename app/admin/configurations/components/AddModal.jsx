"use client";

import React, { useRef } from "react";
import { Modal, Button, Input, Select } from "antd";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CREATE_CONFIGURATION } from "@/app/api/admin/configurations";
import Loading from "@/animations/homePageLoader";

const { TextArea } = Input;

const validationSchema = Yup.object().shape({
    type: Yup.string().required("Type is required"),
    dataString: Yup.string()
        .required("JSON data is required")
        .test("is-json", "Invalid JSON format", (value) => {
            try {
                JSON.parse(value);
                return true;
            } catch (e) {
                return false;
            }
        }),
});

function AddConfigurationModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const createConfig = useMutation({
        mutationFn: (values) => {
            const payload = {
                type: values.type,
                data: JSON.parse(values.dataString),
                isActive: values.isActive,
            };
            return CREATE_CONFIGURATION(payload);
        },
        onSuccess: (data) => {
            toast.success(data?.message || "Configuration added successfully");
            queryClient.invalidateQueries("configurationsList");
            handleClose();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleClose = () => {
        formikRef.current?.resetForm();
        setModal({ name: null, state: false, data: null });
    };

    const initialValues = {
        type: "CITIES",
        dataString: JSON.stringify({ name: "", code: "" }, null, 2),
        isActive: true,
    };

    return (
        <Modal
            title="Add New Configuration"
            open={modal.name === "Add" && modal.state}
            onCancel={handleClose}
            footer={null}
            centered
            width={600}
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
                onSubmit={(values, { setSubmitting }) => {
                    createConfig.mutate(values);
                    setSubmitting(false);
                }}
            >
                {({ values, errors, touched, setFieldValue, isSubmitting }) => (
                    <Form>
                        <div className="form-class bg-gray-100 p-6 rounded space-y-4">
                            {createConfig.status === "loading" && <Loading />}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type (e.g. CITIES, PROFESSIONS)
                                </label>
                                <Input
                                    value={values.type}
                                    placeholder="Enter type name"
                                    className="w-full h-10"
                                    onChange={(e) => setFieldValue("type", e.target.value.toUpperCase())}
                                />
                                {errors.type && touched.type && (
                                    <p className="text-red-500 text-xs mt-1">{errors.type}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Data (JSON Object)
                                </label>
                                <TextArea
                                    rows={10}
                                    value={values.dataString}
                                    onChange={(e) => setFieldValue("dataString", e.target.value)}
                                    placeholder='e.g. { "name": "Lahore", "province": "Punjab" }'
                                    className="font-mono text-xs"
                                />
                                {errors.dataString && touched.dataString && (
                                    <p className="text-red-500 text-xs mt-1">{errors.dataString}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end mt-4 gap-6">
                            <Button onClick={handleClose} className="modal-cancel-button">
                                Cancel
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmitting}
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

export default AddConfigurationModal;
