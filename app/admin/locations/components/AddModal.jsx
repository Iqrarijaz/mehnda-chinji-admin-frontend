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
import { CREATE_LOCATION, GET_LOCATION_BY_TYPE } from "@/app/api/admin/locations";

// Constants
const TYPES = [
  { label: "Village", value: "VILLAGE" },
  { label: "Tehsil", value: "TEHSIL" },
  { label: "District", value: "DISTRICT" },
];

const validationSchema = Yup.object().shape({
  name_en: Yup.string().required("Required"),
  name_ur: Yup.string().required("Required"),
  type: Yup.string().required("Type is required"),
  tehsil: Yup.string().test(
    'tehsil-required',
    'Tehsil is required for villages',
    function(value) {
      return this.parent.type !== 'VILLAGE' || (this.parent.type === 'VILLAGE' && !!value);
    }
  ),
});

const initialValues = {
  name_en: "",
  name_ur: "",
  type: "",
  tehsil: "",
};

function AddModal({ modal, setModal }) {
  const formikRef = useRef(null);
  const queryClient = useQueryClient();
  const [tehsils, setTehsils] = useState([]);
  const [loadingTehsils, setLoadingTehsils] = useState(false);

  const isModalOpen = useMemo(() => modal?.name === "Add" && modal?.state, [modal]);

  const createLocation = useMutation({
    mutationKey: ["createLocation"],
    mutationFn: CREATE_LOCATION,
    onSuccess: (data) => {
      toast.success(data?.message || "Location added successfully");
      queryClient.invalidateQueries({ 
        predicate: (query) => query.queryKey[0] === "locationsList" 
      });
      handleCloseModal();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Failed to add location");
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

  const handleCloseModal = useCallback(() => {
    formikRef.current?.resetForm();
    setModal(prev => ({ ...prev, state: false }));
  }, [setModal]);

  const handleResetForm = useCallback(() => {
    formikRef.current?.resetForm();
  }, []);

  // Fetch tehsils on modal open
  useEffect(() => {
    if (isModalOpen) {
      fetchTehsils();
    }
  }, [isModalOpen, fetchTehsils]);

  const tehsilOptions = useMemo(() => 
    tehsils.map((t) => ({
      label: t.name?.en || t.name_en, // Updated to match your API response structure
      value: t._id,
      district: t.district // Store the district ID from the tehsil object
    })),
    [tehsils]
  );

  const handleSubmit = useCallback((values) => {
    // Find the selected tehsil to get its district
    const selectedTehsil = tehsils.find(t => t._id === values.tehsil);
    const districtId = selectedTehsil?.district; // Get district from tehsil object

    createLocation.mutate({
      ...values,
      district: values.type === "VILLAGE" ? districtId : undefined
    });
  }, [tehsils, createLocation]);

  return (
    <Modal
      title="Add Location"
      className="!rounded-xl"
      centered
      width={600}
      open={isModalOpen}
      onCancel={handleCloseModal}
      footer={null}
      afterClose={handleResetForm}
      destroyOnClose
    >
      <div className="mb-4 flex justify-end">
        <Button className="reset-button" onClick={handleResetForm}>
          Reset Form
        </Button>
      </div>

      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <div className="form-class bg-gray-100 p-6 rounded-xl">
              {createLocation.isLoading && <Loading />}

              <SelectField 
                label="Location Type" 
                name="type" 
                options={TYPES} 
              />

              {values.type === "VILLAGE" && (
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

            <div className="flex justify-end mt-4 gap-6">
              <Button className="modal-cancel-button" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                className="modal-add-button"
                disabled={createLocation.isLoading}
              >
                Add
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}

export default React.memo(AddModal);