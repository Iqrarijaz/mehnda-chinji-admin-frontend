import React, { useState } from "react";
import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    EllipsisOutlined,
} from "@ant-design/icons";
import { Table, Menu, Dropdown, Button, Tooltip } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/shared/ConfirmModal";
import Loading from "@/animations/homePageLoader";
import { DELETE_APP_IMAGES } from "@/app/api/admin/app-images";
import { timestampToDate } from "@/utils/date";

function AppImagesTable({ modal, setModal, appImagesList, filters, onChange, setFilters, visibleColumns }) {
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



    const closeConfirmModal = () => setConfirmModal((prev) => ({ ...prev, isOpen: false }));

    const deleteRecord = useMutation({
        mutationFn: (id) => DELETE_APP_IMAGES(id),
        onSuccess: (data) => {
            toast.success(data?.message || "Deleted successfully");
            queryClient.invalidateQueries("appImagesList");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
            closeConfirmModal();
        },
    });

    const handleDelete = (record) => {
        setConfirmModal({
            isOpen: true,
            title: "Confirm Deletion",
            description: "Are you sure you want to delete this image set? This action cannot be undone.",
            confirmText: "Yes, Delete",
            cancelText: "Cancel",
            variant: "danger",
            onConfirm: () => deleteRecord.mutate(record._id),
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
                onClick: () => setModal({ name: "View", data: record, state: true }),
                className: "!rounded hover:!bg-emerald-50 dark:hover:!bg-emerald-900/20 transition-colors",
            },
            {
                key: "edit",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Edit Details</span>,
                icon: <EditOutlined className="text-[#006666] dark:text-teal-500" />,
                onClick: () => setModal({ name: "Edit", data: record, state: true }),
                className: "!rounded hover:!bg-blue-50 dark:hover:!bg-blue-900/20 transition-colors",
            },
            {
                type: "divider",
                className: "!my-1",
            },
            {
                key: "delete",
                label: <span className="font-medium text-red-600 dark:text-red-500">Delete Permanently</span>,
                icon: <DeleteOutlined className="text-red-500 dark:text-red-400" />,
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
            width: 170,
            sorter: true,
            render: (name) => (
                <Tooltip title={name} placement="topLeft">
                    <div className="capitalize font-bold text-slate-800 dark:text-slate-200 truncate cursor-help transition-colors duration-300">
                        {name}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: "Key",
            dataIndex: "key",
            key: "key",
            width: 170,
            sorter: true,
            render: (key) => (
                <span className="font-mono text-[10px] bg-slate-50 text-teal-700 px-2.5 py-1 rounded font-bold tracking-wider border border-slate-100">
                    {key}
                </span>
            ),
        },
        {
            title: "Images Count",
            dataIndex: "images",
            key: "images",
            width: 170,
            align: "center",
            render: (images) => (
                <span className="px-2.5 py-0.5 rounded-full font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 text-[9px] shadow-sm uppercase tracking-tighter">
                    {images?.length || 0} Assets
                </span>
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
                    scroll={{ x: 1100, y: 600 }}
                    sticky={true}
                    loading={{
                        spinning: appImagesList.isLoading,
                        indicator: <TableSkeleton rows={8} columns={activeColumns.length} />,
                    }}
                    columns={activeColumns}
                    dataSource={appImagesList?.data?.data || []}
                    pagination={{
                        current: appImagesList?.data?.pagination?.page,
                        pageSize: appImagesList?.data?.pagination?.limit,
                        total: appImagesList?.data?.pagination?.total,
                        showSizeChanger: true,
                        className: "px-4 pb-4 font-bold text-slate-600",
                        onChange: (page, pageSize) => onChange({ currentPage: Number(page), itemsPerPage: pageSize }),
                    }}
                    onChange={handleSorting}
                />
                {deleteRecord.isLoading && <Loading />}

                <ConfirmModal
                    isOpen={confirmModal.isOpen}
                    onClose={closeConfirmModal}
                    onConfirm={confirmModal.onConfirm}
                    title={confirmModal.title}
                    description={confirmModal.description}
                    confirmText={confirmModal.confirmText}
                    cancelText={confirmModal.cancelText}
                    variant={confirmModal.variant}
                    loading={deleteRecord.isLoading}
                />
            </div>
        </div>
    );
}

export default AppImagesTable;
