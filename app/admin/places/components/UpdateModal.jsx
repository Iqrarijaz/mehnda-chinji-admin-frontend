import React, { useRef } from "react";
import { Modal, Select, Input } from "antd";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaMapMarkerAlt, FaPhoneAlt, FaClock, FaTools, FaChevronRight, FaCheckCircle, FaEdit, FaImage, FaCamera } from "react-icons/fa";
import { UPLOAD_PLACE_IMAGE } from "@/app/api/admin/places";

import Loading from "@/animations/homePageLoader";
import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { UPDATE_PLACE } from "@/app/api/admin/places";
import { PLACE_CATEGORIES, PLACE_TYPE_MAPPING } from "@/config/config";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const { Option } = Select;

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    address: Yup.string().required("Address is required"),
    lat: Yup.number().nullable().typeError("Must be a number"),
    lng: Yup.number().nullable().typeError("Must be a number"),
    type: Yup.string().nullable(),
    contact: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Contact name is required"),
            number: Yup.string().required("Contact number is required"),
        })
    )
});

function UpdatePlaceModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState(null);

    const updatePlace = useMutation({
        mutationKey: ["updatePlace"],
        mutationFn: (payload) => UPDATE_PLACE(payload),
        onSuccess: (data) => {
            toast.success(data?.message || "Place updated successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.PLACES.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.PLACES.COUNTS]);
            handleCloseModal(true);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Something went wrong");
        },
    });

    const handleSubmit = (values) => {
        const filteredContact = values.contact.filter(c => c.name.trim() !== "" && c.number.trim() !== "");

        // Check for duplicates
        const numbers = filteredContact.map(c => c.number.trim());
        const names = filteredContact.map(c => c.name.trim().toLowerCase());

        if (new Set(numbers).size !== numbers.length) {
            return toast.error("Duplicate contact numbers are not allowed.");
        }

        if (new Set(names).size !== names.length) {
            return toast.error("Duplicate contact names are not allowed.");
        }

        const payload = {
            _id: modal.data._id,
            ...values,
            contact: filteredContact,
            // Convert numerical 0 to string to bypass weak backend falsy checks
            lat: (values.lat === 0 || values.lat === "0") ? "0" : values.lat,
            lng: (values.lng === 0 || values.lng === "0") ? "0" : values.lng,
        };

        updatePlace.mutate(payload);
    };

    const handleCloseModal = (force = false) => {
        if (!force && formikRef.current?.dirty) {
            Modal.confirm({
                title: "Unsaved Changes",
                content: "You have unsaved changes. Are you sure you want to discard them and exit?",
                okText: "Discard",
                okType: "danger",
                cancelText: "Stay",
                onOk: () => {
                    setModal({ name: null, state: false, data: null });
                    setSelectedImage(null);
                },
            });
        } else {
            setModal({ name: null, state: false, data: null });
            setSelectedImage(null);
        }
    };

    const handleImageUpload = async (e, setFieldValue) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("image", file);
        if (selectedImage) {
            formData.append("existingImageUrl", selectedImage);
        }

        try {
            const res = await UPLOAD_PLACE_IMAGE(formData);
            if (res.success) {
                setFieldValue("images", [res.data.imageUrl]);
                setSelectedImage(res.data.imageUrl);
                toast.success("Image uploaded successfully");
            }
        } catch (error) {
            toast.error("Failed to upload image");
            console.error(error);
        } finally {
            setIsUploading(false);
        }
    };

    React.useEffect(() => {
        if (modal?.state && modal?.data?.images?.length > 0) {
            setSelectedImage(modal.data.images[0]);
        }
    }, [modal?.state, modal?.data]);

    // Diagnostic for coordinates mapping
    // console.log("Modal Data (Update):", modal?.data);

    const initialValues = {
        name: modal?.data?.name || "",
        description: modal?.data?.description || "",
        address: modal?.data?.address || "",
        timing: modal?.data?.timing || "",
        services: modal?.data?.services || "",
        googleAddress: modal?.data?.googleAddress || "",
        lat: modal?.data?.lat ?? modal?.data?.location?.coordinates?.[1] ?? modal?.data?.latitude ?? null,
        lng: modal?.data?.lng ?? modal?.data?.location?.coordinates?.[0] ?? modal?.data?.longitude ?? null,
        type: modal?.data?.type || "",
        contact: modal?.data?.contact?.length > 0 ? modal.data.contact : [{ name: "", number: "" }],
        isDeleted: modal?.data?.isDeleted ?? false,
        images: modal?.data?.images || [],
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-[#006666] dark:text-teal-400 transition-colors">
                        <FaEdit size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-500 block mt-1 transition-colors">Edit Place</span>
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
                            {updatePlace.status === "loading" ? (
                                <FormSkeleton fields={6} />
                            ) : (
                                <>
                                    {/* Image Upload Section */}
                                    <div className="modal-section pb-2">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 transition-colors">Place Presentation</p>
                                        <div className="relative group">
                                            {selectedImage ? (
                                                <div className="relative h-40 w-full rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors shadow-sm">
                                                    <img
                                                        src={selectedImage}
                                                        alt="Place"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <label className="cursor-pointer bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-xl border border-white/30">
                                                            <FaCamera size={14} />
                                                            Change Photo
                                                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setFieldValue)} disabled={isUploading} />
                                                        </label>
                                                    </div>
                                                </div>
                                            ) : (
                                                <label className={`
                                                    h-40 w-full rounded-lg border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer
                                                    ${isUploading ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800' : 'bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 hover:border-teal-500/50 hover:bg-teal-50/10'}
                                                `}>
                                                    {isUploading ? (
                                                        <div className="flex flex-col items-center gap-2">
                                                            <Loading className="w-8 h-8" />
                                                            <span className="text-[11px] font-bold text-slate-400 animate-pulse uppercase tracking-wider">Uploading Image...</span>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-3 transition-colors">
                                                                <FaImage size={24} />
                                                            </div>
                                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors">Click to upload featured photo</span>
                                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 transition-colors italic">High resolution 16:9 images work best</span>
                                                        </>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, setFieldValue)} disabled={isUploading} />
                                                </label>
                                            )}
                                        </div>
                                    </div>

                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors">Core Identification</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="md:col-span-2">
                                                <FormField label="Place Name" name="name" placeholder="Name" required className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1 transition-colors" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <div className="flex flex-col gap-1.5 overflow-hidden">
                                                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight ml-1 transition-colors">Type</label>
                                                    <SelectBox
                                                        options={[...new Set(Object.values(PLACE_TYPE_MAPPING).flat())].sort().map((t) => ({
                                                            value: t,
                                                            label: t.charAt(0).toUpperCase() + t.slice(1)
                                                        }))}
                                                        handleChange={(value) => setFieldValue("type", value)}
                                                        value={values.type}
                                                        placeholder="Select type"
                                                        width="100%"
                                                        className="modern-select-box"
                                                    />
                                                    {errors.type && touched.type && (
                                                        <div className="text-red-500 text-[10px] font-medium ml-1">{errors.type}</div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="md:col-span-2">
                                                <FormField label="Description" name="description" placeholder="Brief description..." type="textarea" className="!h-16 !text-xs !rounded" labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1 transition-colors" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors">Location Details</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div className="md:col-span-2">
                                                <FormField label="Full Address" name="address" required className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1 transition-colors" />
                                            </div>
                                            <div className="md:col-span-2">
                                                <div className="flex flex-col gap-1.5">
                                                    <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight ml-1 transition-colors">Google Maps Link</label>
                                                    <FormField name="googleAddress" placeholder="Maps URL" className="!h-[32px] !text-xs !rounded" noLabel />
                                                </div>
                                            </div>
                                            <FormField label="Latitude" name="lat" type="number" className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1 transition-colors" />
                                            <FormField label="Longitude" name="lng" type="number" className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="modal-section">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Manage Contacts</p>
                                        </div>
                                        <FieldArray name="contact">
                                            {({ push, remove }) => (
                                                <div className="space-y-2">
                                                    {values.contact.map((_, index) => (
                                                        <div key={index} className="flex gap-2 items-start">
                                                            <div className="flex-1 bg-slate-50 dark:bg-slate-900/40 p-1 rounded flex gap-2 border border-slate-100 dark:border-slate-800 transition-colors">
                                                                <div className="flex-1">
                                                                    <Input
                                                                        value={values.contact[index].name}
                                                                        onChange={(e) => setFieldValue(`contact.${index}.name`, e.target.value)}
                                                                        placeholder="Label"
                                                                        className="!border-none !bg-transparent !shadow-none !h-[28px] !text-xs font-bold text-slate-600 dark:text-slate-300 transition-colors"
                                                                    />
                                                                </div>
                                                                <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 self-center" />
                                                                <div className="flex-[1.5] flex items-center">
                                                                    <Input
                                                                        value={values.contact[index].number}
                                                                        onChange={(e) => setFieldValue(`contact.${index}.number`, e.target.value)}
                                                                        placeholder="Number"
                                                                        className="!border-none !bg-transparent !shadow-none !h-[28px] !text-xs dark:text-slate-200 transition-colors"
                                                                    />
                                                                </div>
                                                            </div>
                                                            {values.contact.length > 1 && (
                                                                <CustomButton
                                                                    type="secondary"
                                                                    danger
                                                                    onClick={() => remove(index)}
                                                                    icon={<FaTrash size={10} />}
                                                                    className="!h-[30px] !w-[30px] !rounded flex items-center justify-center p-0"
                                                                />
                                                            )}
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => push({ name: "", number: "" })}
                                                        className="text-[10px] font-bold text-[#006666] dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/30 px-2 py-1 rounded transition-colors flex items-center gap-1 mt-1"
                                                    >
                                                        <FaPlus size={8} /> Add More Contact
                                                    </button>
                                                </div>
                                            )}
                                        </FieldArray>
                                    </div>

                                    <div className="modal-section !mb-0">
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors">Other Information</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <FormField label="Timings" name="timing" className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1 transition-colors" />
                                            <FormField label="Services" name="services" className="!h-[32px] !text-xs !rounded" labelClassName="!text-[11px] !font-bold text-slate-500 dark:text-slate-400 !uppercase !tracking-tight !ml-1 transition-colors" />
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 transition-colors">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleCloseModal}
                                />
                                <CustomButton
                                    label="Update Place"
                                    htmlType="submit"
                                    loading={updatePlace.isLoading || isSubmitting || isUploading}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default UpdatePlaceModal;
