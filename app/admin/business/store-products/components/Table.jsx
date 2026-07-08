import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { EditOutlined, DeleteOutlined, EllipsisOutlined, EyeOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Button, Table, Tag, Avatar, Space } from "antd";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";
import { useDeleteStoreProduct } from "../../hooks/useStore";

const ProductTable = React.memo(({ modal, setModal, productsList, onChange, businessId }) => {
    const queryClient = useQueryClient();
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        description: "",
        onConfirm: null,
        variant: "primary",
    });

    const closeConfirmModal = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));

    const deleteMutation = useDeleteStoreProduct(closeConfirmModal);

    const handleDelete = (record) => {
        setConfirmModal({
            isOpen: true,
            title: "Confirm Deletion",
            description: `Are you sure you want to delete product "${record.name}"? This action cannot be undone.`,
            confirmText: "Yes, Delete",
            cancelText: "Cancel",
            variant: "danger",
            onConfirm: () => deleteMutation.mutate(record._id),
        });
    };

    const actionMenu = (record) => {
        const items = [];

        if (hasPermission(PERMISSIONS.STORE.PRODUCTS.READ)) {
            items.push({
                key: "view",
                label: <span className="font-medium text-slate-700">View Details</span>,
                icon: <EyeOutlined className="text-teal-600" />,
                onClick: () => setModal({ name: "View", data: record, state: true }),
            });
        }

        if (hasPermission(PERMISSIONS.STORE.PRODUCTS.UPDATE)) {
            items.push({
                key: "edit",
                label: <span className="font-medium text-slate-700">Edit Product</span>,
                icon: <EditOutlined className="text-[#006666]" />,
                onClick: () => setModal({ name: "Update", data: record, state: true }),
            });
        }

        if (hasPermission(PERMISSIONS.STORE.PRODUCTS.DELETE)) {
            items.push({
                key: "delete",
                label: <span className="font-medium text-red-600">Delete Product</span>,
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
            title: "Product Info",
            key: "product",
            width: 250,
            render: (record) => {
                const primaryImageObj = record.images?.find(img => img.isPrimary) || record.images?.[0];
                const imageUrl = primaryImageObj?.url || "";

                return (
                    <Space size="middle">
                        <Avatar
                            shape="square"
                            size={40}
                            src={imageUrl}
                            icon={!imageUrl && "🏪"}
                            className="bg-teal-50 border border-slate-100 flex-shrink-0"
                        />
                        <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] block capitalize truncate leading-tight transition-colors duration-300">
                                {record.name}
                            </span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block mt-0.5 truncate uppercase tracking-wider transition-colors duration-300 group-hover:text-slate-300">
                                {record.categoryId?.name || "Uncategorized"}
                            </span>
                        </div>
                    </Space>
                );
            },
        },
        {
            title: "Pricing",
            key: "price",
            width: 180,
            render: (record) => {
                const hasDiscount = record.discount && record.discount.value > 0;
                return (
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] transition-colors duration-300">
                            Rs. {record.discountedPrice}
                        </span>
                        {hasDiscount && (
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through transition-colors duration-300 group-hover:text-slate-300">Rs. {record.price}</span>
                                <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1 rounded">
                                    -{record.discount.value}{record.discount.type === "percentage" ? "%" : " Rs"}
                                </span>
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            title: "Inventory",
            key: "inventory",
            width: 150,
            render: (record) => {
                if (!record.trackInventory) {
                    return <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide transition-colors duration-300 group-hover:text-slate-300">Unlimited Stock</span>;
                }
                return (
                    <div className="flex flex-col">
                        <span className={`text-[11px] font-bold transition-colors duration-300 ${record.stock <= 5 ? "text-red-500" : "text-slate-800 dark:text-slate-100"}`}>
                            {record.stock} Items Left
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 block mt-0.5 uppercase tracking-widest transition-colors duration-300 group-hover:text-slate-400">Tracking Enabled</span>
                    </div>
                );
            },
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 140,
            render: (status) => {
                const colors = {
                    ACTIVE: "success",
                    OUT_OF_STOCK: "error",
                    DRAFT: "default",
                    ARCHIVED: "warning",
                };
                return (
                    <Tag color={colors[status] || "default"} className="m-0 font-bold px-2.5 py-0.5 rounded-full text-[9px] uppercase tracking-wider border-none">
                        {status.replace(/_/g, " ")}
                    </Tag>
                );
            },
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

    const data = productsList?.data?.data || [];
    const pagination = productsList?.data?.pagination || {};

    return (
        <div className="modern-table shadow-sm border border-slate-100 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-900">
            <Table
                rowKey="_id"
                className="custom-ant-table"
                columns={columns}
                dataSource={data}
                loading={productsList?.status === "loading"}
                pagination={{
                    current: pagination.currentPage,
                    pageSize: pagination.itemsPerPage,
                    total: pagination.totalItems,
                    showSizeChanger: true,
                    className: "px-4 pb-4",
                    onChange: (page, pageSize) => onChange({ currentPage: page, itemsPerPage: pageSize }),
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

ProductTable.displayName = "ProductTable";

export default ProductTable;
