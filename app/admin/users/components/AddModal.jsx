"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_USER } from "@/app/api/admin/users";

const { Option } = Select;

// Validation schema
const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    role: Yup.string().required("Role is required"),
    gender: Yup.string().required("Gender is required"),
});

// Initial values
const initialValues = {
    name: "",
    email: "",
    password: "",
    role: "USER",
    phone: "",
    gender: "MALE",
};

function AddUserModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const createUser = useMutation({
        mutationKey: ["createUser"],
        mutationFn: CREATE_USER,
        onSuccess: (data) => {
            toast.success(data?.message || "User added successfully");
            queryClient.invalidateQueries("usersList");
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = (values) => {
        createUser.mutate(values);
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
            title="Add User"
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
                        {createUser.status === "loading" && <Loading />}

                        <FormField label="Full Name" name="name" required />
                        <FormField label="Email" name="email" type="email" required />
                        <FormField label="Password" name="password" type="password" required />

                        <div className="flex flex-col gap-1">
                            <label className="text-black font-semibold">Role <span className="text-red-500">*</span></label>
                            <Select
                                value={values.role}
                                onChange={(val) => setFieldValue("role", val)}
                                size="large"
                            >
                                <Option value="USER">USER</Option>
                                <Option value="ADMIN">ADMIN</Option>
                                <Option value="SUPER_ADMIN">SUPER_ADMIN</Option>
                            </Select>
                            {errors.role && touched.role && <span className="text-red-500 text-sm">{errors.role}</span>}
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-black font-semibold">Gender <span className="text-red-500">*</span></label>
                            <Select
                                value={values.gender}
                                onChange={(val) => setFieldValue("gender", val)}
                                size="large"
                            >
                                <Option value="MALE">MALE</Option>
                                <Option value="FEMALE">FEMALE</Option>
                                <Option value="OTHER">OTHER</Option>
                            </Select>
                            {errors.gender && touched.gender && <span className="text-red-500 text-sm">{errors.gender}</span>}
                        </div>

                        <FormField label="Phone" name="phone" />

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button onClick={handleCloseModal}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isSubmitting}
                                className="bg-primary hover:bg-primary/90"
                            >
                                Add User
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}

export default AddUserModal;
