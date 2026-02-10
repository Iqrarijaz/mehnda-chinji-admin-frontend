"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_BLOOD_DONOR } from "@/app/api/admin/blood-donors";

const { Option } = Select;

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Validation schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    bloodGroup: Yup.string().required("Blood group is required"),
    phone: Yup.string().required("Phone is required"),
    city: Yup.string().required("City is required"),
    userId: Yup.string().required("User ID is required"),
});

// Initial values
const initialValues = {
    name: "",
    bloodGroup: "",
    phone: "",
    city: "",
    village: "",
    userId: "",
    available: true
};

function AddDonorModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const createDonor = useMutation({
        mutationKey: ["createDonor"],
        mutationFn: CREATE_BLOOD_DONOR,
        onSuccess: (data) => {
            toast.success(data?.message || "Donor added successfully");
            queryClient.invalidateQueries("bloodDonorsList");
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = (values) => {
        createDonor.mutate(values);
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
            title="Add Blood Donor"
            centered
            width={600}
            open={modal?.name === "Add" && modal?.state}
            onCancel={handleCloseModal}
            footer={null}
        >
            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                    <Form className="space-y-4">
                        {createDonor.status === "loading" && <Loading />}

                        <FormField label="Full Name" name="name" required />
                        <FormField label="User ID (Mongoose ObjectID)" name="userId" required />

                        <div className="flex flex-col gap-1">
                            <label className="text-black font-semibold">Blood Group <span className="text-red-500">*</span></label>
                            <Select
                                value={values.bloodGroup}
                                onChange={(val) => setFieldValue("bloodGroup", val)}
                                size="large"
                                placeholder="Select Blood Group"
                            >
                                {bloodGroups.map(bg => (
                                    <Option key={bg} value={bg}>{bg}</Option>
                                ))}
                            </Select>
                            {errors.bloodGroup && touched.bloodGroup && <span className="text-red-500 text-sm">{errors.bloodGroup}</span>}
                        </div>

                        <FormField label="Phone" name="phone" required />
                        <FormField label="City" name="city" required />
                        <FormField label="Village" name="village" />

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button onClick={handleCloseModal}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmitting}
                                className="bg-primary hover:bg-primary/90"
                            >
                                Add Donor
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}

export default AddDonorModal;
