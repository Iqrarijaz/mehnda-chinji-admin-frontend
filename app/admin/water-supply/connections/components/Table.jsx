import React, { useState } from "react";
import { Table, Dropdown, Menu, Tooltip, Button } from "antd";
import { EditOutlined, HistoryOutlined, EllipsisOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import EmptyState from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/Skeletons";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { timestampToDate } from "@/utils/date";
import { DELETE_CONNECTION } from "@/app/api/admin/water-supply";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";

const ConnectionsTable = ({ modal, setModal, connectionsList, onChange, filters, visibleColumns }) => {
    const { data, isFetching } = connectionsList;
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
        mutationFn: DELETE_CONNECTION,
        onSuccess: () => {
            queryClient.invalidateQueries([ADMIN_KEYS.WATER_SUPPLY.CONNECTIONS_LIST]);
            toast.success("Connection and associated bills deleted successfully");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to delete connection");
            closeConfirmModal();
        },
    });

    const handleDelete = (record) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: `Are you sure you want to delete connection "${record.connectionId}"? This will also delete all associated bills. This action cannot be undone.`,
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate({ connectionId: record._id })
        });
    };

    const actionMenu = (record) => {
        const items = [];
        
        if (hasPermission(PERMISSIONS.WATER_SUPPLY.UPDATE)) {
            items.push({
                key: "edit",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Edit Connection</span>,
                icon: <EditOutlined className="text-[#006666]" />,
                onClick: () => setModal({ name: "Update", data: record, state: true }),
                className: "!rounded hover:!bg-blue-50 dark:hover:!bg-blue-900/20 transition-colors",
            });
            items.push({ type: "divider", className: "!my-1 dark:border-slate-800" });
        }
        
        if (hasPermission(PERMISSIONS.WATER_SUPPLY.DELETE)) {
            items.push({
                key: "delete",
                label: <span className="font-medium text-red-600 dark:text-red-500">Delete Connection</span>,
                icon: <DeleteOutlined className="text-red-500 dark:text-red-400" />,
                onClick: () => handleDelete(record),
                className: "!rounded hover:!bg-red-50 dark:hover:!bg-red-900/20 transition-colors",
            });
            items.push({ type: "divider", className: "!my-1 dark:border-slate-800" });
        }
        
        items.push({
            key: "history",
            label: <span className="font-medium text-slate-700 dark:text-slate-300">View History</span>,
            icon: <HistoryOutlined className="text-purple-500" />,
            onClick: () => setModal({ name: "History", data: record.auditLog || [], state: true }),
            className: "!rounded hover:!bg-purple-50 dark:hover:!bg-purple-900/20 transition-colors",
        });

        return {
            items,
            className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors",
        };
    };

    const allColumns = [
        {
            title: "Connection ID",
            dataIndex: "connectionId",
            key: "connectionId",
            width: 150,
            render: (text) => <span className="font-bold text-slate-700 dark:text-slate-300">{text}</span>
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 200,
            render: (name) => (
                <Tooltip title={name} placement="topLeft">
                    <div className="capitalize font-bold text-slate-500 dark:text-slate-400 truncate cursor-help transition-colors">
                        {name}
                    </div>
                </Tooltip>
            )
        },
        {
            title: "Phone",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            width: 150,
            render: (phone) => <span className="font-semibold text-slate-600 dark:text-slate-400 text-[11px] whitespace-nowrap transition-colors duration-300">{phone || "N/A"}</span>,
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            width: 250,
            render: (address) => (
                <Tooltip title={address} placement="topLeft">
                    <div className="capitalize text-slate-500 dark:text-slate-400 font-medium truncate cursor-help transition-colors">
                        {address || "—"}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 150,
            align: "center",
            render: (status) => {
                const colors = {
                    ACTIVE: "bg-emerald-500",
                    SUSPENDED: "bg-red-500",
                    CANCELLED: "bg-red-500",
                };
                return (
                    <span className={`${colors[status] || "bg-slate-400"} px-3 py-1 rounded-full capitalize font-bold text-white shadow-sm text-[10px]`}>
                        {status}
                    </span>
                );
            }
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 170,
            render: (date) => <div className="text-slate-500 font-medium text-xs whitespace-nowrap">{timestampToDate(date)}</div>,
        },
        {
            title: "",
            key: "actions",
            width: 70,
            align: "right",
            render: (record) => (
                <Dropdown menu={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-base text-slate-400" />}
                        className="!rounded hover:!bg-slate-300 !flex items-center justify-center !h-4 !w-8"
                    />
                </Dropdown>
            )
        }
    ];

    const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

    return (
        <div className="space-y-3">
            <div className="essential-holder-table modern-table shadow-sm border border-slate-100 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
                <Table
                    rowKey="_id"
                    className="custom-ant-table"
                    scroll={{ x: 1200, y: 600 }}
                    sticky={true}
                    loading={{
                        spinning: isFetching,
                        indicator: <TableSkeleton rows={8} columns={8} />,
                    }}
                    columns={activeColumns}
                    dataSource={data?.data?.docs}
                    pagination={{
                        current: data?.data?.page,
                        pageSize: data?.data?.limit,
                        total: data?.data?.totalDocs,
                        showSizeChanger: true,
                        className: "px-4 pb-4",
                        onChange: (page, pageSize) => onChange({ currentPage: Number(page), itemsPerPage: pageSize })
                    }}
                />
            </div>

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
        </div>
    );
};

export default ConnectionsTable;
