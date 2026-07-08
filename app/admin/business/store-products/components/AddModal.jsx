import React, { useRef } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Modal, Select, Switch } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaBoxOpen } from "react-icons/fa";
import FormField from "@/components/InnerPage/FormField";
import SelectField from "@/components/InnerPage/SelectField";
import CustomButton from "@/components/shared/CustomButton";
import { useCreateStoreProduct } from "../../hooks/useStore";

const { Option } = Select;

const validationSchema = Yup.object().shape({
    name: Yup.string().required("Product name is required"),
    categoryId: Yup.string().required("Category is required"),
    price: Yup.number().typeError("Price must be a number").required("Price is required").min(0, "Price cannot be negative"),
    discountValue: Yup.number().typeError("Discount value must be a number").min(0, "Cannot be negative"),
    stock: Yup.number().typeError("Stock must be a number").integer().min(0, "Cannot be negative"),
    primaryImage: Yup.string().url("Must be a valid URL").required("Primary Image URL is required"),
    galleryImage1: Yup.string().url("Must be a valid URL"),
    galleryImage2: Yup.string().url("Must be a valid URL"),
});

const initialValues = {
    name: "",
    categoryId: "",
    price: "",
    discountType: "flat",
    discountValue: 0,
    trackInventory: false,
    stock: 0,
    status: "DRAFT",
    primaryImage: "",
    galleryImage1: "",
    galleryImage2: "",
};

const AddProductModal = React.memo(({ modal, setModal, businessId, categories }) => {
    const formikRef = useRef(null);

    const createMutation = useCreateStoreProduct(() => setModal({ name: null, state: false, data: null }));

    const handleSubmit = (values, { setSubmitting }) => {
        const images = [];
        if (values.primaryImage) {
            images.push({ url: values.primaryImage, sortOrder: 0, isPrimary: true });
        }
        if (values.galleryImage1) {
            images.push({ url: values.galleryImage1, sortOrder: 1, isPrimary: false });
        }
        if (values.galleryImage2) {
            images.push({ url: values.galleryImage2, sortOrder: 2, isPrimary: false });
        }

        const payload = {
            businessId,
            name: values.name,
            categoryId: values.categoryId,
            price: Number(values.price),
            discount: {
                type: values.discountType,
                value: Number(values.discountValue)
            },
            trackInventory: values.trackInventory,
            stock: values.trackInventory ? Number(values.stock) : 0,
            status: values.status,
            images
        };

        createMutation.mutate(payload, {
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
                        <FaBoxOpen size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] block mt-1">Add Product</span>
                    </div>
                </div>
            }
            centered
            width={750}
            open={modal?.name === "Add" && modal?.state}
            onCancel={handleClose}
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
                    {({ values, setFieldValue, errors, touched, isSubmitting }) => (
                        <Form className="space-y-4">
                            
                            {/* Basic Section */}
                            <div className="bg-slate-50/50 p-3 rounded border border-slate-100/50 space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Info & Catalog</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div className="md:col-span-2">
                                        <FormField
                                            label="Product Name"
                                            name="name"
                                            placeholder="e.g. Fresh Mango Juice"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <SelectField
                                            label="Category"
                                            name="categoryId"
                                            required
                                            options={categories.map(cat => ({ label: cat.name, value: cat._id }))}
                                            onChange={(e) => setFieldValue("categoryId", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <SelectField
                                            label="Product Status"
                                            name="status"
                                            options={[
                                                { label: "ACTIVE", value: "ACTIVE" },
                                                { label: "OUT OF STOCK", value: "OUT_OF_STOCK" },
                                                { label: "DRAFT", value: "DRAFT" },
                                                { label: "ARCHIVED", value: "ARCHIVED" }
                                            ]}
                                            onChange={(e) => setFieldValue("status", e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="p-3 rounded border border-slate-100 space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Pricing & Discounts</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <FormField
                                            label="Base Price (Rs.)"
                                            name="price"
                                            placeholder="Base Price"
                                            required
                                            type="number"
                                        />
                                    </div>
                                    <div>
                                        <SelectField
                                            label="Discount Type"
                                            name="discountType"
                                            options={[
                                                { label: "Flat Cash (Rs.)", value: "flat" },
                                                { label: "Percentage (%)", value: "percentage" }
                                            ]}
                                            onChange={(e) => setFieldValue("discountType", e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <FormField
                                            label="Discount Value"
                                            name="discountValue"
                                            placeholder="Discount Value"
                                            type="number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Inventory Section */}
                            <div className="bg-slate-50/50 p-3 rounded border border-slate-100/50 space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Inventory Management</p>
                                <div className="flex items-center justify-between px-1">
                                    <div>
                                        <span className="text-xs font-bold text-slate-600 block">Track Inventory stock</span>
                                        <span className="text-[10px] text-slate-400 block">Automatically update status to OUT_OF_STOCK when item stock reaches 0.</span>
                                    </div>
                                    <Switch
                                        checked={values.trackInventory}
                                        onChange={(checked) => setFieldValue("trackInventory", checked)}
                                        className="custom-switch"
                                    />
                                </div>
                                {values.trackInventory && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-200/50">
                                        <div>
                                            <FormField
                                                label="Available Stock Items"
                                                name="stock"
                                                placeholder="e.g. 25"
                                                type="number"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Images Section */}
                            <div className="p-3 rounded border border-slate-100 space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Product Images</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="md:col-span-3">
                                        <FormField
                                            label="Primary/Cover Image URL"
                                            name="primaryImage"
                                            placeholder="https://example.com/cover-image.png"
                                            required
                                        />
                                    </div>
                                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <FormField
                                            label="Gallery Image URL 1"
                                            name="galleryImage1"
                                            placeholder="https://example.com/gallery-1.png"
                                        />
                                        <FormField
                                            label="Gallery Image URL 2"
                                            name="galleryImage2"
                                            placeholder="https://example.com/gallery-2.png"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <CustomButton
                                    label="Cancel"
                                    type="secondary"
                                    onClick={handleClose}
                                />
                                <CustomButton
                                    label="Create Product"
                                    htmlType="submit"
                                    loading={createMutation.isPending || isSubmitting}
                                />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

AddProductModal.displayName = "AddProductModal";

export default AddProductModal;
