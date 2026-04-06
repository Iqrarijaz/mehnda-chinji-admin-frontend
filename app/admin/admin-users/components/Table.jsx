import {
    EditOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    SettingOutlined
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { DELETE_ADMIN_USER, UPDATE_ADMIN_USER_STATUS } from "@/app/api/admin/admin-users";
import Loading from "@/animations/homePageLoader";
import { getTagColor } from "@/utils/tagColor";
import { Menu, Dropdown, Button, Table, Switch } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const AdminUsersTable = ({ setModal, adminUsersList, filters, onChange, visibleColumns }) => {
    const queryClient = useQueryClient();
    const { data, isLoading } = adminUsersList;

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

    const handleSorting = (pagination, filters, sorter) => {
        onChange({
            sortingKey: sorter.field || "_id",
            sortOrder: sorter.order === "ascend" ? 1 : -1,
            page: pagination.current,
        });
    };

    // Status mutation
    const manageStatusMutation = useMutation({
        mutationFn: UPDATE_ADMIN_USER_STATUS,
        onSuccess: (data) => {
            queryClient.invalidateQueries([ADMIN_KEYS.ADMIN_USERS.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.ADMIN_USERS.COUNTS]);
            toast.success(data?.message || "Status updated successfully");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Failed to update status");
            closeConfirmModal();
        },
    });

    // Mutation for delete
    const deleteMutation = useMutation({
        mutationFn: DELETE_ADMIN_USER,
        onSuccess: () => {
            queryClient.invalidateQueries([ADMIN_KEYS.ADMIN_USERS.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.ADMIN_USERS.COUNTS]);
            toast.success("Admin user deleted successfully");
            closeConfirmModal();
        },
        onError: (err) => {
            toast.error(err.errorMessage || "Failed to delete admin user");
            closeConfirmModal();
        },
    });

    const handleStatus = (record) => {
        const newStatus = record.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Status Change',
            description: `Are you sure you want to ${record.status === "ACTIVE" ? 'deactivate' : 'activate'} "${record.name}"?`,
            confirmText: 'Yes, Change',
            cancelText: 'No, Keep',
            variant: 'primary',
            onConfirm: () => manageStatusMutation.mutate({
                _id: record._id,
                status: newStatus
            })
        });
    };

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

    const actionMenu = (record) => ({
        items: [
            {
                key: "edit",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Edit User</span>,
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
                label: <span className="font-medium text-red-600 dark:text-red-500">Delete User</span>,
                icon: <DeleteOutlined className="text-red-500 dark:text-red-400" />,
                onClick: () => handleDelete(record),
                className: "!rounded hover:!bg-red-50 dark:hover:!bg-red-900/20 transition-colors",
            },
        ],
        className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors",
    });




    const allColumns = [
        {
            title: "Admin Name",
            key: "name",
            dataIndex: "name",
            width: 200,
            sorter: true,
            render: (name) => (
                <span className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate leading-tight block capitalize transition-colors duration-300">
                    {name}
                </span>
            ),
        },
        {
            title: "Email Address",
            key: "email",
            dataIndex: "email",
            width: 220,
            sorter: true,
            render: (email) => (
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate block leading-tight transition-colors duration-300">
                    {email || "—"}
                </span>
            ),
        },
        {
            title: "Contact",
            dataIndex: "phone",
            key: "phone",
            width: 170,
            sorter: true,
            render: (text) => <span className="text-slate-600 dark:text-slate-400 font-semibold text-xs whitespace-nowrap transition-colors duration-300">{text || "—"}</span>,
        },
        {
            title: "Role Type",
            dataIndex: "role",
            key: "role",
            width: 170,
            align: "center",
            sorter: true,
            render: (role) => (
                <div
                    className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border border-current"
                    style={{ backgroundColor: `${getTagColor(role)}15`, color: getTagColor(role) }}
                >
                    {role}
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 170,
            render: (status, record) => (
                <Switch
                    checked={status === "ACTIVE"}
                    onChange={() => handleStatus(record)}
                    className={status === "ACTIVE" ? "!bg-[#006666]" : "!bg-slate-300"}
                    size="small"
                />
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
                        className="!rounded hover:!bg-slate-300 !flex items-center justify-center !h-4 !w-8"
                    />
                </Dropdown>
            ),
        },
    ];

    const activeColumns = allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key));

    return (
        <div className="space-y-4">
            <div className="place-holder-table modern-table shadow-sm border border-slate-100 dark:border-slate-800 rounded overflow-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
                <Table
                    rowKey="_id"
                    className="custom-ant-table"
                    scroll={{ x: 1000, y: 600 }}
                    sticky={true}
                    loading={{
                        spinning: isLoading,
                        indicator: <TableSkeleton rows={8} columns={5} />,
                    }}
                    columns={activeColumns}
                    dataSource={data?.data?.docs || []}
                    pagination={{
                        current: data?.data?.page || 1,
                        pageSize: data?.data?.limit || 10,
                        total: data?.data?.totalDocs || 0,
                        showSizeChanger: true,
                        className: "px-4 pb-4",
                        onChange: (page, pageSize) => onChange({ page, limit: pageSize }),
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
                    loading={manageStatusMutation.isLoading || deleteMutation.isLoading}
                />
            </div>
        </div>
    );
};

export default AdminUsersTable;
