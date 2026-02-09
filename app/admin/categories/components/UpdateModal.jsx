"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import {
  UPDATE_CATEGORY,
} from "@/app/api/admin/categories";

const { Option } = Select;

// Validation schema
const validationSchema = Yup.object().shape({
  name_en: Yup.string().required("Required"),
  name_ur: Yup.string().required("Required"),
  type: Yup.string().oneOf(["PLACES", "SERVICES"]).required("Required"),
});

function UpdateCategoryModal({ modal, setModal }) {
  const formikRef = useRef(null);
  const queryClient = useQueryClient();

  const updateCategory = useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: (payload) => UPDATE_CATEGORY(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Category updated successfully");

      // Refetch updated list
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "categoriesList",
      });

      setModal({ name: null, state: false, data: null });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong");
    },
  });

  const initialValues = {
    name_en: modal?.data?.name?.en || "",
    name_ur: modal?.data?.name?.ur || "",
    type: modal?.data?.type || "PLACES",
  };

  const handleSubmit = (values) => {
    updateCategory.mutate({ _id: modal?.data?._id, ...values });
  };

  return (
    <Modal
      title="Update Category"
      className="!rounded-2xl"
      centered
      width={600}
      open={modal.name === "Update" && modal.state}
      onCancel={() => setModal({ name: null, state: false, data: null })}
      footer={null}
    >
      <div className="mb-4 flex justify-end">
        <Button
          className="reset-button"
          onClick={() =>
            formikRef.current?.resetForm({
              values: initialValues,
            })
          }
        >
          Reset
        </Button>
      </div>

      <Formik
        innerRef={formikRef}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values, setFieldValue, errors, touched }) => (
          <Form>
            <div className="form-class bg-gray-100 p-6 rounded">
              {updateCategory.status === "loading" && <Loading />}
              <FormField label="Name English" name="name_en" />
              <FormField label="Name Urdu" name="name_ur" />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <Select
                  value={values.type}
                  onChange={(value) => setFieldValue("type", value)}
                  className="w-full"
                  size="large"
                >
                  <Option value="PLACES">Places</Option>
                  <Option value="SERVICES">Services</Option>
                </Select>
                {errors.type && touched.type && (
                  <div className="text-red-500 text-sm mt-1">{errors.type}</div>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-8 gap-6">
              <Button
                className="modal-cancel-button"
                onClick={() => setModal({ name: null, state: false, data: null })}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="modal-add-button"
              >
                Update
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default UpdateCategoryModal;
