"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaShapes, FaLayerGroup, FaPlus } from "react-icons/fa";

import { FormSkeleton } from "@/components/shared/Skeletons";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_CATEGORY } from "@/app/api/admin/categories";
import SelectBox from "@/components/SelectBox";
import CustomButton from "@/components/shared/CustomButton";


const validationSchema = Yup.object().shape({
    name_en: Yup.string().required("English name is required"),
    name_ur: Yup.string().required("Urdu name is required"),
    type: Yup.string().oneOf(["PLACES", "SERVICES"]).required("Type is required"),
});

const initialValues = {
    name_en: "",
    name_ur: "",
    type: "PLACES",
};

function AddCategoryModal({ modal, setModal }) {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();

    const createCategory = useMutation({
        mutationKey: ["createCategory"],
        mutationFn: CREATE_CATEGORY,
        onSuccess: (data) => {
            toast.success(data?.message || "Category added successfully");
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "categoriesList",
            });
            handleCloseModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleSubmit = (values) => {
        createCategory.mutate(values);
    };

    const handleCloseModal = () => {
        formikRef.current?.resetForm();
        setModal({ name: null, state: false, data: null });
    };

    useEffect(() => {
        if (!modal.state) {
            formikRef.current?.resetForm();
        }
    }, [modal.state]);

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                        <FaLayerGroup size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">Add Category</span>
                    </div>
                </div>
            }
            centered
            width={600}
            open={modal?.name === "Add" && modal?.state}
            onCancel={handleCloseModal}
            footer={null}
            className="modern-modal"
        >
            <div className="p-1">
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-2">
                            {createCategory.status === "loading" ? (
                                <FormSkeleton fields={2} />
                            ) : (
                                <>
                                    <div className="modal-section">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Localization</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <FormField label="Name (English)" name="name_en" placeholder="e.g. Restaurants" required className="!h-[32px] !text-xs" />
                                            <FormField label="Name (Urdu)" name="name_ur" placeholder="e.g. ریسٹورنٹ" required className="!h-[32px] !text-xs" />
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
                                                height="32px"
                                                className="modern-select-box"
                                            />
                                            {touched.type && errors.type && (
                                                <div className="text-red-500 text-[10px] font-medium">{errors.type}</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                             <div className="flex justify-end gap-2 pt-3 mt-3 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleCloseModal}
                                />
                                <CustomButton
                                    label="Add Category"
                                    htmlType="submit"
                                    loading={createCategory.isLoading || isSubmitting}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default AddCategoryModal;