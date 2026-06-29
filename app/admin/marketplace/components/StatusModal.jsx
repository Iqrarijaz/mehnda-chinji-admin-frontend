"use client";
import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Input, Button } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { UPDATE_MARKETPLACE_STATUS } from "@/app/api/admin/marketplace";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const StatusListingModal = React.memo(function StatusListingModal({ modal, setModal }) {
    const queryClient = useQueryClient();
    const [form] = Form.useForm();
    const [selectedStatus, setSelectedStatus] = useState("");

    const handleClose = () => {
        form.resetFields();
        setSelectedStatus("");
        setModal({ name: null, data: null, state: false });
    };

    useEffect(() => {
        if (modal.name === "Status" && modal.data) {
            form.setFieldsValue({
                status: modal.data.status,
                rejectedReason: modal.data.rejectedReason || ""
            });
            setSelectedStatus(modal.data.status);
        }
    }, [modal, form]);

    const handleStatusUpdate = useMutation({
        mutationKey: ["updateMarketplaceStatus"],
        mutationFn: (data) => UPDATE_MARKETPLACE_STATUS(data),
        onSuccess: (data) => {
            toast.success(data?.message || "Listing status updated successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.MARKETPLACE.LIST]);
            handleClose();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to update status");
        }
    });

    const onSubmit = (values) => {
        handleStatusUpdate.mutate({
            listingId: modal.data._id,
            status: values.status,
            rejectedReason: values.status === "rejected" ? values.rejectedReason : undefined
        });
    };

    return (
        <Modal
            open={modal.name === "Status" && modal.state}
            onCancel={handleClose}
            title="Moderate Marketplace Listing"
            footer={null}
            destroyOnClose
            width={450}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onSubmit}
                className="mt-4"
            >
                <Form.Item
                    name="status"
                    label="Listing Status"
                    rules={[{ required: true, message: "Please select a status" }]}
                >
                    <Select
                        placeholder="Select status"
                        onChange={(val) => setSelectedStatus(val)}
                        options={[
                            { label: "Pending Audit", value: "pending" },
                            { label: "Approve (Live)", value: "live" },
                            { label: "Reject Listing", value: "rejected" },
                            { label: "Mark as Sold", value: "sold" }
                        ]}
                    />
                </Form.Item>

                {selectedStatus === "rejected" && (
                    <Form.Item
                        name="rejectedReason"
                        label="Reason for Rejection"
                        rules={[{ required: true, message: "Please enter the rejection reason" }]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="e.g. Inappropriate images, invalid price, fake contact details..."
                        />
                    </Form.Item>
                )}

                <div className="flex justify-end gap-2 mt-6">
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="primary" htmlType="submit" loading={handleStatusUpdate.isLoading}>
                        Update Status
                    </Button>
                </div>
            </Form>
        </Modal>
    );
});

export default StatusListingModal;
