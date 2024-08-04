"use client";
import ColorPickerFormField from "@/components/InnerPage/ColorPickerFormField";
import FormField from "@/components/InnerPage/FormField";
import { Button } from "antd";
import { Formik, Form, useFormikContext } from "formik";

import React, { useRef, useEffect, useState } from "react";
import * as Yup from "yup";
import ColorPickerModal from "../components/ColorPickerModal";
import Link from "next/link";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import Loading from "@/animations/homePageLoader";
import { useRouter } from "next/navigation";
import UploadImage from "@/components/upload/UploadImage";
import DescriptionField from "@/components/InnerPage/DescriptionField";
import UploadBackgroundImage from "../components/UploadBackgroundImage";
import { CREATE_CLIENT } from "@/app/api/admin/clients";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  companyName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email address").required("Required"),
  phone: Yup.string().required("Required"),
  publicPhone: Yup.string().required("Required"),
  publicEmail: Yup.string().email("Invalid email address").required("Required"),
  primaryColor: Yup.string().required("Required"),
  secondaryColor: Yup.string().required("Required"),
  password: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});

const initialValues = {
  firstName: "",
  companyName: "",
  lastName: "",
  password: "",
  description: "",
  email: "",
  phone: "",
  publicPhone: "",
  publicEmail: "",
  primaryColor: "",
  secondaryColor: "",
};

function AddClient() {
  const formikRef = useRef(null);
  const router = useRouter();

  //  create primary and secondary color for modal open and close
  const [primaryColorModal, setPrimaryColorModal] = useState({
    type: "primary",
    state: false,
    colorCode: null,
  });
  const [secondaryColorModal, setSecondaryColorModal] = useState({
    type: "secondary",
    state: false,
    colorCode: null,
  });

  const createClient = useMutation({
    mutationKey: ["createClient"],
    mutationFn: async (values) => {
      return await CREATE_CLIENT(values);
    },
    onSuccess: (data) => {
      toast.success(data?.message);
      router.push("/admin/users/clients");
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
        createClient.mutate(values);
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
        <h1 className="inner-page-title text-3xl text-black p-0">Add Client</h1>
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
              <div className="form-class mx-auto gap-6 relative  bg-gray-100 p-6 rounded-xl">
                {/* {JSON.stringify({
                errors,
              })} */}
                {createClient?.status === "loading" && <Loading />}
                <div className=" bg-white w-full p-6 rounded-xl">
                  <dir className="upload-image-div">
                    <UploadImage />
                  </dir>
                  <FormField label="First Name" name="firstName" />
                  <FormField label="Last Name" name="lastName" />
                  <FormField label="Contact Email" name="email" />
                </div>
                <div className="">
                  <FormField label="Contact Phone" name="phone" />
                  <FormField label="Password" name="password" />{" "}
                  <FormField label="Company Name" name="companyName" />
                  <FormField label="Public Email" name="publicEmail" />
                  <FormField label="Public Phone" name="publicPhone" />
                  <DescriptionField label="Description" name="description" />
                </div>
                <div className="">
                  <ColorPickerFormField
                    label="Primary Color"
                    name="primaryColor"
                    disabled={true}
                    onClick={() =>
                      setPrimaryColorModal({ type: "primary", state: true })
                    }
                    colorModal={primaryColorModal}
                  />
                  <ColorPickerFormField
                    label="Secondary Color"
                    name="secondaryColor"
                    disabled={true}
                    onClick={() =>
                      setSecondaryColorModal({
                        type: "secondary",
                        state: true,
                      })
                    }
                    colorModal={secondaryColorModal}
                  />
                  <label className="text-black font-[500] mt-3">Icon</label>
                  <div className="upload-background-image-antd w-full flex justify-start mb-6">
                    <UploadBackgroundImage title="Background Image" />
                  </div>
                  <label className="text-black font-[500]">
                    Background Image
                  </label>
                  <div className="upload-background-image-antd w-full flex justify-start">
                    <UploadBackgroundImage />
                  </div>
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
      <ColorPickerModal
        isModalOpen={primaryColorModal}
        setIsModalOpen={setPrimaryColorModal}
        handlePrimaryColorChange={(color) => {
          formikRef.current.setFieldValue("primaryColor", color);
        }}
      />
      <ColorPickerModal
        isModalOpen={secondaryColorModal}
        setIsModalOpen={setSecondaryColorModal}
        handleSecondaryColorChange={(color) => {
          formikRef.current.setFieldValue("secondaryColor", color);
        }}
      />
    </div>
  );
}

export default AddClient;
