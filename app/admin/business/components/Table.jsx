import {
    EditOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    CheckOutlined,
    CloseOutlined,
    EyeOutlined
} from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { timestampToDate } from "@/utils/date";
import ConfirmModal from "@/components/shared/ConfirmModal";
import ViewModal from "./ViewModal";
import { Menu, Dropdown, Button, Table, Tooltip } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useUpdateBusinessStatus, useDeleteBusiness } from "../hooks/useBusiness";
import React, { useState } from "react";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";
import CustomTag from "@/components/shared/CustomTag";

const BusinessTable = React.memo(({ modal, setModal, businessList, onChange, visibleColumns = [] }) => {
    const queryClient = useQueryClient();

    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        description: "",
        onConfirm: null,
        variant: "primary",
        confirmText: "Confirm",
        cancelText: "Cancel",
    });

    const [viewModal, setViewModal] = useState({ state: false, data: null });

    const closeConfirmModal = React.useCallback(() =>
        setConfirmModal((prev) => ({ ...prev, isOpen: false })), []);

    const handleSorting = React.useCallback((pagination, filters, sorter) => {
        onChange({
            sortingKey: sorter.field || "_id",
            sortOrder: sorter.order === "ascend" ? 1 : -1,
            currentPage: pagination.current,
        });
    }, [onChange]);

    const statusMutation = useUpdateBusinessStatus(closeConfirmModal);
    const deleteMutation = useDeleteBusiness(closeConfirmModal);

    const handleStatusChange = React.useCallback((record, newStatus) => {
        setConfirmModal({
            isOpen: true,
            title: `Set Status to ${newStatus}`,
            description: `Are you sure you want to ${newStatus.toLowerCase()} "${record.name}"?`,
            confirmText: "Yes, Confirm",
            cancelText: "Cancel",
            variant: newStatus === "REJECTED" ? "danger" : "primary",
            onConfirm: () =>
                statusMutation.mutate({ _id: record._id, status: newStatus }),
        });
    }, [statusMutation]);

    const handleDelete = React.useCallback((record) => {
        setConfirmModal({
            isOpen: true,
            title: "Confirm Deletion",
            description: `Are you sure you want to delete "${record.name}"? This action cannot be undone.`,
            confirmText: "Yes, Delete",
            cancelText: "Cancel",
            variant: "danger",
            onConfirm: () => deleteMutation.mutate({ _id: record._id }),
        });
    }, [deleteMutation]);

    const actionMenu = React.useMemo(() => (record) => {
        const items = [];

        // 1. View Details (Allowed if user has business read OR dashboard read)
        if (hasPermission([PERMISSIONS.BUSINESSES.READ, PERMISSIONS.DASHBOARD.READ])) {
            items.push({
                key: "view",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">View Details</span>,
                icon: <EyeOutlined className="text-[#006666] dark:text-teal-500" />,
                onClick: () => setViewModal({ state: true, data: record }),
                className: "!rounded hover:!bg-teal-50 dark:hover:!bg-emerald-900/20 transition-colors",
            });
        }

        // 2. Edit Business (Requires update permission)
        if (hasPermission(PERMISSIONS.BUSINESSES.UPDATE)) {
            items.push({
                key: "edit",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Edit Business</span>,
                icon: <EditOutlined className="text-[#006666] dark:text-teal-500" />,
                onClick: () => setModal({ name: "Update", data: record, state: true }),
                className: "!rounded hover:!bg-blue-50 dark:hover:!bg-blue-900/20 transition-colors",
            });
        }

        // 3. Status Changes (Requires update permission)
        if (hasPermission(PERMISSIONS.BUSINESSES.UPDATE)) {
            if (record.status === "PENDING" || record.status === "REJECTED") {
                items.push({
                    key: "approve",
                    label: <span className="font-medium text-slate-700 dark:text-slate-300">Approve</span>,
                    icon: <CheckOutlined className="text-green-500" />,
                    onClick: () => handleStatusChange(record, "APPROVED"),
                    className: "!rounded hover:!bg-green-50 dark:hover:!bg-green-900/20 transition-colors",
                });
            }

            if (record.status === "PENDING" || record.status === "APPROVED") {
                items.push({
                    key: "reject",
                    label: <span className="font-medium text-orange-600 dark:text-orange-500">Reject</span>,
                    icon: <CloseOutlined className="text-orange-500 dark:text-orange-400" />,
                    onClick: () => handleStatusChange(record, "REJECTED"),
                    className: "!rounded hover:!bg-orange-50 dark:hover:!bg-orange-900/20 transition-colors",
                });
            }
        }

        // 4. Delete Business (Requires delete permission)
        if (hasPermission(PERMISSIONS.BUSINESSES.DELETE)) {
            if (items.length > 0) {
                items.push({ type: "divider", className: "!my-1" });
            }
            items.push({
                key: "delete",
                label: <span className="font-medium text-red-600 dark:text-red-500">Delete Business</span>,
                icon: <DeleteOutlined className="text-red-500 dark:text-red-400" />,
                onClick: () => handleDelete(record),
                className: "!rounded hover:!bg-red-50 dark:hover:!bg-red-900/20 transition-colors",
            });
        }

        return {
            items,
            className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors",
        };
    }, [setModal, handleStatusChange, handleDelete]);

    const allColumns = React.useMemo(() => [
        {
            title: "Business Name",
            key: "name",
            dataIndex: "name",
            width: 200,
            sorter: true,
            render: (name, record) => (
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] truncate leading-tight block capitalize transition-colors duration-300">
                        {name}
                    </span>
                    {record.hasStore && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-teal-50 dark:bg-emerald-950/30 text-[#006666] dark:text-emerald-400 border border-teal-200/50 dark:border-emerald-900/30 select-none">
                            Store
                        </span>
                    )}
                </div>
            ),
        },
        {
            title: "Category EN",
            key: "categoryEn",
            dataIndex: "categoryEn",
            width: 150,
            render: (val) => (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium capitalize leading-tight truncate block transition-colors duration-300 group-hover:text-slate-300">
                    {val || "—"}
                </span>
            ),
        },
        {
            title: "Category UR",
            key: "categoryUr",
            dataIndex: "categoryUr",
            width: 150,
            render: (val) => (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium leading-tight truncate block font-notoUrdu transition-colors duration-300 group-hover:text-slate-300" dir="rtl">
                    {val || "—"}
                </span>
            ),
        },
        {
            title: "Timing",
            key: "timing",
            dataIndex: "timing",
            width: 170,
            render: (timing) => (
                <Tooltip title={timing || "No Timing Set"} placement="top">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate cursor-help transition-colors duration-300 group-hover:text-slate-300">
                        <span className="shrink-0 w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400">
                            <span className="text-[10px]">⏰</span>
                        </span>
                        <span>{timing || "—"}</span>
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Contact & Address",
            key: "contact",
            width: 250,
            render: (record) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-[11px] text-slate-800 dark:text-slate-100 font-bold leading-tight block transition-colors duration-300">
                        {record.phone || "No Phone"}
                    </span>
                    <Tooltip title={record.address}>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate block mt-0.5 leading-tight transition-colors duration-300 group-hover:text-slate-300">
                            {record.address || "No Address"}
                        </span>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 170,
            sorter: true,
            render: (status) => {
                const colors = {
                    APPROVED: "green",
                    REJECTED: "red",
                    PENDING: "orange",
                };
                return (
                    <CustomTag text={status} color={colors[status] || "slate"} />
                );
            },
        },
        {
            title: "Registered",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 170,
            sorter: true,
            render: (text) => (
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap transition-colors duration-300 group-hover:text-slate-300">{timestampToDate(text)}</div>
            ),
        },
        {
            title: "",
            key: "actions",
            width: 70,
            align: "right",
            fixed: "right",
            render: (record) => (
                <Dropdown menu={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-base text-slate-400" />}
                        className="!rounded hover:!bg-slate-300 !flex items-center justify-center !h-4 !w-8"
                    />
                </Dropdown>
            ),
        },
    ], [actionMenu]);

    const activeColumns = React.useMemo(() =>
        allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key)),
        [allColumns, visibleColumns]);

    return (
        <div className="space-y-4">
            <div className="modern-table shadow-sm border border-slate-100 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
                <Table
                    rowKey="_id"
                    className="custom-ant-table"
                    scroll={{ x: 1200, y: 600 }}
                    sticky={true}
                    loading={{
                        spinning: businessList?.status === "loading",
                        indicator: <TableSkeleton rows={8} columns={5} />,
                    }}
                    columns={activeColumns}
                    dataSource={businessList?.data?.data}
                    pagination={{
                        current: businessList?.data?.pagination?.currentPage,
                        pageSize: businessList?.data?.pagination?.itemsPerPage,
                        total: businessList?.data?.pagination?.totalItems,
                        showSizeChanger: true,
                        className: "px-4 pb-4",
                        onChange: (page, pageSize) => onChange({ currentPage: Number(page), itemsPerPage: pageSize }),
                    }}
                    onChange={handleSorting}
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
                    loading={statusMutation.isPending || deleteMutation.isPending}
                />

                <ViewModal
                    open={viewModal.state}
                    data={viewModal.data}
                    onCancel={() => setViewModal({ state: false, data: null })}
                />
            </div>
        </div>
    );
});

BusinessTable.displayName = "BusinessTable";

export default BusinessTable;
