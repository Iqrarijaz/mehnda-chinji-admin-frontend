"use client";
import React, { useRef, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button, Modal, Select } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { FaShapes, FaLayerGroup, FaPlus } from "react-icons/fa";

import Loading from "@/animations/homePageLoader";
import FormField from "@/components/InnerPage/FormField";
import { CREATE_CATEGORY } from "@/app/api/admin/categories";
import SelectBox from "@/components/SelectBox";

const { Option } = Select;

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
                <div className="flex items-center gap-3 px-2 pt-1">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600">
                        <FaLayerGroup size={18} />
                    </div>
                    <div>
                        <span className="text-xl font-bold text-slate-900 block">Add Category</span>
                        <span className="text-xs text-slate-500 font-normal">Create a new classification for entities</span>
                    </div>
                </div>
            }
            centered
            width={520}
            open={modal?.name === "Add" && modal?.state}
            onCancel={handleCloseModal}
            footer={null}
            className="modern-modal"
        >
            <div className="p-2 pt-4">
                <Formik
                    innerRef={formikRef}
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting, values, setFieldValue, errors, touched }) => (
                        <Form className="space-y-6">
                            {createCategory.status === "loading" && <Loading />}

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
                                    loading={createCategory.isLoading || isSubmitting}
                                    className="modal-footer-btn-primary flex-1"
                                >
                                    Add Category
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}

export default AddCategoryModal;