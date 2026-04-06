import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    EllipsisOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { timestampToDate } from "@/utils/date";
import { DELETE_PLACE, UPDATE_PLACE_STATUS, UPDATE_PLACE_REQUEST_STATUS } from "@/app/api/admin/places";
import ViewModal from "./ViewModal";
import { getTagColor } from "@/utils/tagColor";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { Modal, Pagination, Table, Tag, Tooltip, Switch, Menu, Dropdown, Button, Checkbox, Popover } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";
import { ADMIN_KEYS } from "@/constants/queryKeys";

function PlacesTable({ modal, setModal, placesList, onChange, setFilters, visibleColumns }) {
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

    // Request status mutation (APPROVED / REJECTED)
    const requestStatusMutation = useMutation({
        mutationFn: UPDATE_PLACE_REQUEST_STATUS,
        onSuccess: (data) => {
            queryClient.invalidateQueries([ADMIN_KEYS.PLACES.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.PLACES.COUNTS]);
            toast.success(data?.message || "Request status updated");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to update request status");
            closeConfirmModal();
        },
    });

    // Status mutation
    const manageStatusMutation = useMutation({
        mutationFn: UPDATE_PLACE_STATUS,
        onSuccess: (data) => {
            queryClient.invalidateQueries([ADMIN_KEYS.PLACES.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.PLACES.COUNTS]);
            toast.success(data?.message || "Status updated");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to update status");
            closeConfirmModal();
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: DELETE_PLACE,
        onSuccess: (data) => {
            queryClient.invalidateQueries([ADMIN_KEYS.PLACES.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.PLACES.COUNTS]);
            toast.success(data?.message || "Place deleted");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to delete place");
            closeConfirmModal();
        },
    });

    const handleStatus = (data) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Status Change',
            description: `Are you sure you want to ${data?.isActive ? 'deactivate' : 'activate'} this place?`,
            confirmText: 'Yes, Change',
            cancelText: 'No, Keep',
            variant: 'primary',
            onConfirm: () => manageStatusMutation.mutate({
                _id: data._id,
                isActive: !data.isActive
            })
        });
    };

    const handleDelete = (data) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: 'Are you sure you want to delete this place? This action cannot be undone.',
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate({
                _id: data._id,
            })
        });
    };

    const handleApprove = (data) => {
        setConfirmModal({
            isOpen: true,
            title: 'Approve Place',
            description: `Are you sure you want to approve "${data.name}"?`,
            confirmText: 'Yes, Approve',
            cancelText: 'Cancel',
            variant: 'primary',
            onConfirm: () => requestStatusMutation.mutate({ _id: data._id, status: 'APPROVED' })
        });
    };

    const handleReject = (data) => {
        setConfirmModal({
            isOpen: true,
            title: 'Reject Place',
            description: `Are you sure you want to reject "${data.name}"?`,
            confirmText: 'Yes, Reject',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => requestStatusMutation.mutate({ _id: data._id, status: 'REJECTED' })
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
                key: "edit",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Edit Place</span>,
                icon: <EditOutlined className="text-[#006666]" />,
                onClick: () => setModal({
                    name: "Update",
                    data: record,
                    state: true
                }),
                className: "!rounded hover:!bg-blue-50 dark:hover:!bg-blue-900/20 transition-colors",
            },
            {
                type: "divider",
                className: "!my-1",
            },
            {
                key: "approve",
                label: <span className="font-medium text-green-600 dark:text-green-500">Approve</span>,
                icon: <CheckCircleOutlined className="text-green-600 dark:text-green-500" />,
                onClick: () => handleApprove(record),
                className: "!rounded hover:!bg-green-50 dark:hover:!bg-green-900/20 transition-colors",
            },
            {
                key: "reject",
                label: <span className="font-medium text-orange-600 dark:text-orange-500">Reject</span>,
                icon: <CloseCircleOutlined className="text-orange-600 dark:text-orange-500" />,
                onClick: () => handleReject(record),
                className: "!rounded hover:!bg-orange-50 dark:hover:!bg-orange-900/20 transition-colors",
            },
            {
                type: "divider",
                className: "!my-1",
            },
            {
                key: "delete",
                label: <span className="font-medium text-red-600 dark:text-red-500">Delete Place</span>,
                icon: <DeleteOutlined className="text-red-500" />,
                onClick: () => handleDelete(record),
                className: "!rounded hover:!bg-red-50 dark:hover:!bg-red-900/20 transition-colors",
            },
        ],
        className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors",
    });



    const allColumns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            sorter: true,
            width: 200,
            render: (name) => (
                <Tooltip title={name} placement="topLeft">
                    <div className="capitalize font-bold text-slate-500 dark:text-slate-400 truncate cursor-help transition-colors">
                        {name}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Category",
            dataIndex: "category",
            key: "category",
            width: 170,
            align: "center",
            sorter: true,
            render: (category) => (
                <span
                    className="px-3 py-1 rounded-full capitalize font-bold text-white shadow-sm text-[10px]"
                    style={{ backgroundColor: getTagColor(category) }}
                >
                    {category || "N/A"}
                </span>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 150,
            align: "center",
            render: (type) => (
                <span className="px-3 py-1 rounded-full capitalize font-bold text-orange-700 bg-orange-50 border border-orange-100 shadow-sm text-[10px]">
                    {type || "—"}
                </span>
            ),
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
            title: "Timing",
            dataIndex: "timing",
            key: "timing",
            width: 180,
            render: (timing) => (
                <Tooltip title={timing || "No Timing Set"} placement="top">
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium truncate cursor-help transition-colors">
                        <span className="shrink-0 w-4 h-4 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400">
                            <span className="text-[10px]">⏰</span>
                        </span>
                        <span className="text-[11px]">{timing || "—"}</span>
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Contact",
            dataIndex: "contact",
            key: "contact",
            width: 100,
            align: "center",
            render: (contact) => {
                if (!contact || contact.length === 0) return <span className="text-slate-400">—</span>;

                return (
                    <Popover
                        content={
                            <div className="space-y-2 p-1">
                                {contact.map((c, i) => (
                                    <div key={i} className="flex flex-col border-b border-slate-50 last:border-0 pb-1 last:pb-0">
                                        <span className="text-[10px] font-bold text-slate-400 capitalize leading-none">{c.name}</span>
                                        <span className="text-sm font-medium text-slate-700">{c.number}</span>
                                    </div>
                                ))}
                            </div>
                        }
                        title={<span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Details</span>}
                        trigger="click"
                        placement="topRight"
                    >
                        <Button
                            type="text"
                            icon={<EyeOutlined className="text-teal-600" />}
                            className="hover:!bg-teal-50 !rounded-full !flex items-center justify-center mx-auto"
                        />
                    </Popover>
                );
            }
        },
        {
            title: "Reg. Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 170,
            sorter: true,
            render: (status) => {
                const colors = {
                    APPROVED: "bg-emerald-500",
                    REJECTED: "bg-red-500",
                    PENDING: "bg-orange-500",
                };
                return (
                    <span className={`${colors[status] || "bg-slate-400"} px-3 py-1 rounded-full capitalize font-bold text-white shadow-sm text-[10px]`}>
                        {status || "PENDING"}
                    </span>
                );
            },
        },
        {
            title: "Active",
            dataIndex: "isActive",
            key: "isActive",
            align: "center",
            width: 170,
            render: (isActive, record) => (
                <Switch
                    checked={isActive}
                    onChange={() => handleStatus(record)}
                    className={isActive ? '!bg-[#006666]' : '!bg-slate-300'}
                    size="small"
                />
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 170,
            sorter: true,
            render: (text) => <div className="text-slate-500 font-medium text-xs whitespace-nowrap">{timestampToDate(text)}</div>,
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
        <div className="space-y-3">
            <div className="place-holder-table modern-table shadow-sm border border-slate-100 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
                <Table
                    rowKey="_id"
                    className="custom-ant-table"
                    scroll={{ x: 1500, y: 600 }}
                    sticky={true}
                    loading={{
                        spinning: placesList?.status === "loading",
                        indicator: <TableSkeleton rows={8} columns={8} />,
                    }}
                    columns={activeColumns}
                    dataSource={placesList?.data?.data}
                    pagination={{
                        current: placesList?.data?.pagination?.currentPage,
                        pageSize: placesList?.data?.pagination?.itemsPerPage,
                        total: placesList?.data?.pagination?.totalItems,
                        showSizeChanger: true,
                        className: "px-4 pb-4",
                        onChange: (page, pageSize) => onChange({ currentPage: Number(page), itemsPerPage: pageSize }),
                    }}
                    onChange={handleSorting}
                />
                {(manageStatusMutation.isLoading || deleteMutation.isLoading || requestStatusMutation.isLoading) && <Loading />}

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
                    loading={manageStatusMutation.isLoading || deleteMutation.isLoading || requestStatusMutation.isLoading}
                />
            </div>
        </div>
    );
}

export default PlacesTable;
