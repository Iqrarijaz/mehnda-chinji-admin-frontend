import { Modal, Select } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaGlobe, FaChevronRight } from "react-icons/fa";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_LOCATION, GET_LOCATION_BY_TYPE } from "@/app/api/admin/locations";

const { Option } = Select;

// Constants
const TYPES = [
  { label: "Village", value: "VILLAGE" },
  { label: "Tehsil", value: "TEHSIL" },
  { label: "District", value: "DISTRICT" },
];

const validationSchema = Yup.object().shape({
  name_en: Yup.string().required("English name is required"),
  name_ur: Yup.string().required("Urdu name is required"),
  type: Yup.string().required("Location type is required"),
  tehsil: Yup.string().test(
    'tehsil-required',
    'Tehsil is required for villages',
    function (value) {
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

function AddLocationModal({ modal, setModal }) {
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
    setModal(prev => ({ ...prev, name: null, state: false, data: null }));
  }, [setModal]);

  useEffect(() => {
    if (isModalOpen) {
      fetchTehsils();
    }
  }, [isModalOpen, fetchTehsils]);

  const handleSubmit = useCallback((values) => {
    const selectedTehsil = tehsils.find(t => t._id === values.tehsil);
    const districtId = selectedTehsil?.district;

    createLocation.mutate({
      ...values,
      district: values.type === "VILLAGE" ? districtId : undefined
    });
  }, [tehsils, createLocation]);

  return (
    <Modal
      title={
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#006666]">
            <FaGlobe size={18} />
          </div>
          <div>
            <span className="text-lg font-bold text-slate-900 block">Register Location</span>
            <span className="text-xs text-slate-500 font-normal">Add a new village, tehsil, or district</span>
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
      <div className="p-1 mt-4">
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue, errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              {createLocation.status === "loading" ? (
                <FormSkeleton fields={4} />
              ) : (
                <>
                  {/* Classification Section */}
                  <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100/50 space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Geography Level</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-slate-600 font-bold text-xs">Location Type <span className="text-red-500">*</span></label>
                        <SelectBox
                          value={values.type}
                          handleChange={(value) => setFieldValue("type", value)}
                          placeholder="Select level"
                          options={TYPES}
                          className="modern-select-box [&>div]:!h-[36px] [&>div]:!rounded-lg [&>div]:!text-sm"
                        />
                        {touched.type && errors.type && <div className="text-red-500 text-[10px] font-medium">{errors.type}</div>}
                      </div>

                      {values.type === "VILLAGE" && (
                        <div className="flex flex-col gap-1.5">
                          <label className="text-slate-600 font-bold text-xs">Tehsil <span className="text-red-500">*</span></label>
                          <SelectBox
                            value={values.tehsil}
                            handleChange={(value) => setFieldValue("tehsil", value)}
                            placeholder="Select tehsil"
                            loading={loadingTehsils}
                            options={tehsils.map(t => ({
                              value: t._id,
                              label: t.name?.en || t.name_en
                            }))}
                            className="modern-select-box [&>div]:!h-[36px] [&>div]:!rounded-lg [&>div]:!text-sm"
                            showSearch
                          />
                          {touched.tehsil && errors.tehsil && <div className="text-red-500 text-[10px] font-medium">{errors.tehsil}</div>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata Section */}
                  <div className="p-4 rounded-xl border border-slate-100 space-y-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Localization</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        label="Name (English)"
                        name="name_en"
                        placeholder="e.g. Village Name"
                        required
                        className="!h-[36px] !text-xs !rounded-lg"
                        labelClassName="!text-xs !font-bold !text-slate-600"
                      />
                      <FormField
                        label="Name (Urdu)"
                        name="name_ur"
                        placeholder="e.g. گاؤں کا نام"
                        required
                        className="!h-[36px] !text-xs !rounded-lg font-notoUrdu"
                        labelClassName="!text-xs !font-bold !text-slate-600"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Modal Footer Actions */}
              <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-slate-100">
                <CustomButton
                  label="Cancel"
                  type="secondary"
                  onClick={handleCloseModal}
                />
                <CustomButton
                  label="Create Location"
                  htmlType="submit"
                  loading={createLocation.isLoading || isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}

export default AddLocationModal;