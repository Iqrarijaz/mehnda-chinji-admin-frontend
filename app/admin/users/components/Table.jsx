"use client";
import React from "react";
import { Table, Switch, Tag, Avatar, Menu, Dropdown, Button } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    MoreOutlined,
    LockOutlined,
    SettingOutlined
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { HiOutlineUsers } from "react-icons/hi2";
import { Checkbox } from "antd";

import Loading from "@/animations/homePageLoader";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { TableSkeleton } from "@/components/shared/Skeletons";
import EmptyState from "@/components/shared/EmptyState";
import { DELETE_USER, UPDATE_USER } from "@/app/api/admin/users";
import { timestampToDate } from "@/utils/date";

const UsersTable = React.memo(({ modal, setModal, usersList, onChange, setFilters }) => {
    const queryClient = useQueryClient();
    const [confirmModal, setConfirmModal] = React.useState({
        state: false,
        onConfirm: null,
        title: "",
        content: ""
    });

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = React.useState(["user", "role", "gender", "status", "actions"]);

    const handleSorting = React.useCallback((pagination, filters, sorter) => {
        onChange({
            sortingKey: sorter.field || "_id",
            sortOrder: sorter.order === "ascend" ? 1 : -1,
            page: pagination.current,
            limit: pagination.pageSize,
        });
    }, [onChange]);

    const handleStatus = useMutation({
        mutationKey: ["updateUserStatus"],
        mutationFn: (payload) => UPDATE_USER(payload),
        onSuccess: (data) => {
            toast.success(data?.message || "Status updated successfully");
            queryClient.invalidateQueries("usersList");
            queryClient.invalidateQueries("usersStatusCounts");
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const handleDelete = useMutation({
        mutationKey: ["deleteUser"],
        mutationFn: (id) => DELETE_USER({ _id: id }),
        onSuccess: (data) => {
            toast.success(data?.message || "User deleted successfully");
            queryClient.invalidateQueries("usersList");
            queryClient.invalidateQueries("usersStatusCounts");
            setConfirmModal({ state: false, onConfirm: null, title: "", content: "" });
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Something went wrong");
        },
    });

    const closeConfirmModal = React.useCallback(() => {
        setConfirmModal({ state: false, onConfirm: null, title: "", content: "" });
    }, []);

    const actionMenu = React.useMemo(() => (record) => (
        <Menu className="!rounded-xl !p-2 !min-w-[140px] shadow-xl border border-slate-100">
            <Menu.Item
                key="edit"
                icon={<EditOutlined className="text-blue-500" />}
                onClick={() => setModal({ name: "Update", data: record, state: true })}
                className="!rounded-lg hover:!bg-blue-50"
            >
                <span className="font-medium">Edit Details</span>
            </Menu.Item>

            <Menu.Item
                key="reset"
                icon={<LockOutlined className="text-orange-500" />}
                onClick={() => setModal({ name: "ResetPassword", data: record, state: true })}
                className="!rounded-lg hover:!bg-orange-50"
            >
                <span className="font-medium">Reset Password</span>
            </Menu.Item>

            <Menu.Divider className="!my-1" />

            <Menu.Item
                key="delete"
                icon={<DeleteOutlined className="text-red-500" />}
                onClick={() => setConfirmModal({
                    state: true,
                    title: "Delete User",
                    content: `Are you sure you want to delete ${record.name}? This action cannot be undone.`,
                    onConfirm: () => handleDelete.mutate(record._id)
                })}
                className="!rounded-lg hover:!bg-red-50"
            >
                <span className="font-medium text-red-600">Delete User</span>
            </Menu.Item>
        </Menu>
    ), [setModal, handleDelete]);

    const columnOptions = [
        { label: "User Info", value: "user" },
        { label: "Role", value: "role" },
        { label: "Gender", value: "gender" },
        { label: "Contact", value: "phone" },
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

    const allColumns = React.useMemo(() => [
        {
            title: "User Information",
            key: "user",
            dataIndex: "name",
            sorter: true,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        size={42}
                        src={record.image}
                        className="bg-slate-100 text-[#006666] font-bold border-2 border-white shadow-sm"
                    >
                        {record.name?.charAt(0)}
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{record.name}</span>
                        <span className="text-xs text-slate-500 font-medium">{record.email}</span>
                    </div>
                </div>
            ),
        },
        {
            title: "Role",
            key: "role",
            dataIndex: "role",
            sorter: true,
            width: 160,
            render: (role) => (
                <Tag className="!rounded-full !px-3 font-bold !border-none !bg-slate-100 !text-slate-600 text-[10px]">
                    {role}
                </Tag>
            ),
        },
        {
            title: "Gender",
            key: "gender",
            dataIndex: "gender",
            sorter: true,
            width: 160,
            render: (gender) => (
                <span className="text-[11px] text-slate-500 font-semibold px-1 capitalize">
                    {gender || "—"}
                </span>
            ),
        },
        {
            title: "Contact",
            dataIndex: "phone",
            key: "phone",
            sorter: true,
            render: (phone) => <span className="font-medium text-slate-600">{phone || "N/A"}</span>,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 160,
            render: (status, record) => (
                <Switch
                    checked={status === "ACTIVE"}
                    onChange={(checked) =>
                        handleStatus.mutate({
                            _id: record._id,
                            status: checked ? "ACTIVE" : "INACTIVE",
                        })
                    }
                    className={status === "ACTIVE" ? "!bg-[#006666]" : "!bg-slate-300"}
                    size="small"
                />
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            sorter: true,
            render: (date) => <span className="text-slate-500 font-medium">{timestampToDate(date)}</span>,
        },
        {
            title: "",
            key: "actions",
            align: "right",
            width: 60,
            render: (_, record) => (
                <Dropdown overlay={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<MoreOutlined className="text-lg" />}
                        className="!rounded-xl hover:!bg-slate-100 !flex items-center justify-center !h-10 !w-10"
                    />
                </Dropdown>
            ),
        },
    ], [actionMenu, handleStatus]);

    const activeColumns = React.useMemo(() =>
        allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key)),
        [allColumns, visibleColumns]);


    if (!usersList.data?.data?.docs || usersList.data.data.docs.length === 0) {
        return (
            <EmptyState
                icon={<HiOutlineUsers className="w-12 h-12 text-teal-100" />}
                title="No users found"
                description="We couldn't find any users matching your criteria. Try adjusting your filters or search."
                actionTitle="Add New User"
                onAction={() => setModal({ name: "Add", data: null, state: true })}
                className="my-8"
            />
        );
    }

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
                    columns={activeColumns}
                    dataSource={usersList.data?.data?.docs}
                    loading={{
                        spinning: usersList.isLoading,
                        indicator: <TableSkeleton rows={8} columns={5} />
                    }}
                    pagination={{
                        current: usersList.data?.data?.page,
                        pageSize: usersList.data?.data?.limit,
                        total: usersList.data?.data?.totalDocs,
                        showSizeChanger: true,
                        className: "px-4 pb-4",
                    }}
                    onChange={handleSorting}
                    rowKey="_id"
                    scroll={{ x: 800, y: 600 }}
                    sticky={true}
                    className="custom-ant-table"
                />
                {(handleStatus.isLoading || handleDelete.isLoading) && <Loading />}

                <ConfirmModal
                    isOpen={confirmModal.state}
                    onConfirm={confirmModal.onConfirm}
                    onClose={closeConfirmModal}
                    title={confirmModal.title}
                    description={confirmModal.content}
                    loading={handleDelete.isLoading}
                    variant="danger"
                />
            </div>
        </div>
    );
});

export default UsersTable;
