"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { useMutation, useQuery } from "react-query";
import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";

import ProfileImage from "../../components/ProfileImage";
import { GET_TENANT, UPDATE_TENANT } from "@/app/api/admin/tenants";

const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    phone: Yup.string().required("Required"),
    country: Yup.string().required("Required"),
    state: Yup.string().required("Required"),
    city: Yup.string().required("Required"),
    address: Yup.string().required("Required"),
    zipCode: Yup.string().required("Required"),
});

const initialValues = {
    firstName: "",
    lastName: "",
    description: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    address: "",
    zipCode: "",
};

function EditTenantClient() {
    const formikRef = useRef(null);
    const params = useParams();
    const { id } = params;
    const router = useRouter();

    // Get client details from API
    const getTenant = useQuery({
        queryKey: ["getTenant", JSON.stringify(id)],
        enabled: !!id,
        queryFn: async () => {
            return await GET_TENANT(id);
        },
        onError: (error) => {
            console.error("Error fetching data:", error);
            toast.error("Something went wrong. Please try again later.");
        },
    });

    // Setting initial values for form
    useEffect(() => {
        if (!getTenant.isLoading && getTenant.data) {
            const {
                _id,
                firstName,
                lastName,
                description,
                email,
                phone,
                country,
                state,
                city,
                address,
                zipCode,
            } = getTenant.data.data;

            formikRef.current.setValues({
                _id,
                firstName,
                lastName,
                description,
                email,
                phone,
                country,
                state,
                city,
                address,
                zipCode,
            });
        }
    }, [getTenant.data, getTenant.isLoading]);

    // Mutation for updating tenant
    const updateTenant = useMutation({
        mutationKey: ["updateTenant"],
        mutationFn: async (values) => {
            return await UPDATE_TENANT(values);
        },
        onSuccess: (data) => {
            router.push("/admin/users/tenants");
            toast.success(data?.message);
        },
        onError: (error) => {
            console.log(error);
            toast.error(error?.response?.data?.error);
        },
    });

    // Function to handle submit form for update client request
    function handleUpdateTenant(values) {
        try {
            updateTenant.mutate(values);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    }

    return (
        <div>
            <div className="mb-4 flex justify-between">
                <h1 className="inner-page-title text-3xl text-black p-0">
                    Edit Tenant
                </h1>
            </div>

            <Formik
                innerRef={formikRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleUpdateTenant}
            >
                {({ errors, touched, values, setFieldValue }) => (
                    <div className=" ">
                        <Form>
                            <div className="form-class mx-auto gap-6 relative  bg-gray-100 p-6 rounded">
                                {getTenant?.status === "loading" && <Loading />}
                                {updateTenant?.status === "loading" && <Loading />}
                                <div className=" bg-white w-full p-6 rounded">
                                    <div className="upload-image-div">
                                        <ProfileImage />
                                    </div>
                                    <FormField label="First Name" name="firstName" />
                                    <FormField label="Last Name" name="lastName" />
                                </div>
                                <div className="">
                                    <FormField label="Email" name="email" />
                                    <FormField label="Phone" name="phone" />
                                    <FormField label="Address" name="address" />
                                    <FormField label="City" name="city" />
                                </div>
                                <div className="">
                                    <FormField label="State" name="state" />
                                    <FormField label="Zip Code" name="zipCode" />
                                    <FormField label="Country" name="country" />
                                </div>
                            </div>
                            <div className="flex justify-end mt-8 gap-6">
                                <Link
                                    href="/admin/users/tenants"
                                    className="bg-lightBlue h-9 flex items-center  hover:bg-white border-lightBlue hover:text-red-500 hover:border-red-500 text-white font-bold py-2 px-10 rounded"
                                >
                                    Cancel
                                </Link>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="bg-lightBlue hover:bg-white border-lightBlue hover:text-black !hover:border-black text-white font-bold py-4 px-10 rounded"
                                >
                                    Update
                                </Button>
                            </div>
                        </Form>
                    </div>
                )}
            </Formik>
        </div>
    );
}

export default EditTenantClient;
