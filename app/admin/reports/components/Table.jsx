import {
    EyeOutlined,
    EllipsisOutlined,
    SettingOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    SolutionOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { timestampToDate } from "@/utils/date";
import { UPDATE_REPORT_STATUS } from "@/app/api/admin/reports";
import ViewModal from "./ViewModal";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { Pagination, Table, Tag, Tooltip, Menu, Dropdown, Button } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useState } from "react";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";

function ReportsTable({ reportsList, onChange, setFilters, visibleColumns }) {
    const queryClient = useQueryClient();
    const [viewModal, setViewModal] = useState({ open: false, data: null });
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

    // Status mutation (REVIEWED / RESOLVED)
    const statusMutation = useMutation({
        mutationFn: UPDATE_REPORT_STATUS,
        onSuccess: (data) => {
            queryClient.invalidateQueries([ADMIN_KEYS.REPORTS.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.REPORTS.COUNTS]);
            toast.success(data?.message || "Status updated successfully");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to update status");
            closeConfirmModal();
        },
    });

    const handleUpdateStatus = (data, newStatus) => {
        setConfirmModal({
            isOpen: true,
            title: `Update Report Status`,
            description: `Are you sure you want to mark this report as ${newStatus}?`,
            confirmText: 'Yes, Update',
            cancelText: 'Cancel',
            variant: 'primary',
            onConfirm: () => statusMutation.mutate({ _id: data._id, status: newStatus })
        });
    };

    const handleSorting = (pagination, filters, sorter) => {
        setFilters(prev => ({
            ...prev,
            sortingKey: sorter.field || "_id",
            sortOrder: sorter.order === "ascend" ? 1 : -1,
            currentPage: pagination.current,
        }));
    };

    const actionMenu = (record) => ({
        items: [
            {
                key: "view",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">View Details</span>,
                icon: <EyeOutlined className="text-emerald-500" />,
                onClick: () => setViewModal({ open: true, data: record }),
                className: "!rounded hover:!bg-emerald-50 dark:hover:!bg-emerald-900/20 transition-colors",
            },
            {
                type: "divider",
                className: "!my-1 dark:border-slate-800",
            },
            {
                key: "reviewed",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Mark Reviewed</span>,
                icon: <SolutionOutlined className="text-[#006666] dark:text-teal-400" />,
                onClick: () => handleUpdateStatus(record, 'REVIEWED'),
                className: "!rounded hover:!bg-blue-50 dark:hover:!bg-blue-900/20 transition-colors duration-200",
            },
            {
                key: "resolved",
                label: <span className="font-medium text-green-600 dark:text-green-500">Mark Resolved</span>,
                icon: <CheckCircleOutlined className="text-green-600" />,
                onClick: () => handleUpdateStatus(record, 'RESOLVED'),
                className: "!rounded hover:!bg-green-50 dark:hover:!bg-green-900/20 transition-colors duration-200",
            },
            {
                key: "pending",
                label: <span className="font-medium text-orange-600 dark:text-orange-500">Mark Pending</span>,
                icon: <ClockCircleOutlined className="text-orange-500" />,
                onClick: () => handleUpdateStatus(record, 'PENDING'),
                className: "!rounded hover:!bg-orange-50 dark:hover:!bg-orange-900/20 transition-colors duration-200",
            },
        ],
        className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors",
    });




    const allColumns = [
        {
            title: "Reporter",
            dataIndex: "reporter",
            key: "reporter",
            width: 180,
            sorter: true,
            render: (reporter) => (
                <div className="flex flex-col min-w-0 transition-colors duration-300">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-[11px] truncate leading-tight block tracking-tight transition-colors duration-300">
                        {reporter ? `${reporter.firstName} ${reporter.lastName}` : "Anonymous"}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-wide truncate block mt-0.5 transition-colors duration-300">
                        {reporter?.phone || "No phone"}
                    </span>
                </div>
            ),
        },
        {
            title: "Type",
            dataIndex: "targetType",
            key: "targetType",
            width: 170,
            align: "center",
            sorter: true,
            render: (type) => (
                <Tag color={type === 'BUSINESS' ? 'blue' : type === 'PLACE' ? 'green' : 'orange'} className="!rounded-full !px-3 font-bold !border-0 uppercase text-[9px] shadow-sm">
                    {type}
                </Tag>
            ),
        },
        {
            title: "Issue",
            key: "reason",
            width: 250,
            render: (record) => (
                <div className="flex flex-col min-w-0 transition-colors duration-300">
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-[11px] truncate leading-tight block tracking-tight transition-colors duration-300">{record.reason}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate block leading-tight mt-0.5 transition-colors duration-300">{record.description || "No further details"}</span>
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
                const colorMap = {
                    RESOLVED: "success",
                    REVIEWED: "processing",
                    PENDING: "warning",
                };
                return (
                    <Tag color={colorMap[status] || "default"} className="!rounded-full !px-3 font-bold !border-0 uppercase text-[9px] shadow-sm">
                        {status || "PENDING"}
                    </Tag>
                );
            },
        },
        {
            title: "Received",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 170,
            sorter: true,
            render: (text) => <div className="text-slate-500 dark:text-slate-400 text-[10px] font-bold whitespace-nowrap transition-colors duration-300 uppercase tracking-tight">{timestampToDate(text)}</div>,
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
            ),
        }
    ];

    const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

    return (
        <div className="space-y-4">
            <div className="place-holder-table modern-table shadow-sm border border-slate-100 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
                <Table
                    rowKey="_id"
                    className="custom-ant-table"
                    scroll={{ x: 1300, y: 600 }}
                    sticky={true}
                    loading={{
                        spinning: reportsList?.status === "loading",
                        indicator: <TableSkeleton rows={8} columns={7} />,
                    }}
                    columns={activeColumns}
                    dataSource={reportsList?.data?.data}
                    pagination={{
                        current: reportsList?.data?.pagination?.currentPage,
                        pageSize: reportsList?.data?.pagination?.itemsPerPage,
                        total: reportsList?.data?.pagination?.totalItems,
                        showSizeChanger: true,
                        className: "px-4 pb-4",
                        onChange: (page, pageSize) => onChange({ currentPage: Number(page), itemsPerPage: pageSize }),
                    }}
                    onChange={handleSorting}
                />
                {statusMutation.isLoading && <Loading />}

                <ViewModal viewModal={viewModal} setViewModal={setViewModal} />

                <ConfirmModal
                    isOpen={confirmModal.isOpen}
                    onClose={closeConfirmModal}
                    onConfirm={confirmModal.onConfirm}
                    title={confirmModal.title}
                    description={confirmModal.description}
                    confirmText={confirmModal.confirmText}
                    cancelText={confirmModal.cancelText}
                    variant={confirmModal.variant}
                    loading={statusMutation.isLoading}
                />
            </div>
        </div>
    );
}

export default ReportsTable;
