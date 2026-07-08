import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { EditOutlined, DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Button, Table, Tag } from "antd";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";
import { useDeleteStoreCategory } from "../../hooks/useStore";

const CategoryTable = React.memo(({ modal, setModal, categoriesList, businessId }) => {
    const queryClient = useQueryClient();
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        description: "",
        onConfirm: null,
        variant: "primary",
    });

    const closeConfirmModal = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));

    const deleteMutation = useDeleteStoreCategory(closeConfirmModal);

    const handleDelete = (record) => {
        setConfirmModal({
            isOpen: true,
            title: "Confirm Deletion",
            description: `Are you sure you want to delete category "${record.name}"? This action cannot be undone.`,
            confirmText: "Yes, Delete",
            cancelText: "Cancel",
            variant: "danger",
            onConfirm: () => deleteMutation.mutate(record._id),
        });
    };

    const actionMenu = (record) => {
        const items = [];

        if (hasPermission(PERMISSIONS.STORE.CATEGORIES.UPDATE)) {
            items.push({
                key: "edit",
                label: <span className="font-medium text-slate-700">Edit Category</span>,
                icon: <EditOutlined className="text-[#006666]" />,
                onClick: () => setModal({ name: "Update", data: record, state: true }),
            });
        }

        if (hasPermission(PERMISSIONS.STORE.CATEGORIES.DELETE)) {
            items.push({
                key: "delete",
                label: <span className="font-medium text-red-600">Delete Category</span>,
                icon: <DeleteOutlined className="text-red-500" />,
                onClick: () => handleDelete(record),
            });
        }

        return {
            items,
            className: "shadow-lg border border-slate-100 dark:border-slate-800 rounded p-1",
        };
    };

    const columns = [
        {
            title: "Category Name",
            dataIndex: "name",
            key: "name",
            width: 250,
            render: (name) => (
                <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] block capitalize transition-colors duration-300">
                    {name}
                </span>
            ),
        },
        {
            title: "Sort Order",
            dataIndex: "sortOrder",
            key: "sortOrder",
            width: 120,
            render: (val) => (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium transition-colors duration-300 group-hover:text-slate-300">
                    {val ?? 0}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "isActive",
            key: "isActive",
            width: 120,
            render: (isActive) => (
                <Tag color={isActive ? "success" : "default"} className="m-0 font-bold px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider border-none">
                    {isActive ? "ACTIVE" : "INACTIVE"}
                </Tag>
            ),
        },
        {
            title: "",
            key: "actions",
            width: 80,
            align: "right",
            fixed: "right",
            render: (record) => (
                <Dropdown menu={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-base text-slate-400" />}
                        className="!rounded hover:!bg-slate-100 flex items-center justify-center h-8 w-8"
                    />
                </Dropdown>
            ),
        },
    ];

    return (
        <div className="modern-table shadow-sm border border-slate-100 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-900">
            <Table
                rowKey="_id"
                className="custom-ant-table"
                columns={columns}
                dataSource={categoriesList?.data?.data || []}
                loading={categoriesList?.status === "loading"}
                pagination={{
                    pageSize: 20,
                    showSizeChanger: true,
                    className: "px-4 pb-4",
                }}
            />

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={confirmModal.onConfirm}
                title={confirmModal.title}
                description={confirmModal.description}
                confirmText={confirmModal.confirmText || "Confirm"}
                cancelText={confirmModal.cancelText || "Cancel"}
                variant={confirmModal.variant}
                loading={deleteMutation.isPending}
            />
        </div>
    );
});

CategoryTable.displayName = "CategoryTable";

export default CategoryTable;
