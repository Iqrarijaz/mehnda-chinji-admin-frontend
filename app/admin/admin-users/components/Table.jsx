"use client";
import React, { useState } from "react";
import { Table, Pagination, Switch } from "antd";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useAdminUsersContext } from "@/context/admin/admin-users/AdminUsersContext";
import { DELETE_ADMIN_USER, UPDATE_ADMIN_USER_STATUS } from "@/app/api/admin/admin-users";
import { CustomPopover } from "@/components/popHover";
import { popoverContent } from "@/components/popHover/popHoverContent";
import Loading from "@/animations/homePageLoader";
import { getTagColor } from "@/utils/tagColor";
import ConfirmModal from "@/components/shared/ConfirmModal";

const AdminUsersTable = ({ setModal }) => {
    const queryClient = useQueryClient();
    const { adminUsersList, filters, onChange } = useAdminUsersContext();
    const { data, isLoading } = adminUsersList;

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

    // Status mutation
    const manageStatusMutation = useMutation({
        mutationFn: UPDATE_ADMIN_USER_STATUS,
        onSuccess: (data) => {
            queryClient.invalidateQueries("adminUsersList");
            toast.success(data?.message || "Status updated successfully");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
            closeConfirmModal();
        },
    });

    // Mutation for delete
    const deleteMutation = useMutation(DELETE_ADMIN_USER, {
        onSuccess: () => {
            queryClient.invalidateQueries("adminUsersList");
            toast.success("Admin user deleted successfully");
            closeConfirmModal();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete admin user");
            closeConfirmModal();
        },
    });

    const handleStatus = (record) => {
        const newStatus = record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Status Change',
            description: `Are you sure you want to ${record.status === "ACTIVE" ? 'deactivate' : 'activate'} "${record.name}"?`,
            confirmText: 'Yes, Change',
            cancelText: 'No, Keep',
            variant: 'primary',
            onConfirm: () => manageStatusMutation.mutate({
                _id: record._id,
                status: newStatus
            })
        });
    };

    const handleDelete = (record) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: `Are you sure you want to delete "${record.name}"? This action cannot be undone.`,
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
            handleFunction: (record) => {
                setModal({ name: "Edit", data: record, state: true });
            },
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
            width: 150,
            render: (text) => <span className="capitalize font-medium">{text}</span>,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 250,
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            width: 150,
            render: (text) => text || "-",
        },
        {
            title: "Role Type",
            dataIndex: "role",
            key: "role",
            width: 150,
            align: "center",
            render: (role) => (
                <span
                    className="mr-0 text-[10px] px-2 py-1 rounded capitalize font-semibold text-white"
                    style={{ backgroundColor: getTagColor(role) }}
                >
                    {role}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 100,
            render: (status, record) => (
                <Switch
                    checked={status === "ACTIVE"}
                    onChange={() => handleStatus(record)}
                    className={status === "ACTIVE" ? '' : 'ant-switch-red'}
                />
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 80,
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
        },
    ];

    return (
        <>
            <Table
                rowKey="_id"
                className="antd-table-custom rounded"
                size="small"
                tableLayout="fixed"
                bordered
                scroll={{ x: 900 }}
                loading={{
                    spinning: isLoading,
                    indicator: <Loading />,
                }}
                columns={columns}
                dataSource={data?.data?.docs || []}
                pagination={false}
            />

            <Pagination
                className="flex justify-end mt-4"
                pageSize={data?.data?.limit || 10}
                total={data?.data?.totalDocs || 0}
                current={data?.data?.page || 1}
                onChange={(page) => onChange({ page })}
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
                loading={manageStatusMutation.isLoading || deleteMutation.isLoading}
            />
        </>
    );
};

export default AdminUsersTable;
