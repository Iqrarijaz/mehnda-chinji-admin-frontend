"use client";
import React, { useState } from "react";
import { Table, Pagination } from "antd";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRolesContext } from "@/context/admin/roles/RolesContext";
import { useMutation, useQueryClient } from "react-query";
import { DELETE_ROLE } from "@/app/api/admin/roles";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { popoverContent } from "@/components/popHover/popHoverContent";
import Loading from "@/animations/homePageLoader";
import ConfirmModal from "@/components/shared/ConfirmModal";

const RolesTable = ({ setModal }) => {
    const { rolesList, filters, onChange } = useRolesContext();
    const queryClient = useQueryClient();

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

    const deleteMutation = useMutation({
        mutationFn: DELETE_ROLE,
        onSuccess: () => {
            queryClient.invalidateQueries("rolesList");
            toast.success("Role deleted successfully");
            closeConfirmModal();
        },
        onError: () => {
            toast.error("Failed to delete role");
            closeConfirmModal();
        },
    });

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
            handleFunction: (record) =>
                setModal({
                    name: "Edit",
                    data: record,
                    state: true,
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
            width: 200,
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 400,
            render: (text) => (
                <div className="overflow-hidden whitespace-nowrap text-ellipsis" title={text}>
                    {text || "-"}
                </div>
            ),
        },
        {
            title: "Permissions",
            dataIndex: "permissions",
            key: "permissions",
            width: 120,
            align: "center",
            render: (permissions) => (
                <span className="text-[10px] px-2 py-1 rounded bg-blue-500 text-white font-semibold">
                    {permissions?.length || 0} permissions
                </span>
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
                scroll={{ x: 800 }}
                loading={{
                    spinning: rolesList.isLoading,
                    indicator: <Loading />,
                }}
                columns={columns}
                dataSource={rolesList?.data?.data?.docs || []}
                pagination={false}
            />

            <Pagination
                className="flex justify-end mt-4"
                pageSize={filters.itemsPerPage}
                total={rolesList?.data?.data?.totalDocs || 0}
                current={filters.currentPage}
                onChange={(page, pageSize) => onChange({ currentPage: page, itemsPerPage: pageSize })}
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
};

export default RolesTable;
