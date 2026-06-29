"use client";
import React from "react";
import { Modal, Form, Input, InputNumber, Checkbox, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CREATE_MARKETPLACE } from "@/app/api/admin/marketplace";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const AddListingModal = React.memo(function AddListingModal({ modal, setModal }) {
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [fileList, setFileList] = React.useState([]);

    const handleClose = () => {
        form.resetFields();
        setFileList([]);
        setModal({ name: null, data: null, state: false });
    };

    const handleCreate = useMutation({
        mutationKey: ["createMarketplace"],
        mutationFn: (formData) => CREATE_MARKETPLACE(formData),
        onSuccess: (data) => {
            toast.success(data?.message || "Marketplace listing created successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.MARKETPLACE.LIST]);
            handleClose();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to create listing");
        }
    });

    const onSubmit = (values) => {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("price", values.price);
        formData.append("place", values.place);
        formData.append("sellerPhone", values.sellerPhone);
        formData.append("negotiable", values.negotiable ? "true" : "false");
        formData.append("showPhoneNumber", values.showPhoneNumber ? "true" : "false");
        formData.append("isFeatured", values.isFeatured ? "true" : "false");
        formData.append("metadata", values.metadataString ? JSON.stringify(JSON.parse(values.metadataString)) : "{}");

        // Category & Type structures containing EN & UR translations
        formData.append("category", JSON.stringify({
            en: values.categoryEn,
            ur: values.categoryUr
        }));
        formData.append("type", JSON.stringify({
            en: values.typeEn,
            ur: values.typeUr
        }));

        fileList.forEach((file) => {
            formData.append("images", file.originFileObj);
        });

        handleCreate.mutate(formData);
    };

    const uploadProps = {
        onRemove: (file) => {
            setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
        },
        beforeUpload: (file) => {
            setFileList((prev) => [...prev, file]);
            return false;
        },
        fileList,
        multiple: true,
        accept: "image/*"
    };

    return (
        <Modal
            open={modal.name === "Add" && modal.state}
            onCancel={handleClose}
            title="Add Marketplace Listing"
            footer={null}
            destroyOnClose
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                initialValues={{
                    negotiable: false,
                    showPhoneNumber: true,
                    isFeatured: false
                }}
                className="mt-4"
            >
                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="title"
                        label="Item Title"
                        rules={[{ required: true, message: "Please enter the title" }]}
                    >
                        <Input placeholder="Enter title" />
                    </Form.Item>

                    <Form.Item
                        name="price"
                        label="Price (PKR)"
                        rules={[{ required: true, message: "Please enter the price" }]}
                    >
                        <InputNumber className="w-full" min={0} placeholder="Enter price" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="categoryEn"
                        label="Category (English)"
                        rules={[{ required: true, message: "Please enter English category name" }]}
                    >
                        <Input placeholder="e.g. Animals" />
                    </Form.Item>

                    <Form.Item
                        name="categoryUr"
                        label="Category (Urdu)"
                        rules={[{ required: true, message: "Please enter Urdu category name" }]}
                    >
                        <Input placeholder="e.g. جانور" className="text-right" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="typeEn"
                        label="Type (English)"
                        rules={[{ required: true, message: "Please enter English type/subcategory" }]}
                    >
                        <Input placeholder="e.g. Cow" />
                    </Form.Item>

                    <Form.Item
                        name="typeUr"
                        label="Type (Urdu)"
                        rules={[{ required: true, message: "Please enter Urdu type/subcategory" }]}
                    >
                        <Input placeholder="e.g. گائے" className="text-right" />
                    </Form.Item>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                        name="place"
                        label="Place / Town"
                        rules={[{ required: true, message: "Please enter place" }]}
                    >
                        <Input placeholder="e.g. Karachi" />
                    </Form.Item>

                    <Form.Item
                        name="sellerPhone"
                        label="Seller Phone"
                        rules={[{ required: true, message: "Please enter phone number" }]}
                    >
                        <Input placeholder="e.g. 03001234567" />
                    </Form.Item>
                </div>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: "Please enter description" }]}
                >
                    <Input.TextArea rows={4} placeholder="Enter item condition, breed, age details..." />
                </Form.Item>

                <Form.Item
                    name="metadataString"
                    label="Metadata (JSON)"
                    rules={[
                        {
                            validator: (_, value) => {
                                if (!value) return Promise.resolve();
                                try {
                                    JSON.parse(value);
                                    return Promise.resolve();
                                } catch (e) {
                                    return Promise.reject("Invalid JSON format");
                                }
                            }
                        }
                    ]}
                >
                    <Input.TextArea rows={3} placeholder='e.g. { "make": "Toyota", "model": "Civic", "year": 2021 }' />
                </Form.Item>

                <Form.Item label="Upload Images">
                    <Upload {...uploadProps}>
                        <Button icon={<UploadOutlined />}>Select Files</Button>
                    </Upload>
                </Form.Item>

                <div className="flex gap-4 mb-4">
                    <Form.Item name="negotiable" valuePropName="checked" className="mb-0">
                        <Checkbox>Negotiable Price</Checkbox>
                    </Form.Item>

                    <Form.Item name="showPhoneNumber" valuePropName="checked" className="mb-0">
                        <Checkbox>Show Phone Number publicly</Checkbox>
                    </Form.Item>

                    <Form.Item name="isFeatured" valuePropName="checked" className="mb-0">
                        <Checkbox>Featured Listing</Checkbox>
                    </Form.Item>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={handleCreate.isLoading}>
                        Create
                    </Button>
                </div>
            </Form>
        </Modal>
    );
});

export default AddListingModal;
