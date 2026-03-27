import React, { useRef, useState, useMemo, useCallback, useEffect } from "react";
import { Modal, Select } from "antd";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaGlobe, FaEdit, FaChevronRight } from "react-icons/fa";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";

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
    isDeleted: modal?.data?.isDeleted ?? false,
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
        <div className="flex items-center gap-2 px-0 py-1">
          <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
            <FaEdit size={16} />
          </div>
          <div>
            <span className="text-lg font-bold text-[#006666] block mt-1">Edit Location</span>
          </div>
        </div>
      }
      centered
      width={600}
      open={isModalOpen}
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
            <Form className="space-y-2">
              {updateLocation.status === "loading" ? (
                <FormSkeleton fields={4} />
              ) : (
                <>
                  {/* Classification Section */}
                  <div className="modal-section">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Geography Level</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5 flex-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Location Type <span className="text-red-500">*</span></label>
                        <SelectBox
                          value={values.type}
                          handleChange={(value) => setFieldValue("type", value)}
                          placeholder="Select level"
                          options={TYPES}
                          className="modern-select-box"
                        />
                        {touched.type && errors.type && <div className="text-red-500 text-[10px] font-medium ml-1">{errors.type}</div>}
                      </div>

                      {values.type === "VILLAGE" && (
                        <div className="flex flex-col gap-1.5 flex-1">
                          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">Tehsil <span className="text-red-500">*</span></label>
                          <SelectBox
                            value={values.tehsil}
                            handleChange={(value) => setFieldValue("tehsil", value)}
                            placeholder="Select tehsil"
                            loading={loadingTehsils}
                            options={tehsils.map(t => ({
                              value: t._id,
                              label: t.name?.en || t.name_en
                            }))}
                            className="modern-select-box"
                            showSearch
                          />
                          {touched.tehsil && errors.tehsil && <div className="text-red-500 text-[10px] font-medium ml-1">{errors.tehsil}</div>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata Section */}
                  <div className="modal-section !mb-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Localization</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <FormField
                        label="Name (English)"
                        name="name_en"
                        placeholder="Village name"
                        required
                        className="!h-[32px] !text-xs !rounded"
                        labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                      />
                      <FormField
                        label="Name (Urdu)"
                        name="name_ur"
                        placeholder="گاؤں کا نام"
                        required
                        className="!h-[32px] !text-xs !rounded font-notoUrdu"
                        labelClassName="!text-[11px] !font-bold !text-slate-500 !uppercase !tracking-tight !ml-1"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Modal Footer Actions */}
              <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                <CustomButton
                  label="Cancel"
                  type="secondary"
                  onClick={handleCloseModal}
                />
                <CustomButton
                  label="Save Changes"
                  htmlType="submit"
                  loading={updateLocation.isLoading || isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}

export default UpdateLocationModal;
