"use client";
import { Pagination, Table, Tooltip, Switch, Tag } from "antd";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit, FaTrash, FaKey } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { useUsersContext } from "@/context/admin/users/UsersContext";
import { timestampToDate } from "@/utils/date";
import { DELETE_USER, UPDATE_USER } from "@/app/api/admin/users";
import { popoverContent } from "@/components/popHover/popHoverContent";
import { getTagColor } from "@/utils/tagColor";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { UPDATE_USER_STATUS } from "@/app/api/admin/admin-users"; // Borrowing from admin-users if applicable or adding to users

function UsersTable({ modal, setModal }) {
    const queryClient = useQueryClient();
    const { usersList, onChange, setFilters } = useUsersContext();
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
        mutationFn: async (data) => {
            // If we don't have a specific UPDATE_USER_STATUS, we can use UPDATE_USER
            return await UPDATE_USER(data);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries("usersList");
            toast.success(data?.message || "Status updated successfully");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
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

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: DELETE_USER,
        onSuccess: (data) => {
            queryClient.invalidateQueries("usersList");
            toast.success(data?.message);
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete user");
            closeConfirmModal();
        },
    });

    const handleDelete = (data) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: 'Are you sure you want to delete this user? This action cannot be undone.',
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate({
                _id: data._id,
            })
        });
    };

    const handleSorting = (pagination, filters, sorter) => {
        setFilters(prev => ({
            ...prev,
            sortingKey: sorter.field,
            sortOrder: sorter.order === "ascend" ? 1 : -1
        }));
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
            heading: "Reset Password",
            icon: <FaKey size={16} />,
            handleFunction: (record) => setModal({
                name: "ResetPassword",
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
            sorter: true,
            width: 150,
            render: (name) => (
                <div className="capitalize overflow-hidden whitespace-nowrap text-ellipsis">
                    {name}
                </div>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            sorter: true,
            width: 200,
            render: (email) => (
                <div className="overflow-hidden whitespace-nowrap text-ellipsis">
                    {email}
                </div>
            ),
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            width: 150,
            render: (phone) => <span>{phone || "-"}</span>,
        },
        {
            title: "Gender",
            dataIndex: "gender",
            key: "gender",
            width: 100,
            align: "center",
            render: (gender) => (
                <span
                    className="mr-0 text-[10px] px-2 py-1 rounded capitalize font-semibold text-white"
                    style={{ backgroundColor: getTagColor(gender) }}
                >
                    {gender || "N/A"}
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
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 150,
            render: (text) => <div className="whitespace-nowrap">{timestampToDate(text)}</div>,
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
                    spinning: usersList?.isLoading,
                    indicator: <Loading />,
                }}
                columns={columns}
                dataSource={usersList?.data?.data?.docs}
                pagination={false}
                onChange={handleSorting}
            />

            <Pagination
                className="flex justify-end mt-4"
                pageSize={usersList?.data?.data?.limit}
                total={usersList?.data?.data?.totalDocs}
                current={usersList?.data?.data?.page}
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
                loading={deleteMutation.isLoading || manageStatusMutation.isLoading}
            />
        </>
    );
}

export default UsersTable;
