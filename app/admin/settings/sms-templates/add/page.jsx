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
import TagsFields from "@/components/InnerPage/TagsField";
import { CREATE_SMS_TEMPLATE } from "@/app/api/admin/settings/smsTemplates";

const validationSchema = Yup.object().shape({
  templateName: Yup.string().required("Required"),
  messageContent: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
  fields: Yup.array().optional(""),
});

const initialValues = {
  templateName: "",
  messageContent: "",
  description: "",
  fields: [],
};

function AddSMSTemplate() {
  const formikRef = useRef(null);
  const router = useRouter();

  const createSMSTemplate = useMutation({
    mutationKey: ["createSMSTemplate"],
    mutationFn: async (values) => {
        return await CREATE_SMS_TEMPLATE(values);
    },
    onSuccess: (data) => {
      router.push("/admin/settings/sms-templates");
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
        createSMSTemplate.mutate(values);
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
          Add SMS Template
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
              {console.log({values})}
              <div className="form-class mx-auto lg:gap-6 md:gap-3 relative  bg-gray-100 p-6 rounded-xl">
                {/* {JSON.stringify({
                  errors,
                })} */}
                {createSMSTemplate?.status === "loading" && <Loading />}
                <div className="">
                  <FormField label="Template Name" name="templateName" />
                  <DescriptionField label="Message Content" name="messageContent" />
                  <TagsFields label="Add Placeholder" name="fields"/>
                </div>
                <div className="">
                  <DescriptionField
                    label="Description"
                    name="description"
                    rows="7"
                  />
                </div>{" "}
              </div>
              <div className="flex justify-end mt-8 gap-6">
                <Link
                  href="/admin/settings/sms-templates"
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

export default AddSMSTemplate;
