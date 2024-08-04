"use client";
import FormField from "@/components/InnerPage/FormField";
import { Button } from "antd";
import { Formik, Form } from "formik";
import React, { useRef } from "react";
import * as Yup from "yup";
import Link from "next/link";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import Loading from "@/animations/homePageLoader";
import { useRouter } from "next/navigation";
import ProfileImage from "../components/ProfileImage";
import { CREATE_TENANT } from "@/app/api/admin/tenants";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  phone: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
  country: Yup.string().required("Required"),
  state: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  address: Yup.string().required("Required"),
  zipCode: Yup.string().required("Required"),
});

const initialValues = {
  firstName: "",
  lastName: "",
  password: "",
  description: "",
  email: "",
  phone: "",
  country: "",
  state: "",
  city: "",
  address: "",
  zipCode: "",
};

function AddTenant() {
  const formikRef = useRef(null);
  const router = useRouter();

  const createTenant = useMutation({
    mutationKey: ["createTenant"],
    mutationFn: async (values) => {
      return await CREATE_TENANT(values);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      router.push("/admin/users/tenants");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.error);
    },
  });

  // Function to handle submit form
  function handleSubmit(values) {
    try {
      try {
        createTenant.mutate(values);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }

  return (
    <div >
      <div className="mb-4 flex justify-between">
        <h1 className="inner-page-title text-3xl text-black p-0">Add Tenant</h1>
        <Button
          className="reset-button"
          onClick={() => formikRef.current.resetForm()}
        >
          Reset Form
        </Button>
      </div>

      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue }) => (
          <div className=" ">
            <Form>
              <div className="form-class mx-auto gap-6 relative  bg-gray-100 p-6 rounded-xl">
                {/* {JSON.stringify({
                errors,
              })} */}
                {createTenant?.status === "loading" && <Loading />}
                {/* {JSON.stringify({
                errors,
              })} */}
                <div className=" bg-white w-full p-6 rounded-xl">
                  <dir className="upload-image-div">
                    <ProfileImage />
                  </dir>
                  <FormField label="First Name" name="firstName" />
                  <FormField label="Last Name" name="lastName" />
                </div>
                <div className="">
                  <FormField label="Email" name="email" />
                  <FormField label="Phone" name="phone" />
                  <FormField label="Password" name="password" />
                  <FormField label="Address" name="address" />
                </div>
                <div className="">
                  <FormField label="City" name="city" />
                  <FormField label="State" name="state" />
                  <FormField label="Zip Code" name="zipCode" />
                  <FormField label="Country" name="country" />
                </div>
              </div>
              <div className="flex justify-end mt-8 gap-6">
                <Link
                  href="/admin/users/tenants"
                  className="bg-lightBlue h-9 flex items-center  hover:bg-white border-lightBlue hover:text-red-500 hover:border-red-500 text-white font-bold py-2 px-10 rounded-xl"
                >
                  Cancel
                </Link>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="bg-lightBlue hover:bg-white border-lightBlue hover:text-black !hover:border-black text-white font-bold py-4 px-10 rounded-xl"
                >
                  Add
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
}

export default AddTenant;
