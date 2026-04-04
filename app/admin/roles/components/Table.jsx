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
import { ADMIN_KEYS } from "@/constants/queryKeys";
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
            queryClient.invalidateQueries([ADMIN_KEYS.ROLES.LIST]);
            toast.success("Role deleted successfully");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to delete role");
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

    const actionMenu = (record) => ({
        items: [
            {
                key: "edit",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Edit Role</span>,
                icon: <EditOutlined className="text-[#006666] dark:text-teal-500" />,
                onClick: () => setModal({
                    name: "Edit",
                    data: record,
                    state: true,
                }),
                className: "!rounded hover:!bg-blue-50 dark:hover:!bg-blue-900/20 transition-colors",
            },
            {
                type: "divider",
                className: "!my-1 dark:border-slate-800",
            },
            {
                key: "delete",
                label: <span className="font-medium text-red-600 dark:text-red-500">Delete Role</span>,
                icon: <DeleteOutlined className="text-red-500 dark:text-red-400" />,
                onClick: () => handleDelete(record),
                className: "!rounded hover:!bg-red-50 dark:hover:!bg-red-900/20 transition-colors",
            },
        ],
        className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors",
    });




    const allColumns = [
        {
            title: "Role Name",
            dataIndex: "name",
            key: "name",
            width: 150,
            sorter: true,
            render: (name) => (
                <span className="font-bold text-slate-700 dark:text-slate-200 text-[11px] truncate leading-tight block tracking-tight transition-colors duration-300">
                    {name}
                </span>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            width: 250,
            render: (description) => (
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate block leading-tight transition-colors duration-300">
                    {description || "No description provided"}
                </span>
            ),
        },
        {
            title: "Access Level",
            dataIndex: "permissions",
            key: "permissions",
            width: 170,
            align: "center",
            render: (permissions) => (
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-900/30 text-[#006666] dark:text-teal-400 border border-teal-100/50 dark:border-teal-800/50 transition-colors duration-300 shadow-sm">
                    <SecurityScanOutlined className="text-[10px]" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">
                        {permissions?.length || 0} PERMS
                    </span>
                </div>
            ),
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
                        className="!rounded hover:!bg-slate-300 !flex items-center justify-center !h-4 !w-8 transition-all"
                    />
                </Dropdown>
            ),
        },
    ];

    const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

    return (
        <div className="space-y-4">
            <div className="modern-table shadow-sm border border-slate-100 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
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
