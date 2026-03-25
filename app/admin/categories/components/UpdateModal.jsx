"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaLayerGroup, FaEdit } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_CATEGORY } from "@/app/api/admin/categories";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";


const validationSchema = Yup.object().shape({
  name_en: Yup.string().required("English name is required"),
  name_ur: Yup.string().required("Urdu name is required"),
  type: Yup.string().oneOf(["PLACES", "SERVICES"]).required("Type is required"),
});

function UpdateCategoryModal({ modal, setModal }) {
  const formikRef = useRef(null);
  const queryClient = useQueryClient();

  const updateCategory = useMutation({
    mutationKey: ["updateCategory"],
    mutationFn: (payload) => UPDATE_CATEGORY(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Category updated successfully");
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

  const handleCloseModal = () => {
    setModal({ name: null, state: false, data: null });
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <FaEdit size={18} />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 block">Edit Category</span>
            <span className="text-xs text-slate-500 font-normal">Update localization and classification</span>
          </div>
        </div>
      }
      centered
      width={600}
      open={modal?.name === "Update" && modal?.state}
      onCancel={handleCloseModal}
      footer={null}
      className="modern-modal"
    >
      <div className="p-1">
        <Formik
          enableReinitialize
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue, errors, touched }) => (
            <Form className="space-y-4">
              {updateCategory.status === "loading" ? (
                <FormSkeleton fields={2} />
              ) : (
                <>
                  <div className="modal-section">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Localization</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FormField label="Name (English)" name="name_en" placeholder="e.g. Restaurants" required className="!h-[36px] !text-sm" />
                      <FormField label="Name (Urdu)" name="name_ur" placeholder="e.g. ریسٹورنٹ" required className="!h-[36px] !text-sm" />
                    </div>
                  </div>

                  <div className="modal-section !mb-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Configuration</p>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-slate-700 font-semibold text-xs">Target Type <span className="text-red-500">*</span></label>
                      <SelectBox
                        value={values.type}
                        handleChange={(value) => setFieldValue("type", value)}
                        options={[
                          { value: "PLACES", label: "Places (Locations)" },
                          { value: "SERVICES", label: "Services (Utility)" },
                        ]}
                        height="36px"
                      />
                      {touched.type && errors.type && (
                        <div className="text-red-500 text-[10px] font-medium">{errors.type}</div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
                <CustomButton
                  label="Cancel"
                  type="secondary"
                  onClick={handleCloseModal}
                />
                <CustomButton
                  label="Update Category"
                  htmlType="submit"
                  loading={updateCategory.isLoading || isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}

export default UpdateCategoryModal;
