import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal, Switch } from "antd";
import { FaTag } from "react-icons/fa";
import FormField from "@/components/InnerPage/FormField";
import CustomButton from "@/components/shared/CustomButton";
import { useUpdateStoreCategory } from "../../hooks/useStore";

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Category name is required"),
    sortOrder: Yup.number().typeError("Must be a number").integer().min(0, "Cannot be negative"),
});

const UpdateCategoryModal = React.memo(({ modal, setModal, businessId }) => {
    const formikRef = useRef(null);
    const category = modal?.data;

    const initialValues = {
        name: category?.name || "",
        image: category?.image || "",
        sortOrder: category?.sortOrder ?? 0,
        isActive: category?.isActive ?? true,
    };

    const updateMutation = useUpdateStoreCategory(() => setModal({ name: null, state: false, data: null }));

    const handleSubmit = (values, { setSubmitting }) => {
        updateMutation.mutate({ id: category._id, data: values }, {
            onSettled: () => setSubmitting(false),
        });
    };

    const handleClose = () => {
        setModal({ name: null, state: false, data: null });
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 flex items-center justify-center text-[#006666]">
                        <FaTag size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">Edit Category</span>
                    </div>
                </div>
            }
            centered
            width={500}
            open={modal?.name === "Update" && modal?.state}
            onCancel={handleClose}
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
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form className="space-y-4">
                            <FormField
                                label="Category Name"
                                name="name"
                                placeholder="e.g. Beverages"
                                required
                            />

                            <FormField
                                label="Category Image URL"
                                name="image"
                                placeholder="e.g. https://example.com/image.png"
                            />

                            <FormField
                                label="Sort Order"
                                name="sortOrder"
                                placeholder="0"
                                type="number"
                            />

                            <div className="flex items-center justify-between p-3 bg-slate-50/50 rounded border border-slate-100/50">
                                <div>
                                    <span className="text-xs font-bold text-slate-600 block">Status</span>
                                    <span className="text-[10px] text-slate-400 block">Active categories are visible on the store app storefront.</span>
                                </div>
                                <Switch
                                    checked={values.isActive}
                                    onChange={(checked) => setFieldValue("isActive", checked)}
                                    className="custom-switch"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleClose}
                                />
                                <CustomButton
                                    label="Save Changes"
                                    htmlType="submit"
                                    loading={updateMutation.isPending || isSubmitting}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

UpdateCategoryModal.displayName = "UpdateCategoryModal";

export default UpdateCategoryModal;
