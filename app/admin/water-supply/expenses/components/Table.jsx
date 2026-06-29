import React, { useState } from "react";
import { Table, Tooltip, Dropdown, Button } from "antd";
import { EditOutlined, EllipsisOutlined, DeleteOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import moment from "moment";
import EmptyState from "@/components/shared/EmptyState";
import { TableSkeleton } from "@/components/shared/Skeletons";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { timestampToDate } from "@/utils/date";
import { DELETE_EXPENSE } from "@/app/api/admin/water-supply";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { hasPermission } from "@/utils/permissions";
import { PERMISSIONS } from "@/config/permissions";

const ExpensesTable = React.memo(({ expensesList, onChange, visibleColumns = [], setModal }) => {
    const { data, isFetching } = expensesList;
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

    const closeConfirmModal = React.useCallback(() => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    }, []);

    const deleteMutation = useMutation({
        mutationFn: DELETE_EXPENSE,
        onSuccess: () => {
            queryClient.invalidateQueries([ADMIN_KEYS.WATER_SUPPLY.EXPENSES_LIST]);
            toast.success("Expense deleted successfully");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to delete expense");
            closeConfirmModal();
        },
    });

    const handleDelete = React.useCallback((record) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: `Are you sure you want to delete this expense "${record.title}"? This action cannot be undone.`,
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate({ expenseId: record._id })
        });
    }, [deleteMutation]);

    const actionMenu = React.useMemo(() => (record) => {
        const items = [];
        
        if (hasPermission(PERMISSIONS.WATER_SUPPLY.UPDATE)) {
            items.push({
                key: "edit",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Edit Expense</span>,
                icon: <EditOutlined className="text-[#006666]" />,
                onClick: () => setModal({ name: "Update", data: record, state: true }),
                className: "!rounded hover:!bg-blue-50 dark:hover:!bg-blue-900/20 transition-colors",
            });
            items.push({ type: "divider", className: "!my-1 dark:border-slate-800" });
        }
        
        if (hasPermission(PERMISSIONS.WATER_SUPPLY.DELETE)) {
            items.push({
                key: "delete",
                label: <span className="font-medium text-red-600 dark:text-red-500">Delete Expense</span>,
                icon: <DeleteOutlined className="text-red-500 dark:text-red-400" />,
                onClick: () => handleDelete(record),
                className: "!rounded hover:!bg-red-50 dark:hover:!bg-red-900/20 transition-colors",
            });
        }
        
        // Remove trailing divider if any
        if (items.length > 0 && items[items.length - 1].type === "divider") {
            items.pop();
        }

        return {
            items,
            className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors",
        };
    }, [setModal, handleDelete]);

    const allColumns = React.useMemo(() => [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            width: 250,
            render: (text) => (
                <Tooltip title={text} placement="topLeft">
                    <div className="capitalize font-bold text-slate-700 dark:text-slate-300 truncate cursor-help transition-colors">
                        {text}
                    </div>
                </Tooltip>
            )
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            width: 150,
            align: "center",
            render: (val) => <span className="font-black text-red-500">{val}</span>
        },
        {
            title: "Date Incurred",
            dataIndex: "expenseDate",
            key: "expenseDate",
            width: 170,
            render: (date) => (
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium truncate transition-colors">
                    <span className="text-[11px]">{moment(date).format("MMM DD, YYYY")}</span>
                </div>
            )
        },
        {
            title: "Logged At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 170,
            render: (date) => <div className="text-slate-500 font-medium text-xs whitespace-nowrap">{timestampToDate(date)}</div>
        },
        {
            title: "",
            key: "action",
            width: 70,
            align: "right",
            render: (_, record) => (
                <Dropdown menu={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-base text-slate-400" />}
                        className="!rounded hover:!bg-slate-300 !flex items-center justify-center !h-4 !w-8"
                    />
                </Dropdown>
            )
        }
    ], [actionMenu]);

    const activeColumns = React.useMemo(() => 
        allColumns.filter(col => visibleColumns.includes(col.key) || col.key === "action"),
        [allColumns, visibleColumns]);

    return (
        <div className="space-y-3">
            <div className="essential-holder-table modern-table shadow-sm border border-slate-100 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
                <Table
                    rowKey="_id"
                    className="custom-ant-table"
                    scroll={{ x: 800, y: 600 }}
                    sticky={true}
                    loading={{
                        spinning: isFetching,
                        indicator: <TableSkeleton rows={8} columns={4} />,
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
});

ExpensesTable.displayName = "ExpensesTable";

export default ExpensesTable;
