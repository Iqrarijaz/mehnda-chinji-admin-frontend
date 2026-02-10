"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_BLOOD_DONOR } from "@/app/api/admin/blood-donors";

const { Option } = Select;

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    bloodGroup: Yup.string().required("Blood group is required"),
    phone: Yup.string().required("Phone is required"),
    city: Yup.string().required("City is required"),
});

function UpdateDonorModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const updateDonor = useMutation({
        mutationKey: ["updateDonor"],
        mutationFn: (payload) => UPDATE_BLOOD_DONOR(payload),
        onSuccess: (data) => {
            toast.success(data?.message || "Donor updated successfully");
            queryClient.invalidateQueries("bloodDonorsList");
            setModal({ name: null, state: false, data: null });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const initialValues = {
        name: modal?.data?.name || "",
        bloodGroup: modal?.data?.bloodGroup || "",
        phone: modal?.data?.phone || "",
        city: modal?.data?.city || "",
        village: modal?.data?.village || "",
        available: modal?.data?.available ?? true
    };

    const handleSubmit = (values) => {
        updateDonor.mutate({ _id: modal?.data?._id, ...values });
    };

    return (
        <Modal
            title="Update Blood Donor"
            centered
            width={600}
            open={modal.name === "Update" && modal.state}
            onCancel={() => setModal({ name: null, state: false, data: null })}
            footer={null}
        >
            <Formik
                innerRef={formikRef}
                enableReinitialize
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                    <Form className="space-y-4">
                        {updateDonor.status === "loading" && <Loading />}

                        <FormField label="Full Name" name="name" required />

                        <div className="flex flex-col gap-1">
                            <label className="text-black font-semibold">Blood Group <span className="text-red-500">*</span></label>
                            <Select
                                value={values.bloodGroup}
                                onChange={(val) => setFieldValue("bloodGroup", val)}
                                size="large"
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
                            <Button onClick={() => setModal({ name: null, state: false, data: null })}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmitting}
                                className="bg-primary hover:bg-primary/90"
                            >
                                Update Donor
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}

export default UpdateDonorModal;
