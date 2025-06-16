"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import {
  UPDATE_BUSINESS_CATEGORY,
} from "@/app/api/admin/business-categories";

// Validation schema
const validationSchema = Yup.object().shape({
  name_en: Yup.string().required("Required"),
  name_ur: Yup.string().required("Required"),
});

function UpdateBusinessCategoryModal({ modal, setModal }) {
  const formikRef = useRef(null);
  const queryClient = useQueryClient();

  const updateBusinessCategory = useMutation({
    mutationKey: ["updateBusinessCategory"],
    mutationFn: (payload) => UPDATE_BUSINESS_CATEGORY(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Category updated successfully");

      // Refetch updated list
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "businessCategoriesList",
      });

      setModal({ name: null, state: false, data: null });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Something went wrong");
    },
  });

  const initialValues = {
    name_en: modal?.data?.name?.en || "",
    name_ur: modal?.data?.name?.ur || "",
  };

  const handleSubmit = (values) => {
    updateBusinessCategory.mutate({ _id: modal?.data?._id, ...values });
  };

  return (
    <Modal
      title="Update Business Category"
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
          Reset Form
        </Button>
      </div>

      <Formik
        innerRef={formikRef}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-class bg-gray-100 p-6 rounded-xl">
              {updateBusinessCategory.status === "loading" && <Loading />}
              <FormField label="Name English" name="name_en" />
              <FormField label="Name Urdu" name="name_ur" />
            </div>
            <div className="flex justify-end mt-8 gap-6">
              <Button
                className="modal-cancel-button"
                onClick={() => setModal({ name: null, state: false, data: null })}
              >
                Cancel
              </Button>
              <Button
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

export default UpdateBusinessCategoryModal;
