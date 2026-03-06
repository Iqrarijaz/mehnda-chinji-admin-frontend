import {
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    SettingOutlined
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { DELETE_ADMIN_USER, UPDATE_ADMIN_USER_STATUS } from "@/app/api/admin/admin-users";
import Loading from "@/animations/homePageLoader";
import { getTagColor } from "@/utils/tagColor";
import { Menu, Dropdown, Button, Checkbox } from "antd";
import { TableSkeleton } from "@/components/shared/Skeletons";
import { useState } from "react";

const AdminUsersTable = ({ setModal, adminUsersList, filters, onChange }) => {
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

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["name", "email", "role", "status", "actions"]);

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
            queryClient.invalidateQueries("adminUsersList");
            queryClient.invalidateQueries("adminUsersStatusCounts");
            toast.success(data?.message || "Status updated successfully");
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
            closeConfirmModal();
        },
    });

    // Mutation for delete
    const deleteMutation = useMutation({
        mutationFn: DELETE_ADMIN_USER,
        onSuccess: () => {
            queryClient.invalidateQueries("adminUsersList");
            queryClient.invalidateQueries("adminUsersStatusCounts");
            toast.success("Admin user deleted successfully");
            closeConfirmModal();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || "Failed to delete admin user");
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

    const actionMenu = (record) => (
        <Menu className="!rounded-xl !p-2 !min-w-[140px] shadow-xl border border-slate-100">
            <Menu.Item
                key="edit"
                icon={<EditOutlined className="text-blue-500" />}
                onClick={() => setModal({ name: "Edit", data: record, state: true })}
                className="!rounded-lg hover:!bg-blue-50"
            >
                <span className="font-medium">Edit User</span>
            </Menu.Item>
            <Menu.Divider className="!my-1" />
            <Menu.Item
                key="delete"
                icon={<DeleteOutlined className="text-red-500" />}
                onClick={() => handleDelete(record)}
                className="!rounded-lg hover:!bg-red-50"
            >
                <span className="font-medium text-red-600">Delete User</span>
            </Menu.Item>
        </Menu>
    );

    const columnOptions = [
        { label: "Name", value: "name" },
        { label: "Email", value: "email" },
        { label: "Phone", value: "phone" },
        { label: "Role Type", value: "role" },
        { label: "Status", value: "status" },
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
            title: "Name",
            dataIndex: "name",
            key: "name",
            width: 150,
            sorter: true,
            render: (text) => <span className="capitalize font-bold text-slate-800">{text}</span>,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 250,
            sorter: true,
            render: (text) => <span className="text-slate-500 font-medium">{text}</span>,
        },
        {
            title: "Phone",
            dataIndex: "phone",
            key: "phone",
            width: 150,
            sorter: true,
            render: (text) => <span className="text-slate-600 font-medium">{text || "-"}</span>,
        },
        {
            title: "Role Type",
            dataIndex: "role",
            key: "role",
            width: 150,
            align: "center",
            sorter: true,
            render: (role) => (
                <span
                    className="mr-0 text-[10px] px-3 py-1 rounded-full capitalize font-bold text-white"
                    style={{ backgroundColor: getTagColor(role) }}
                >
                    {role}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            align: "center",
            width: 100,
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
                    scroll={{ x: 900, y: 600 }}
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
