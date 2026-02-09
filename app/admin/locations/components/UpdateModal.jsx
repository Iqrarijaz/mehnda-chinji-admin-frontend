"use client";
import React, { useRef, useEffect, useMemo, useCallback, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import SelectField from "@/components/InnerPage/SelectField";
import { UPDATE_LOCATION, GET_LOCATION_BY_TYPE } from "@/app/api/admin/locations";

const TYPES = [
  { label: "Village", value: "VILLAGE" },
  { label: "Tehsil", value: "TEHSIL" },
  { label: "District", value: "DISTRICT" },
];

const validationSchema = Yup.object().shape({
  name_en: Yup.string().required("Required"),
  name_ur: Yup.string().required("Required"),
  type: Yup.string().required("Required"),
  tehsil: Yup.string().test(
    'tehsil-required',
    'Tehsil is required for villages',
    function (value) {
      return this.parent.type !== 'VILLAGE' || (this.parent.type === 'VILLAGE' && !!value);
    }
  ),
});

function UpdateModal({ modal, setModal }) {
  const formikRef = useRef(null);
  const queryClient = useQueryClient();
  const [tehsils, setTehsils] = useState([]);
  const [loadingTehsils, setLoadingTehsils] = useState(false);

  const isModalOpen = useMemo(() => modal?.name === "Update" && modal?.state, [modal]);

  const initialValues = useMemo(() => ({
    name_en: modal?.data?.name?.en || "",
    name_ur: modal?.data?.name?.ur || "",
    type: modal?.data?.type || "",
    tehsil: modal?.data?.tehsil.id || "",
  }), [modal?.data]);

  const updateLocation = useMutation({
    mutationKey: ["updateLocation"],
    mutationFn: (payload) => UPDATE_LOCATION(payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Record updated successfully");
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "locationsList",
      });
      handleCloseModal();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Something went wrong");
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

  const handleResetForm = useCallback(() => {
    formikRef.current?.resetForm({ values: initialValues });
  }, [initialValues]);

  const tehsilOptions = useMemo(() => tehsils.map((t) => ({
    label: t.name?.en || t.name_en,
    value: t._id,
    district: t.district,
  })), [tehsils]);

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
      title="Update Location"
      className="!rounded-2xl"
      centered
      width={600}
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer={null}
      destroyOnClose
    >
      <div className="mb-4 flex justify-end">
        <Button className="reset-button" onClick={handleResetForm}>
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
        {({ isSubmitting, values }) => {
          const isVillage = values.type === "VILLAGE";

          // Wait until tehsils are loaded if type is Village
          if (isVillage && loadingTehsils) {
            return <div className="p-6"><Loading /></div>;
          }

          return (
            <Form>
              <div className="form-class bg-gray-100 p-6 rounded">
                {updateLocation.isLoading && <Loading />}

                <SelectField
                  label="Location Type"
                  name="type"
                  options={TYPES}
                />

                {isVillage && (
                  <SelectField
                    label="Tehsil"
                    name="tehsil"
                    options={tehsilOptions}
                    loading={loadingTehsils}
                  />
                )}

                <FormField label="Name English" name="name_en" />
                <FormField label="Name Urdu" name="name_ur" />
              </div>

              <div className="flex justify-end mt-8 gap-6">
                <Button className="modal-cancel-button" onClick={handleCloseModal}>
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
          );
        }}
      </Formik>

    </Modal>
  );
}

export default React.memo(UpdateModal);
