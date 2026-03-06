"use client";
import React, { useRef, useEffect, useMemo, useCallback, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaGlobe, FaEdit, FaChevronRight } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_LOCATION, GET_LOCATION_BY_TYPE } from "@/app/api/admin/locations";

const { Option } = Select;

const TYPES = [
  { label: "Village", value: "VILLAGE" },
  { label: "Tehsil", value: "TEHSIL" },
  { label: "District", value: "DISTRICT" },
];

const validationSchema = Yup.object().shape({
  name_en: Yup.string().required("English name is required"),
  name_ur: Yup.string().required("Urdu name is required"),
  type: Yup.string().required("Type is required"),
  tehsil: Yup.string().test(
    'tehsil-required',
    'Tehsil is required for villages',
    function (value) {
      return this.parent.type !== 'VILLAGE' || (this.parent.type === 'VILLAGE' && !!value);
    }
  ),
});

function UpdateLocationModal({ modal, setModal }) {
  const formikRef = useRef(null);
  const queryClient = useQueryClient();
  const [tehsils, setTehsils] = useState([]);
  const [loadingTehsils, setLoadingTehsils] = useState(false);

  const isModalOpen = useMemo(() => modal?.name === "Update" && modal?.state, [modal]);

  const initialValues = useMemo(() => ({
    name_en: modal?.data?.name?.en || "",
    name_ur: modal?.data?.name?.ur || "",
    type: modal?.data?.type || "",
    tehsil: modal?.data?.tehsil?._id || modal?.data?.tehsil || "",
  }), [modal?.data]);

  const updateLocation = useMutation({
    mutationKey: ["updateLocation"],
    mutationFn: (payload) => UPDATE_LOCATION(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Location updated successfully");
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "locationsList",
      });
      handleCloseModal();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Failed to update location");
    },
  });

  const fetchTehsils = useCallback(async () => {
    try {
      setLoadingTehsils(true);
      const { data } = await GET_LOCATION_BY_TYPE({ type: "TEHSIL" });
      setTehsils(data || []);
    } catch (error) {
      toast.error("Failed to load tehsils");
    } finally {
      setLoadingTehsils(false);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      fetchTehsils();
    }
  }, [isModalOpen, fetchTehsils]);

  const handleCloseModal = useCallback(() => {
    setModal({ name: null, state: false, data: null });
  }, [setModal]);

  const handleSubmit = useCallback((values) => {
    const selectedTehsil = tehsils.find(t => t._id === values.tehsil);
    const districtId = selectedTehsil?.district;

    updateLocation.mutate({
      _id: modal?.data?._id,
      ...values,
      district: values.type === "VILLAGE" ? districtId : undefined,
    });
  }, [tehsils, updateLocation, modal?.data?._id]);

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
            <FaEdit size={18} />
          </div>
          <div>
            <span className="text-xl font-bold text-slate-900 block">Edit Location</span>
            <span className="text-xs text-slate-500 font-normal">Modify village, tehsil, or district details</span>
          </div>
        </div>
      }
      centered
      width={580}
      open={isModalOpen}
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
              {updateLocation.status === "loading" ? (
                <FormSkeleton fields={4} />
              ) : (
                <>
                  {/* Classification Section */}
                  <div className="modal-section">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Geography Level</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-1">
                        <div className="flex flex-col gap-2">
                          <label className="text-slate-700 font-semibold text-sm">Location Type <span className="text-red-500">*</span></label>
                          <Select
                            value={values.type}
                            onChange={(value) => setFieldValue("type", value)}
                            placeholder="Select level"
                            className="!h-[44px] !rounded-xl overflow-hidden border-2 border-slate-100"
                            size="large"
                          >
                            {TYPES.map(t => <Option key={t.value} value={t.value}>{t.label}</Option>)}
                          </Select>
                          {touched.type && errors.type && <div className="text-red-500 text-xs font-medium">{errors.type}</div>}
                        </div>
                      </div>

                      {values.type === "VILLAGE" && (
                        <div className="md:col-span-1">
                          <div className="flex flex-col gap-2">
                            <label className="text-slate-700 font-semibold text-sm">Tehsil <span className="text-red-500">*</span></label>
                            <Select
                              value={values.tehsil}
                              onChange={(value) => setFieldValue("tehsil", value)}
                              placeholder="Select tehsil"
                              loading={loadingTehsils}
                              className="!h-[44px] !rounded-xl overflow-hidden border-2 border-slate-100"
                              size="large"
                              showSearch
                              optionFilterProp="children"
                            >
                              {tehsils.map(t => (
                                <Option key={t._id} value={t._id}>
                                  {t.name?.en || t.name_en}
                                </Option>
                              ))}
                            </Select>
                            {touched.tehsil && errors.tehsil && <div className="text-red-500 text-xs font-medium">{errors.tehsil}</div>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata Section */}
                  <div className="modal-section !mb-0">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Localization</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField label="Name (English)" name="name_en" placeholder="Village name" required icon={<FaChevronRight className="opacity-20 translate-y-0.5" />} />
                      <FormField label="Name (Urdu)" name="name_ur" placeholder="گاؤں کا نام" required icon={<FaChevronRight className="opacity-20 translate-y-0.5" />} />
                    </div>
                  </div>
                </>
              )}

              {/* Modal Footer Actions */}
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
                  loading={updateLocation.isLoading || isSubmitting}
                  className="modal-footer-btn-primary flex-1"
                >
                  Save Changes
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}

export default UpdateLocationModal;
