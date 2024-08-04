"use client";
import FormField from "@/components/InnerPage/FormField";
import { Button } from "antd";
import { Formik, Form } from "formik";
import React, { useRef } from "react";
import * as Yup from "yup";
import Link from "next/link";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import Loading from "@/animations/homePageLoader";
import { useRouter } from "next/navigation";
import DescriptionField from "@/components/InnerPage/DescriptionField";
import SelectField from "@/components/InnerPage/SelectField";
import { LIST_CLIENTS_FOR_ADDING_BUILDING } from "@/app/api/admin/buildings";


const validationSchema = Yup.object().shape({
  clientId: Yup.string().required("Required"),
  name: Yup.string().required("Required"),
  streetAddress: Yup.string().required("Required"),
  country: Yup.string().required("Required"),
  province: Yup.string().required("Required"),
  city: Yup.string().required("Required"),
  zipCode: Yup.string().required("Required"),
  phone: Yup.string().required("Required"),
  numberOfApartments: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

const initialValues = {
  clientId: "",
  name: "",
  streetAddress: "",
  country: "",
  province: "",
  city: "",
  zipCode: "",
  phone: "",
  numberOfApartments: "",
  description: "",
};

function AddBuilding() {
  const formikRef = useRef(null);
  const router = useRouter();
  
  const clientList = useQuery({
    queryKey: ["clientsForAddingBuilding"],
    queryFn: async () => {
      return await LIST_CLIENTS_FOR_ADDING_BUILDING();
    },
    onError: (error) => {
      console.error("Error fetching data:", error);
      toast.error("Something went wrong. Please try again later.");
    },
  });

  const createBuilding = useMutation({
    mutationKey: ["createBuilding"],
    mutationFn: async (values) => {
      return await CREATE_BUILDING(values);
    },
    onSuccess: (data) => {
      router.push("/admin/buildings");
      toast.success(data?.message);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.response?.data?.error);
    },
  });

  function handleSubmit(values) {
    try {
      try {
        createBuilding.mutate(values);
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  }
  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h1 className="inner-page-title text-3xl text-black p-0">
          Add Building
        </h1>
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
        {({ errors, values, touched, setFieldValue }) => (
          <div className=" ">
            <Form>
              <div className="form-class mx-auto lg:gap-6 md:gap-6 relative  bg-gray-100 p-6 rounded-xl">
                {/* {JSON.stringify({
                  errors,
                })} */}
                {clientList?.status === "loading" && <Loading />}
                {createBuilding?.status === "loading" && <Loading />}
                <div className="">
                  <SelectField
                    label="Company Name"
                    name="clientId"
                    options={clientList?.data?.data.map((item) => ({
                      label: item?.companyName,
                      value: item?._id,
                    }))}
                  />
                  <FormField label="Building Name" name="name" />
                  <FormField label="Street Address" name="streetAddress" />
                  <FormField label="Country" name="country" />
                </div>
                <div className="">
                  <FormField label="Province" name="province" />
                  <FormField label="City" name="city" />
                  <FormField label="Postal Code" name="zipCode" />
                  <FormField label="Phone" name="phone" />
                </div>
                <div className="">
                  <FormField
                    label="Number of Apartment"
                    name="numberOfApartments"
                  />
                  <DescriptionField
                    label="Description"
                    name="description"
                    rows="7"
                  />
                </div>{" "}
              </div>
              <div className="flex justify-end mt-8 gap-6">
                <Link
                  href="/admin/users/clients"
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

export default AddBuilding;
