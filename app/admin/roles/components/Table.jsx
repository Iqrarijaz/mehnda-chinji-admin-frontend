"use client";
import React from "react";
import { Table, Modal } from "antd";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useRolesContext } from "@/context/admin/roles/RolesContext";
import { useMutation, useQueryClient } from "react-query";
import { DELETE_ROLE } from "@/app/api/admin/roles";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { popoverContent } from "@/components/popHover/popHoverContent";

const RolesTable = ({ setModal }) => {
    const { rolesList, filters, onChange } = useRolesContext();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: DELETE_ROLE,
        onSuccess: () => {
            queryClient.invalidateQueries("rolesList");
            toast.success("Role deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete role");
        },
    });

    const handleDelete = (record) => {
        Modal.confirm({
            title: "Confirm Deletion",
            content: "Are you sure you want to delete this role?",
            okText: "Yes",
            cancelText: "No",
            centered: true,
            onOk: () => deleteMutation.mutate({ _id: record._id }),
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
            width: "30%",
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: "50%",
        },
        {
            title: "Actions",
            key: "actions",
            width: 100,
            align: "center",
            render: (record) => (
                <CustomPopover
                    triggerContent={
                        <HiOutlineDotsHorizontal
                            size={28}
                            className="hover:text-secondary cursor-pointer"
                        />
                    }
                    popoverContent={() => popoverContent(actionMenu, record)}
                />
            ),
        },
    ];

    return (
        <Table
            rowKey="_id"
            columns={columns}
            dataSource={rolesList?.data?.data?.docs || []}
            loading={rolesList.isLoading}
            pagination={{
                current: filters.currentPage,
                pageSize: filters.itemsPerPage,
                total: rolesList?.data?.data?.totalDocs || 0,
                onChange: (page, pageSize) =>
                    onChange({ currentPage: page, itemsPerPage: pageSize }),
            }}
            scroll={{ x: true }}
        />
    );
};

export default RolesTable;
