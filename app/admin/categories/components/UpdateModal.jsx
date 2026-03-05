"use client";
import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaLayerGroup, FaEdit } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_CATEGORY } from "@/app/api/admin/categories";

const { Option } = Select;

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
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <FaEdit size={18} />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 block">Edit Category</span>
            <span className="text-xs text-slate-500 font-normal">Update localization and classification</span>
          </div>
        </div>
      }
      centered
      width={520}
      open={modal?.name === "Update" && modal?.state}
      onCancel={handleCloseModal}
      footer={null}
      className="modern-modal"
    >
      <div className="p-2 pt-4">
        <Formik
          enableReinitialize
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue, errors, touched }) => (
            <Form className="space-y-6">
              {updateCategory.status === "loading" && <Loading />}

              <div className="modal-section">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Localization</p>
                <div className="space-y-4">
                  <FormField label="Name (English)" name="name_en" placeholder="e.g. Restaurants" required />
                  <FormField label="Name (Urdu)" name="name_ur" placeholder="e.g. ریسٹورنٹ" required />
                </div>
              </div>

              <div className="modal-section !mb-0">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Configuration</p>
                <div className="flex flex-col gap-2">
                  <label className="text-slate-700 font-semibold text-sm">Target Type <span className="text-red-500">*</span></label>
                  <Select
                    value={values.type}
                    onChange={(value) => setFieldValue("type", value)}
                    className="!h-[44px] !rounded-xl overflow-hidden border-2 border-slate-100"
                    size="large"
                  >
                    <Option value="PLACES">Places (Locations)</Option>
                    <Option value="SERVICES">Services (Utility)</Option>
                  </Select>
                  {touched.type && errors.type && (
                    <div className="text-red-500 text-xs font-medium">{errors.type}</div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-100">
                <Button
                  onClick={handleCloseModal}
                  className="modal-footer-btn-secondary flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updateCategory.isLoading || isSubmitting}
                  className="modal-footer-btn-primary flex-1"
                >
                  Update Category
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}

export default UpdateCategoryModal;
