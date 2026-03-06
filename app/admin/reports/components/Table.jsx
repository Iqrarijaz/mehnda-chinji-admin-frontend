import {
    EyeOutlined,
    MoreOutlined,
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
import { Pagination, Table, Tag, Tooltip, Menu, Dropdown, Button, Checkbox } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";

function ReportsTable({ reportsList, onChange, setFilters }) {
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

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["reporter", "targetType", "reason", "description", "status", "createdAt", "actions"]);

    const closeConfirmModal = () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    };

    // Status mutation (REVIEWED / RESOLVED)
    const statusMutation = useMutation({
        mutationFn: UPDATE_REPORT_STATUS,
        onSuccess: (data) => {
            queryClient.invalidateQueries(["reportsList"]);
            queryClient.invalidateQueries("reportStatusCounts");
            toast.success(data?.message || "Status updated successfully");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
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

    const actionMenu = (record) => (
        <Menu className="!rounded-xl !p-2 !min-w-[160px] shadow-xl border border-slate-100">
            <Menu.Item
                key="view"
                icon={<EyeOutlined className="text-emerald-500" />}
                onClick={() => setViewModal({ open: true, data: record })}
                className="!rounded-lg hover:!bg-emerald-50"
            >
                <span className="font-medium">View Details</span>
            </Menu.Item>
            <Menu.Divider className="!my-1" />
            <Menu.Item
                key="reviewed"
                icon={<SolutionOutlined className="text-blue-500" />}
                onClick={() => handleUpdateStatus(record, 'REVIEWED')}
                className="!rounded-lg hover:!bg-blue-50"
            >
                <span className="font-medium">Mark Reviewed</span>
            </Menu.Item>
            <Menu.Item
                key="resolved"
                icon={<CheckCircleOutlined className="text-green-600" />}
                onClick={() => handleUpdateStatus(record, 'RESOLVED')}
                className="!rounded-lg hover:!bg-green-50"
            >
                <span className="font-medium">Mark Resolved</span>
            </Menu.Item>
            <Menu.Item
                key="pending"
                icon={<ClockCircleOutlined className="text-orange-500" />}
                onClick={() => handleUpdateStatus(record, 'PENDING')}
                className="!rounded-lg hover:!bg-orange-50"
            >
                <span className="font-medium">Mark Pending</span>
            </Menu.Item>
        </Menu>
    );

    const columnOptions = [
        { label: "Reporter", value: "reporter" },
        { label: "Target Type", value: "targetType" },
        { label: "Reason", value: "reason" },
        { label: "Description", value: "description" },
        { label: "Status", value: "status" },
        { label: "Created At", value: "createdAt" },
    ];

    const visibilityMenu = (
        <Menu className="!rounded-xl !p-3 shadow-xl border border-slate-100 min-w-[180px]">
            <div className="px-2 pb-2 mb-2 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                Toggle Columns
            </div>
            <Checkbox.Group
                value={visibleColumns}
                onChange={setVisibleColumns}
                className="flex flex-col gap-2"
            >
                {columnOptions.map(opt => (
                    <Menu.Item key={opt.value} className="!bg-transparent !cursor-default hover:!bg-slate-50 !rounded-lg !py-1">
                        <Checkbox value={opt.value} className="font-medium text-slate-700 w-full">
                            {opt.label}
                        </Checkbox>
                    </Menu.Item>
                ))}
            </Checkbox.Group>
        </Menu>
    );

    const allColumns = [
        {
            title: "Reporter",
            dataIndex: "reporter",
            key: "reporter",
            width: 200,
            sorter: true,
            render: (reporter) => (
                <div className="capitalize font-bold text-slate-800">
                    {reporter ? `${reporter.firstName} ${reporter.lastName}` : "Anonymous"}
                    <div className="text-[10px] text-slate-400 font-medium tracking-wide">
                        {reporter?.phone || "—"}
                    </div>
                </div>
            ),
        },
        {
            title: "Target Type",
            dataIndex: "targetType",
            key: "targetType",
            width: 120,
            align: "center",
            sorter: true,
            render: (type) => (
                <Tag color={type === 'BUSINESS' ? 'blue' : type === 'PLACE' ? 'green' : 'orange'} className="!rounded-full !px-3 font-bold !border-0 uppercase text-[10px]">
                    {type}
                </Tag>
            ),
        },
        {
            title: "Reason",
            dataIndex: "reason",
            key: "reason",
            width: 200,
            render: (reason) => (
                <Tooltip title={reason} placement="topLeft">
                    <div className="text-slate-600 font-medium truncate cursor-help">
                        {reason}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 300,
            render: (desc) => (
                <Tooltip title={desc} placement="topLeft">
                    <div className="text-slate-500 font-medium truncate cursor-help">
                        {desc || "—"}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 120,
            sorter: true,
            render: (status) => {
                const colorMap = {
                    RESOLVED: "success",
                    REVIEWED: "processing",
                    PENDING: "warning",
                };
                return (
                    <Tag color={colorMap[status] || "default"} className="!rounded-full !px-3 font-bold !border-0 uppercase text-[10px]">
                        {status || "PENDING"}
                    </Tag>
                );
            },
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 150,
            sorter: true,
            render: (text) => <div className="text-slate-500 font-medium whitespace-nowrap">{timestampToDate(text)}</div>,
        },
        {
            title: "",
            key: "actions",
            width: 60,
            align: "right",
            render: (record) => (
                <Dropdown overlay={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<MoreOutlined className="text-lg" />}
                        className="!rounded-xl hover:!bg-slate-100 !flex items-center justify-center !h-10 !w-10"
                    />
                </Dropdown>
            ),
        }
    ];

    const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

    return (
        <div className="space-y-4">
            <div className="flex justify-end px-1">
                <Dropdown overlay={visibilityMenu} trigger={['click']}>
                    <Button
                        icon={<SettingOutlined />}
                        className="!rounded-xl !h-[42px] !px-4 !border-slate-200 !text-slate-600 font-semibold hover:!border-[#006666] hover:!text-[#006666] flex items-center gap-2"
                    >
                        Columns
                    </Button>
                </Dropdown>
            </div>

            <div className="place-holder-table modern-table shadow-sm border border-slate-100 rounded-xl overflow-hidden bg-white">
                <Table
                    rowKey="_id"
                    className="custom-ant-table"
                    scroll={{ x: 1200, y: 600 }}
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
