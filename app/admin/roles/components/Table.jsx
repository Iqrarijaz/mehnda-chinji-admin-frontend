import {
    EditOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    SettingOutlined,
    SecurityScanOutlined
} from "@ant-design/icons";
import Loading from "@/animations/homePageLoader";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { DELETE_ROLE } from "@/app/api/admin/roles";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { Pagination, Table, Tag, Tooltip, Menu, Dropdown, Button } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";

const RolesTable = ({ setModal, rolesList, filters, onChange, visibleColumns }) => {
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
        mutationFn: DELETE_ROLE,
        onSuccess: () => {
            queryClient.invalidateQueries("rolesList");
            toast.success("Role deleted successfully");
            closeConfirmModal();
        },
        onError: () => {
            toast.error("Failed to delete role");
            closeConfirmModal();
        },
    });

    const handleDelete = (record) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: `Are you sure you want to delete "${record.name}"? This action cannot be undone.`,
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate({ _id: record._id })
        });
    };

    const handleSorting = (pagination, filters, sorter) => {
        onChange({
            ...filters,
            sortingKey: sorter.field || "name",
            sortOrder: sorter.order === "ascend" ? 1 : -1,
            currentPage: pagination.current,
        });
    };

    const actionMenu = (record) => (
        <Menu className="!rounded !p-2 !min-w-[140px] shadow-xl border border-slate-100">
            <Menu.Item
                key="edit"
                icon={<EditOutlined className="text-blue-500" />}
                onClick={() => setModal({
                    name: "Edit",
                    data: record,
                    state: true,
                })}
                className="!rounded-lg hover:!bg-blue-50"
            >
                <span className="font-medium">Edit Role</span>
            </Menu.Item>
            <Menu.Divider className="!my-1" />
            <Menu.Item
                key="delete"
                icon={<DeleteOutlined className="text-red-500" />}
                onClick={() => handleDelete(record)}
                className="!rounded-lg hover:!bg-red-50"
            >
                <span className="font-medium text-red-600">Delete Role</span>
            </Menu.Item>
        </Menu>
    );




    const allColumns = [
        {
            title: "Role Info",
            key: "name",
            width: 250,
            sorter: true,
            render: (record) => (
                <div className="flex flex-col min-w-0">
                    <span className="font-bold text-slate-800 text-xs truncate leading-tight block">{record.name}</span>
                    <span className="text-[10px] text-slate-400 font-medium truncate block leading-tight mt-0.5">{record.description || "No description provided"}</span>
                </div>
            ),
        },
        {
            title: "Access Level",
            dataIndex: "permissions",
            key: "permissions",
            width: 170,
            align: "center",
            render: (permissions) => (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100/50">
                    <SecurityScanOutlined className="text-[10px]" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                        {permissions?.length || 0} PERMS
                    </span>
                </div>
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
                        className="!rounded-lg hover:!bg-slate-100 !flex items-center justify-center !h-8 !w-8 transition-all"
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
                    scroll={{ x: 1100, y: 600 }}
                    sticky={true}
                    loading={{
                        spinning: rolesList.isLoading,
                        indicator: <TableSkeleton rows={8} columns={3} />,
                    }}
                    columns={activeColumns}
                    dataSource={rolesList?.data?.data?.docs || []}
                    pagination={{
                        current: filters.currentPage,
                        pageSize: filters.itemsPerPage,
                        total: rolesList?.data?.data?.totalDocs || 0,
                        showSizeChanger: true,
                        className: "px-4 pb-4",
                        onChange: (page, pageSize) => onChange({ currentPage: page, itemsPerPage: pageSize }),
                    }}
                    onChange={handleSorting}
                />

                {deleteMutation.isLoading && <Loading />}

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
        </div>
    );
};

export default RolesTable;
