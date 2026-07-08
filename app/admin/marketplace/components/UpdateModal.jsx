"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { Modal, Spin, Upload, Checkbox } from "antd";
import { FaEdit } from "react-icons/fa";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { UPDATE_MARKETPLACE } from "@/app/api/admin/marketplace";
import FormField from "@/components/InnerPage/FormField";
import CustomButton from "@/components/shared/CustomButton";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const validationSchema = Yup.object().shape({
    title: Yup.string().min(3, "Title must be at least 3 characters").max(100).required("Title is required"),
    description: Yup.string().min(10, "Description must be at least 10 characters").max(1000).required("Description is required"),
    price: Yup.number().min(1, "Price must be greater than 0").required("Price is required"),
    place: Yup.string().min(2, "Place must be at least 2 characters").required("Place is required"),
    sellerPhone: Yup.string().matches(/^03\d{9}$/, "Please enter a valid Pakistani phone number (e.g., 03001234567)").required("Seller phone is required"),
    categoryEn: Yup.string().min(2, "Category (English) must be at least 2 characters").required("Required"),
    categoryUr: Yup.string().min(2, "Category (Urdu) must be at least 2 characters").required("Required"),
    typeEn: Yup.string().min(2, "Type (English) must be at least 2 characters").required("Required"),
    typeUr: Yup.string().min(2, "Type (Urdu) must be at least 2 characters").required("Required"),
    metadataString: Yup.string().test('is-json', 'Must be a valid JSON object', (value) => {
        if (!value || !value.trim()) return true;
        try {
            const parsed = JSON.parse(value);
            return typeof parsed === 'object' && !Array.isArray(parsed);
        } catch {
            return false;
        }
    }),
    negotiable: Yup.boolean(),
    showPhoneNumber: Yup.boolean(),
    isFeatured: Yup.boolean(),
});

const UpdateListingModal = React.memo(({ modal, setModal }) => {
    const formikRef = useRef(null);
    const queryClient = useQueryClient();
    const [fileList, setFileList] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    const initialValues = useMemo(() => ({
        title: modal.data?.title || "", 
        description: modal.data?.description || "", 
        price: modal.data?.price || "", 
        place: modal.data?.place || "", 
        sellerPhone: modal.data?.sellerPhone || "",
        categoryEn: modal.data?.category?.en || "", 
        categoryUr: modal.data?.category?.ur || "", 
        typeEn: modal.data?.type?.en || "", 
        typeUr: modal.data?.type?.ur || "", 
        metadataString: modal.data?.metadata ? JSON.stringify(modal.data.metadata, null, 2) : "{}",
        negotiable: modal.data?.negotiable || false, 
        showPhoneNumber: modal.data?.showPhoneNumber ?? true, 
        isFeatured: modal.data?.isFeatured || false,
    }), [modal.data]);

    useEffect(() => {
        if (modal.name === "Update" && modal.data) {
            formikRef.current?.resetForm();
            setFileList([]);
            if (modal.data.images && Array.isArray(modal.data.images)) {
                setExistingImages(modal.data.images.map(img => ({
                    uid: img._id || img.id || Math.random().toString(),
                    name: img.name || 'image.jpg',
                    status: 'done',
                    url: img.url || img.path,
                })));
            } else {
                setExistingImages([]);
            }
        }
    }, [modal.state, modal.name, modal.data]);

    const handleClose = () => {
        formikRef.current?.resetForm();
        setFileList([]);
        setExistingImages([]);
        setModal({ name: null, data: null, state: false });
    };

    const handleUpdate = useMutation({
        mutationKey: ["updateMarketplace"],
        mutationFn: UPDATE_MARKETPLACE,
        onSuccess: (data) => {
            toast.success(data?.message || "Marketplace listing updated successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.MARKETPLACE.LIST]);
            handleClose();
        },
        onError: (error) => {
            toast.error(error?.errorMessage || error?.message || "Failed to update listing");
        },
    });

    const onSubmit = (values, { setSubmitting }) => {
        try {
            const formData = new FormData();
            formData.append("listingId", modal.data._id);
            formData.append("title", values.title.trim());
            formData.append("description", values.description.trim());
            formData.append("price", values.price);
            formData.append("place", values.place.trim());
            formData.append("sellerPhone", values.sellerPhone.trim());
            formData.append("negotiable", values.negotiable ? "true" : "false");
            formData.append("showPhoneNumber", values.showPhoneNumber ? "true" : "false");
            formData.append("isFeatured", values.isFeatured ? "true" : "false");

            let metadata = {};
            if (values.metadataString && values.metadataString.trim()) {
                metadata = JSON.parse(values.metadataString);
            }
            formData.append("metadata", JSON.stringify(metadata));

            formData.append("category", JSON.stringify({ en: values.categoryEn.trim(), ur: values.categoryUr.trim() }));
            formData.append("type", JSON.stringify({ en: values.typeEn.trim(), ur: values.typeUr.trim() }));

            fileList.forEach((file) => {
                if (file.originFileObj) {
                    formData.append("images", file.originFileObj);
                }
            });

            handleUpdate.mutate(formData, {
                onSettled: () => setSubmitting(false)
            });
        } catch (error) {
            toast.error("Error preparing form data: " + error.message);
            setSubmitting(false);
        }
    };

    const uploadProps = {
        fileList: [...existingImages, ...fileList],
        onChange: ({ fileList: newFileList }) => {
            const newFiles = newFileList.filter(f => !f.url);
            setFileList(newFiles);
        },
        beforeUpload: () => false,
        multiple: true,
        accept: "image/*",
        listType: "picture-card",
        maxCount: 10,
        onRemove: (file) => {
            if (file.url) {
                setExistingImages(prev => prev.filter(img => img.uid !== file.uid));
            } else {
                setFileList(prev => prev.filter(item => item.uid !== file.uid));
            }
        },
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 px-0 py-1">
                    <div className="w-8 h-8 rounded bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center text-[#006666] dark:text-teal-400 transition-colors duration-300">
                        <FaEdit size={16} />
                    </div>
                    <div>
                        <span className="text-lg font-bold text-[#006666] dark:text-teal-500 block mt-1 transition-colors duration-300">Update Marketplace Listing</span>
                    </div>
                </div>
            }
            centered
            width={700}
            open={modal.name === "Update" && modal.state}
            onCancel={handleClose}
            footer={null}
            className="modern-modal"
            destroyOnClose
        >
            <div className="p-1">
                <Formik
                    innerRef={formikRef}
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({ isSubmitting, values, setFieldValue }) => (
                        <Form className="space-y-2">
                            <div className="modal-section">
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">Basic Info</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField label="Item Title" name="title" placeholder="e.g. Honda Civic 2021" required />
                                    <FormField label="Price (PKR)" name="price" type="number" placeholder="e.g. 150000" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <FormField label="Place / Town" name="place" placeholder="e.g. Karachi" required />
                                    <FormField label="Seller Phone" name="sellerPhone" placeholder="e.g. 03001234567" required />
                                </div>
                                <div className="mt-2 mb-1.5">
                                    <FormField
                                        label="Description"
                                        name="description"
                                        placeholder="Enter item details..."
                                        type="textarea"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="modal-section">
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">Categorization</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField label="Category (English)" name="categoryEn" placeholder="e.g. Animals" required />
                                    <FormField label="Category (Urdu)" name="categoryUr" placeholder="e.g. جانور" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-2">
                                    <FormField label="Type (English)" name="typeEn" placeholder="e.g. Cow" required />
                                    <FormField label="Type (Urdu)" name="typeUr" placeholder="e.g. گائے" required />
                                </div>
                            </div>

                            <div className="modal-section">
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2 transition-colors duration-300">Options & Media</p>
                                <div className="mb-3">
                                    <FormField
                                        label="Metadata (JSON)"
                                        name="metadataString"
                                        placeholder='e.g. { "make": "Toyota", "model": "Civic", "year": 2021 }'
                                        type="textarea"
                                    />
                                </div>

                                <div className="mt-3">
                                    <label className="text-slate-700 dark:text-slate-400 font-semibold text-xs mb-1 transition-colors block">Upload New Images</label>
                                    <Dragger {...uploadProps}>
                                        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                                        <p className="ant-upload-text">Click or drag images to upload</p>
                                        <p className="ant-upload-hint">Support for single or bulk upload. Max 10 images.</p>
                                    </Dragger>
                                </div>

                                <div className="flex gap-4 mt-4">
                                    <Checkbox checked={values.negotiable} onChange={(e) => setFieldValue("negotiable", e.target.checked)}>Negotiable Price</Checkbox>
                                    <Checkbox checked={values.showPhoneNumber} onChange={(e) => setFieldValue("showPhoneNumber", e.target.checked)}>Show Phone Number publicly</Checkbox>
                                    <Checkbox checked={values.isFeatured} onChange={(e) => setFieldValue("isFeatured", e.target.checked)}>Featured Listing</Checkbox>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-slate-800 transition-colors">
                                <CustomButton label="Cancel" type="secondary" onClick={handleClose} disabled={isSubmitting || handleUpdate.isPending} />
                                <CustomButton label="Update Listing" htmlType="submit" loading={isSubmitting || handleUpdate.isPending} />
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
});

export default UpdateListingModal;
