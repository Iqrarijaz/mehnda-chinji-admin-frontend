"use client";
import React from "react";
import { Table, Switch, Tag, Avatar, Menu, Dropdown, Button } from "antd";
import {
    EditOutlined,
    DeleteOutlined,
    EllipsisOutlined,
    LockOutlined,
    SettingOutlined
} from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { HiOutlineUsers } from "react-icons/hi2";

import Loading from "@/animations/homePageLoader";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { TableSkeleton } from "@/components/shared/Skeletons";
import EmptyState from "@/components/shared/EmptyState";
import { DELETE_USER, UPDATE_USER } from "@/app/api/admin/users";
import { timestampToDate } from "@/utils/date";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";

const UsersTable = React.memo(({ modal, setModal, usersList, onChange, setFilters }) => {
    const queryClient = useQueryClient();
    const [confirmModal, setConfirmModal] = React.useState({
        state: false,
        onConfirm: null,
        title: "",
        content: ""
    });

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = React.useState(["name", "email", "role", "gender", "status", "actions"]);

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
        { label: "Name", value: "name" },
        { label: "Email", value: "email" },
        { label: "Role", value: "role" },
        { label: "Gender", value: "gender" },
        { label: "Contact", value: "phone" },
        { label: "Status", value: "status" },
        { label: "Created At", value: "createdAt" },
    ];


    const allColumns = React.useMemo(() => [
        {
            title: "Name",
            key: "name",
            dataIndex: "name",
            sorter: true,
            width: 170,
            render: (name, record) => (
                <div className="flex items-center gap-2.5">
                    <Avatar
                        size={32}
                        src={record.image}
                        className="bg-slate-100 text-[#006666] font-bold border-2 border-white shadow-sm !text-xs"
                    >
                        {name?.charAt(0)}
                    </Avatar>
                    <span className="font-bold text-slate-800 text-xs truncate leading-tight">{name}</span>
                </div>
            ),
        },
        {
            title: "Email",
            key: "email",
            dataIndex: "email",
            sorter: true,
            width: 200,
            render: (email) => (
                <span className="text-[10px] text-slate-400 font-medium truncate">{email}</span>
            ),
        },
        {
            title: "Role",
            key: "role",
            dataIndex: "role",
            sorter: true,
            width: 170,
            render: (role) => (
                <Tag className="!rounded-full !px-2.5 !py-0.5 font-bold !border-none !bg-slate-100 !text-slate-600 text-[9px] uppercase tracking-wider">
                    {role}
                </Tag>
            ),
        },
        {
            title: "Gender",
            key: "gender",
            dataIndex: "gender",
            sorter: true,
            width: 170,
            render: (gender) => (
                <span className="text-[10px] text-slate-500 font-bold px-1 capitalize tracking-wide">
                    {gender || "—"}
                </span>
            ),
        },
        {
            title: "Contact",
            dataIndex: "phone",
            key: "phone",
            sorter: true,
            width: 170,
            render: (phone) => <span className="font-semibold text-slate-600 text-xs whitespace-nowrap">{phone || "N/A"}</span>,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 170,
            align: "center",
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
            width: 170,
            sorter: true,
            render: (date) => <span className="text-slate-500 font-medium text-xs">{timestampToDate(date)}</span>,
        },
        {
            title: "",
            key: "actions",
            align: "right",
            width: 70,
            render: (_, record) => (
                <Dropdown overlay={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-lg rotate-90" />}
                        className="!rounded-lg hover:!bg-slate-100 !flex items-center justify-center !h-8 !w-8 transition-all"
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
                <ColumnVisibilityDropdown
                    visibleColumns={visibleColumns}
                    setVisibleColumns={setVisibleColumns}
                    options={columnOptions}
                />
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
                    scroll={{ x: 1300, y: 600 }}
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
