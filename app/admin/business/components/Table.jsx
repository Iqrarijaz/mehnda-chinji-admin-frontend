import {
    EditOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    CheckOutlined,
    CloseOutlined,
    SettingOutlined,
    EyeOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { timestampToDate } from "@/utils/date";
import { DELETE_BUSINESS, UPDATE_BUSINESS_STATUS } from "@/app/api/admin/business";
import ConfirmModal from "@/components/shared/ConfirmModal";
import ViewModal from "./ViewModal";
import { Menu, Dropdown, Button, Table, Tooltip } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";

function BusinessTable({ modal, setModal, businessList, onChange, visibleColumns }) {
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
        <Menu className="!rounded !p-2 !min-w-[150px] shadow-xl border border-slate-100">
            <Menu.Item
                key="view"
                icon={<EyeOutlined className="text-[#006666]" />}
                onClick={() => setViewModal({ state: true, data: record })}
                className="!rounded hover:!bg-teal-50"
            >
                <span className="font-medium">View Details</span>
            </Menu.Item>

            <Menu.Item
                key="edit"
                icon={<EditOutlined className="text-blue-500" />}
                onClick={() => setModal({ name: "Update", data: record, state: true })}
                className="!rounded hover:!bg-blue-50"
            >
                <span className="font-medium">Edit Business</span>
            </Menu.Item>

            {/* Approve: show when PENDING or REJECTED */}
            {(record.status === "PENDING" || record.status === "REJECTED") && (
                <Menu.Item
                    key="approve"
                    icon={<CheckOutlined className="text-green-500" />}
                    onClick={() => handleStatusChange(record, "APPROVED")}
                    className="!rounded hover:!bg-green-50"
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
                    className="!rounded hover:!bg-orange-50"
                >
                    <span className="font-medium text-orange-600">Reject</span>
                </Menu.Item>
            )}

            <Menu.Divider className="!my-1" />

            <Menu.Item
                key="delete"
                icon={<DeleteOutlined className="text-red-500" />}
                onClick={() => handleDelete(record)}
                className="!rounded hover:!bg-red-50"
            >
                <span className="font-medium text-red-600">Delete Business</span>
            </Menu.Item>
        </Menu>
    );




    const allColumns = [
        {
            title: "Business Name",
            key: "name",
            dataIndex: "name",
            width: 200,
            sorter: true,
            render: (name) => (
                <span className="font-bold text-slate-800 text-xs truncate leading-tight block">
                    {name}
                </span>
            ),
        },
        {
            title: "Business Type",
            key: "categoryEn",
            dataIndex: "categoryEn",
            width: 170,
            render: (category) => (
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5 leading-tight truncate">
                    {category || "No Category"}
                </span>
            ),
        },
        {
            title: "Contact & Address",
            key: "contact",
            width: 250,
            render: (record) => (
                <div className="flex flex-col min-w-0">
                    <span className="text-slate-600 font-bold text-[11px] leading-tight block">
                        {record.phone || "No Phone"}
                    </span>
                    <Tooltip title={record.address}>
                        <span className="text-[10px] text-slate-400 font-medium truncate block mt-0.5 leading-tight">
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
                const colorMap = {
                    APPROVED: "bg-green-100/50 text-green-700 border-green-200",
                    REJECTED: "bg-red-100/50 text-red-700 border-red-200",
                    PENDING: "bg-orange-100/50 text-orange-700 border-orange-200",
                };
                return (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${colorMap[status] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                        {status}
                    </span>
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
                <div className="text-slate-400 font-bold text-[10px] whitespace-nowrap">{timestampToDate(text)}</div>
            ),
        },
        {
            title: "",
            key: "actions",
            width: 50,
            align: "right",
            render: (record) => (
                <Dropdown overlay={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-lg rotate-90" />}
                        className="!rounded hover:!bg-slate-100 !flex items-center justify-center !h-8 !w-8 transition-all"
                    />
                </Dropdown>
            ),
        },
    ];

    const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

    return (
        <div className="space-y-4">
            <div className="modern-table shadow-sm border border-slate-100 rounded overflow-hidden bg-white">
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
                    loading={statusMutation.isLoading || deleteMutation.isLoading}
                />

                <ViewModal
                    open={viewModal.state}
                    data={viewModal.data}
                    onCancel={() => setViewModal({ state: false, data: null })}
                />
            </div>
        </div>
    );
}

export default BusinessTable;
