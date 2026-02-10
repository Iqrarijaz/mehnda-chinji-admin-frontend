"use client";
import { Pagination, Table, Tooltip, Switch, Tag } from "antd";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit, FaTrash } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { useBloodDonorsContext } from "@/context/admin/blood-donors/BloodDonorsContext";
import { UPDATE_BLOOD_DONOR, DELETE_BLOOD_DONOR } from "@/app/api/admin/blood-donors";
import { popoverContent } from "@/components/popHover/popHoverContent";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { getTagColor } from "@/utils/tagColor";

function BloodDonorsTable({ modal, setModal }) {
    const queryClient = useQueryClient();
    const { bloodDonorsList, onChange } = useBloodDonorsContext();
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        description: "",
        onConfirm: null,
        variant: "primary",
        confirmText: "Confirm",
        cancelText: "Cancel"
    });

    const closeConfirmModal = () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    };

    const statusMutation = useMutation({
        mutationFn: UPDATE_BLOOD_DONOR,
        onSuccess: () => {
            queryClient.invalidateQueries("bloodDonorsList");
            toast.success("Availability updated successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to update availability");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: DELETE_BLOOD_DONOR,
        onSuccess: () => {
            queryClient.invalidateQueries("bloodDonorsList");
            toast.success("Donor deleted successfully");
            closeConfirmModal();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete donor");
            closeConfirmModal();
        },
    });

    const handleDelete = (record) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: `Are you sure you want to delete donor "${record.name}"?`,
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate({ _id: record._id })
        });
    };

    const actionMenu = [
        {
            heading: "Edit",
            icon: <FaEdit size={16} />,
            handleFunction: (record) => setModal({
                name: "Update",
                data: record,
                state: true
            }),
        },
        {
            heading: "Delete",
            icon: <FaTrash size={16} />,
            handleFunction: (record) => handleDelete(record),
        },
    ];

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 100,
            render: (name) => <span className="capitalize font-medium">{name}</span>,
        },
        {
            title: "Blood Group",
            dataIndex: "bloodGroup",
            key: "bloodGroup",
            width: 80,
            align: "center",
            render: (type) => (
                <span
                    className="mr-0 text-[10px] px-2 py-1 rounded capitalize font-semibold text-white"
                    style={{ backgroundColor: getTagColor(type) }}
                >
                    {type}
                </span>
            ),
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            width: 100,
        },
        {
            title: "City",
            dataIndex: "city",
            key: "city",
            width: 70,
            render: (city) => <span className="capitalize">{city || "-"}</span>,
        },
        {
            title: "Available",
            dataIndex: "available",
            key: "available",
            align: "center",
            width: 60,
            render: (available, record) => (
                <Switch
                    checked={available}
                    onChange={(checked) => statusMutation.mutate({ _id: record._id, available: checked })}
                    className={available ? 'bg-green-500' : 'bg-red-500'}
                />
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 60,
            align: "center",
            render: (record) => (
                <div className="flex items-center justify-center">
                    <CustomPopover
                        triggerContent={
                            <HiOutlineDotsHorizontal
                                size={28}
                                className="hover:text-secondary cursor-pointer"
                            />
                        }
                        popoverContent={() => popoverContent(actionMenu, record)}
                    />
                </div>
            ),
        }
    ];

    return (
        <>
            <Table
                rowKey="_id"
                className="antd-table-custom rounded"
                size="small"
                tableLayout="fixed"
                bordered
                scroll={{ x: 800 }}
                loading={{
                    spinning: bloodDonorsList?.isLoading,
                    indicator: <Loading />,
                }}
                columns={columns}
                dataSource={bloodDonorsList?.data?.data?.docs}
                pagination={false}
            />

            <Pagination
                className="flex justify-end mt-4"
                pageSize={bloodDonorsList?.data?.data?.limit}
                total={bloodDonorsList?.data?.data?.totalDocs}
                current={bloodDonorsList?.data?.data?.page}
                onChange={(page) => onChange({ page: Number(page) })}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                description={confirmModal.description}
                confirmText={confirmModal.confirmText}
                cancelText={confirmModal.cancelText}
                variant={confirmModal.variant}
                loading={deleteMutation.isLoading}
            />
        </>
    );
}

export default BloodDonorsTable;
