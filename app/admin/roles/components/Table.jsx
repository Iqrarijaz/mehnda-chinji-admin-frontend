"use client";
import React from "react";
import { Table, Button, Popconfirm, Space, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRolesContext } from "@/context/admin/roles/RolesContext";
import { useMutation, useQueryClient } from "react-query";
import { DELETE_ROLE } from "@/app/api/admin/roles";
import { toast } from "react-toastify";

const RolesTable = ({ setModal }) => {
    const { rolesList, filters, onChange } = useRolesContext();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation(DELETE_ROLE, {
        onSuccess: () => {
            queryClient.invalidateQueries("rolesList");
            toast.success("Role deleted successfully");
        },
        onError: () => {
            toast.error("Failed to delete role");
        },
    });

    const handleDelete = (id) => {
        deleteMutation.mutate({ _id: id });
    };

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
            width: "40%",
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Tooltip title="Edit">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => setModal({ name: "Edit", data: record, state: true })}
                            className="bg-blue-500"
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Popconfirm
                            title="Delete Role"
                            description="Are you sure you want to delete this role?"
                            onConfirm={() => handleDelete(record._id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={rolesList?.data?.data?.docs || []}
            loading={rolesList.isLoading}
            rowKey="_id"
            pagination={{
                current: filters.currentPage,
                pageSize: filters.itemsPerPage,
                total: rolesList?.data?.data?.totalDocs || 0,
                onChange: (page, pageSize) => {
                    onChange({ currentPage: page, itemsPerPage: pageSize });
                },
            }}
            scroll={{ x: true }}
        />
    );
};

export default RolesTable;
