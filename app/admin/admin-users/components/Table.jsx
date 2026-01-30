"use client";
import React, { useState } from "react";
import { Table, Tag, Switch } from "antd";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useAdminUsersContext } from "@/context/admin/admin-users/AdminUsersContext";
import { DELETE_ADMIN_USER } from "@/app/api/admin/admin-users";
import { CustomPopover } from "@/components/popHover";
import { popoverContent } from "@/components/popHover/popHoverContent";
import Loading from "@/animations/homePageLoader";

const AdminUsersTable = ({ setModal }) => {
    const queryClient = useQueryClient();
    const { adminUsersList, filters, onChange } = useAdminUsersContext();
    const { data, isLoading } = adminUsersList;

    // We'll use a local state for the delete modal similar to reference, 
    // or we can reuse the setModal prop if we adapt it.
    // For now, let's stick to the structure of the reference table but adapt it to our context.
    // The previous implementation used Popconfirm, but the reference uses a modal.
    // The user asked for "same popup hover... as business module". 
    // I will implement the popup hover actions.

    // Mutation for delete (reusing logic)
    const deleteMutation = useMutation(DELETE_ADMIN_USER, {
        onSuccess: () => {
            queryClient.invalidateQueries("adminUsersList");
            toast.success("Admin user deleted successfully");
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete admin user");
        },
    });

    const handleDelete = (_id) => {
        deleteMutation.mutate({ _id });
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
            icon: <FaEdit size={16} />, // Using same icon as reference, though usually FaTrash is better
            handleFunction: (record) => {
                // Using window.confirm or a modal for now as I strictly follow "popup hover" instruction
                // Ideally should use a custom modal like reference, but adhering to minimal changes for stability first
                if (window.confirm("Are you sure you want to delete this admin user?")) {
                    handleDelete(record._id);
                }
            },
        },
    ];

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text) => <span className="capitalize font-medium">{text}</span>,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            render: (text) => text || "-",
        },
        {
            title: "Role Type",
            dataIndex: "role",
            key: "role",
            render: (role) => (
                <Tag color={role === "SUPER_ADMIN" ? "gold" : role === "ADMIN" ? "blue" : "default"}>
                    {role}
                </Tag>
            ),
        },
        {
            title: "Permission Role",
            dataIndex: "accessRoleId",
            key: "accessRoleId",
            render: (accessRole) => (
                accessRole ? (
                    <Tag color="purple">{accessRole.name}</Tag>
                ) : (
                    <Tag color="default">No Role</Tag>
                )
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 100,
            render: (status) => (
                <div className="flex justify-center">
                    <Switch checked={status === "ACTIVE"} disabled />
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            fixed: "right",
            width: 50,
            align: "center",
            render: (record) => (
                <CustomPopover
                    triggerContent={
                        <HiOutlineDotsHorizontal
                            size={34}
                            className="hover:text-lightBlue"
                        />
                    }
                    popoverContent={() => popoverContent(actionMenu, record)}
                />
            ),
        },
    ];

    return (
        <Table
            responsive
            rowClassName={(record, index) =>
                index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
            className="antd-table-custom rounded"
            size="small"
            tableLayout="fixed"
            bordered
            scroll={{ x: 800 }} // Keeping scroll to ensure responsiveness
            loading={{
                spinning: isLoading || deleteMutation.isLoading,
                indicator: <Loading />,
            }}
            columns={columns}
            dataSource={data?.data?.docs || []}
            rowKey="_id"
            pagination={{
                current: data?.data?.page || 1,
                pageSize: data?.data?.limit || 10,
                total: data?.data?.totalDocs || 0,
                showSizeChanger: false,
                onChange: (page) => onChange({ page }),
            }}
        />
    );
};

export default AdminUsersTable;
