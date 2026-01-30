"use client";
import React from "react";
import { Table, Button, Tag, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { useAdminUsersContext } from "@/context/admin/admin-users/AdminUsersContext";
import { DELETE_ADMIN_USER } from "@/app/api/admin/admin-users";

const AdminUsersTable = ({ setModal }) => {
    const queryClient = useQueryClient();
    const { adminUsersList, filters, onChange } = useAdminUsersContext();
    const { data, isLoading } = adminUsersList;

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
            render: (status) => (
                <Tag color={status === "ACTIVE" ? "success" : "error"}>
                    {status}
                </Tag>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            render: (_, record) => (
                <div className="flex gap-2">
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => setModal({ name: "Edit", data: record, state: true })}
                            className="text-blue-600 hover:text-blue-800"
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Delete Admin User"
                        description="Are you sure you want to delete this admin user?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Delete">
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                className="text-red-600 hover:text-red-800"
                                loading={deleteMutation.isLoading}
                            />
                        </Tooltip>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={data?.data?.docs || []}
            rowKey="_id"
            loading={isLoading}
            pagination={{
                current: data?.data?.page || 1,
                pageSize: data?.data?.limit || 10,
                total: data?.data?.totalDocs || 0,
                showSizeChanger: false,
                onChange: (page) => onChange({ page }),
            }}
            scroll={{ x: 800 }}
            className="custom-table"
        />
    );
};

export default AdminUsersTable;
