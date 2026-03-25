import {
    EditOutlined,
    DeleteOutlined,
    EyeOutlined,
    EllipsisOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import { Table, Menu, Dropdown, Button, Checkbox, Tooltip } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/shared/ConfirmModal";
import Loading from "@/animations/homePageLoader";
import { DELETE_APP_IMAGES } from "@/app/api/admin/app-images";
import { timestampToDate } from "@/utils/date";
import { useState } from "react";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";

function AppImagesTable({ modal, setModal, appImagesList, filters, onChange, setFilters }) {
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
    const [visibleColumns, setVisibleColumns] = useState(["name", "key", "images", "createdAt", "actions"]);

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

    const actionMenu = (record) => (
        <Menu className="!rounded-xl !p-2 !min-w-[160px] shadow-xl border border-slate-100">
            <Menu.Item
                key="view"
                icon={<EyeOutlined className="text-emerald-500" />}
                onClick={() => setModal({ name: "View", data: record, state: true })}
                className="!rounded-lg hover:!bg-emerald-50"
            >
                <span className="font-medium text-slate-700">View Details</span>
            </Menu.Item>
            <Menu.Item
                key="edit"
                icon={<EditOutlined className="text-blue-500" />}
                onClick={() => setModal({ name: "Edit", data: record, state: true })}
                className="!rounded-lg hover:!bg-blue-50"
            >
                <span className="font-medium text-slate-700">Edit Details</span>
            </Menu.Item>
            <Menu.Divider className="!my-1" />
            <Menu.Item
                key="delete"
                icon={<DeleteOutlined className="text-red-500" />}
                onClick={() => handleDelete(record)}
                className="!rounded-lg hover:!bg-red-50"
            >
                <span className="font-medium text-red-600">Delete Permanently</span>
            </Menu.Item>
        </Menu>
    );

    const columnOptions = [
        { label: "Name", value: "name" },
        { label: "Key", value: "key" },
        { label: "Images Count", value: "images" },
        { label: "Created At", value: "createdAt" },
    ];

    const allColumns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 170,
            sorter: true,
            render: (name) => (
                <Tooltip title={name} placement="topLeft">
                    <div className="capitalize font-bold text-slate-800 truncate cursor-help">
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
                <span className="font-mono text-[10px] bg-slate-50 text-teal-700 px-2.5 py-1 rounded-lg font-bold tracking-wider border border-slate-100">
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
                <Dropdown overlay={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-lg text-slate-400" />}
                        className="!rounded-lg hover:!bg-slate-300 !flex items-center justify-center !h-4 !w-8"
                    />
                </Dropdown>
            ),
        }
    ];

    const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

    return (
        <div className="space-y-3">
            <div className="flex justify-end px-1">
                <ColumnVisibilityDropdown
                    options={columnOptions}
                    visibleColumns={visibleColumns}
                    setVisibleColumns={setVisibleColumns}
                />
            </div>

            <div className="place-holder-table modern-table shadow-sm border border-slate-100 rounded-xl overflow-hidden bg-white">
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
