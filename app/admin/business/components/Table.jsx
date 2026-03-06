import {
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    CheckOutlined,
    CloseOutlined,
    SettingOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { timestampToDate } from "@/utils/date";
import { DELETE_BUSINESS, UPDATE_BUSINESS_STATUS } from "@/app/api/admin/business";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { Menu, Dropdown, Button, Checkbox, Tooltip } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";

function BusinessTable({ modal, setModal, businessList, onChange }) {
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

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["name", "categoryEn", "status", "createdAt", "actions"]);

    const closeConfirmModal = () =>
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));

    const handleSorting = (pagination, filters, sorter) => {
        onChange({
            sortingKey: sorter.field || "_id",
            sortOrder: sorter.order === "ascend" ? 1 : -1,
            currentPage: pagination.current,
        });
    };

    const statusMutation = useMutation({
        mutationFn: UPDATE_BUSINESS_STATUS,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "businessList",
            });
            queryClient.invalidateQueries("businessStatusCounts");
            toast.success(data?.message || "Status updated");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
            closeConfirmModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: DELETE_BUSINESS,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "businessList",
            });
            queryClient.invalidateQueries("businessStatusCounts");
            toast.success(data?.message || "Business deleted");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete");
            closeConfirmModal();
        },
    });

    const handleStatusChange = (record, newStatus) => {
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
    };

    const handleDelete = (record) => {
        setConfirmModal({
            isOpen: true,
            title: "Confirm Deletion",
            description: `Are you sure you want to delete "${record.name}"? This action cannot be undone.`,
            confirmText: "Yes, Delete",
            cancelText: "Cancel",
            variant: "danger",
            onConfirm: () => deleteMutation.mutate({ _id: record._id }),
        });
    };

    const actionMenu = (record) => (
        <Menu className="!rounded-xl !p-2 !min-w-[150px] shadow-xl border border-slate-100">
            <Menu.Item
                key="edit"
                icon={<EditOutlined className="text-blue-500" />}
                onClick={() => setModal({ name: "Update", data: record, state: true })}
                className="!rounded-lg hover:!bg-blue-50"
            >
                <span className="font-medium">Edit Business</span>
            </Menu.Item>

            {/* Approve: show when PENDING or REJECTED */}
            {(record.status === "PENDING" || record.status === "REJECTED") && (
                <Menu.Item
                    key="approve"
                    icon={<CheckOutlined className="text-green-500" />}
                    onClick={() => handleStatusChange(record, "APPROVED")}
                    className="!rounded-lg hover:!bg-green-50"
                >
                    <span className="font-medium">Approve</span>
                </Menu.Item>
            )}

            {/* Reject: show when PENDING or APPROVED */}
            {(record.status === "PENDING" || record.status === "APPROVED") && (
                <Menu.Item
                    key="reject"
                    icon={<CloseOutlined className="text-orange-500" />}
                    onClick={() => handleStatusChange(record, "REJECTED")}
                    className="!rounded-lg hover:!bg-orange-50"
                >
                    <span className="font-medium text-orange-600">Reject</span>
                </Menu.Item>
            )}

            <Menu.Divider className="!my-1" />

            <Menu.Item
                key="delete"
                icon={<DeleteOutlined className="text-red-500" />}
                onClick={() => handleDelete(record)}
                className="!rounded-lg hover:!bg-red-50"
            >
                <span className="font-medium text-red-600">Delete Business</span>
            </Menu.Item>
        </Menu>
    );

    const columnOptions = [
        { label: "Business Name", value: "name" },
        { label: "Category", value: "categoryEn" },
        { label: "Phone", value: "phone" },
        { label: "Address", value: "address" },
        { label: "Status", value: "status" },
        { label: "Registered Date", value: "createdAt" },
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
            title: "Business Name",
            dataIndex: "name",
            key: "name",
            width: 200,
            sorter: true,
            render: (text) => (
                <div className="font-bold text-slate-800 capitalize truncate">{text}</div>
            ),
        },
        {
            title: "Category",
            dataIndex: "categoryEn",
            key: "categoryEn",
            width: 140,
            sorter: true,
            render: (val) => (
                <div className="capitalize truncate text-slate-500 font-medium">{val || "—"}</div>
            ),
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            width: 130,
            sorter: true,
            render: (val) => <span className="text-slate-600 font-medium">{val || "—"}</span>,
        },
        {
            title: "Address",
            dataIndex: "address",
            key: "address",
            width: 200,
            render: (val) => (
                <Tooltip title={val}>
                    <div className="capitalize truncate text-slate-500 font-medium">{val || "—"}</div>
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
                    APPROVED: "bg-green-100 text-green-700 border-green-200",
                    REJECTED: "bg-red-100 text-red-700 border-red-200",
                    PENDING: "bg-orange-100 text-orange-700 border-orange-200",
                };
                return (
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${colorMap[status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                        {status}
                    </span>
                );
            },
        },
        {
            title: "Registered",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 130,
            sorter: true,
            render: (text) => (
                <div className="text-slate-500 font-medium whitespace-nowrap">{timestampToDate(text)}</div>
            ),
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
        },
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
                    scroll={{ x: 1100, y: 600 }}
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
                    loading={statusMutation.isLoading || deleteMutation.isLoading}
                />
            </div>
        </div>
    );
}

export default BusinessTable;
