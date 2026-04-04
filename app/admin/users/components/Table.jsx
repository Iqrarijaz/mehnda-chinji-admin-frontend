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
import { ADMIN_KEYS } from "@/constants/queryKeys";

const UsersTable = React.memo(({ modal, setModal, usersList, onChange, setFilters, visibleColumns }) => {
    const queryClient = useQueryClient();
    const [confirmModal, setConfirmModal] = React.useState({
        state: false,
        onConfirm: null,
        title: "",
        content: ""
    });



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
            queryClient.invalidateQueries([ADMIN_KEYS.USERS.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.USERS.COUNTS]);
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Something went wrong");
        },
    });

    const handleDelete = useMutation({
        mutationKey: ["deleteUser"],
        mutationFn: (id) => DELETE_USER({ _id: id }),
        onSuccess: (data) => {
            toast.success(data?.message || "User deleted successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.USERS.LIST]);
            queryClient.invalidateQueries([ADMIN_KEYS.USERS.COUNTS]);
            setConfirmModal({ state: false, onConfirm: null, title: "", content: "" });
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Something went wrong");
        },
    });

    const closeConfirmModal = React.useCallback(() => {
        setConfirmModal({ state: false, onConfirm: null, title: "", content: "" });
    }, []);

    const actionMenu = React.useMemo(() => (record) => ({
        items: [
            {
                key: "edit",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Edit Details</span>,
                icon: <EditOutlined className="text-[#006666] dark:text-teal-500" />,
                onClick: () => setModal({ name: "Update", data: record, state: true }),
                className: "!rounded hover:!bg-blue-50 dark:hover:!bg-blue-900/20 transition-colors",
            },
            {
                key: "reset",
                label: <span className="font-medium text-slate-700 dark:text-slate-300">Reset Password</span>,
                icon: <LockOutlined className="text-orange-500 dark:text-orange-400" />,
                onClick: () => setModal({ name: "ResetPassword", data: record, state: true }),
                className: "!rounded hover:!bg-orange-50 dark:hover:!bg-orange-900/20 transition-colors",
            },
            {
                type: "divider",
                className: "!my-1",
            },
            {
                key: "delete",
                label: <span className="font-medium text-red-600 dark:text-red-500">Delete User</span>,
                icon: <DeleteOutlined className="text-red-500 dark:text-red-400" />,
                onClick: () => setConfirmModal({
                    state: true,
                    title: "Delete User",
                    content: `Are you sure you want to delete ${record.name}? This action cannot be undone.`,
                    onConfirm: () => handleDelete.mutate(record._id)
                }),
                className: "!rounded hover:!bg-red-50 dark:hover:!bg-red-900/20 transition-colors",
            },
        ],
        className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors",
    }), [setModal, handleDelete]);




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
                        src={record.profileImage || record.image}
                        className="bg-slate-100 dark:bg-slate-800 text-[#006666] dark:text-teal-400 font-bold border-2 border-white dark:border-slate-700 shadow-sm !text-xs transition-colors duration-300"
                    >
                        {name?.charAt(0)}
                    </Avatar>
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] truncate leading-tight transition-colors duration-300 capitalize">{name}</span>
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
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate transition-colors duration-300 group-hover:text-slate-300">{email}</span>
            ),
        },
        {
            title: "Role",
            key: "role",
            dataIndex: "role",
            sorter: true,
            width: 170,
            render: (role) => {
                const roleColors = {
                    ADMIN: "bg-teal-100/50 dark:bg-teal-900/20 text-[#006666] dark:text-teal-400 border-teal-200 dark:border-teal-900/30",
                    SUPER_ADMIN: "bg-purple-100/50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900/30",
                    USER: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-800",
                    BLOOD_DONOR: "bg-red-100/50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/30",
                    BUSINESS_OWNER: "bg-teal-100/50 dark:bg-teal-900/20 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-900/30",
                };
                return (
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${roleColors[role] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                        {role}
                    </span>
                );
            },
        },
        {
            title: "Gender",
            key: "gender",
            dataIndex: "gender",
            sorter: true,
            width: 170,
            render: (gender) => (
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold px-1 capitalize tracking-wide transition-colors duration-300">
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
            render: (phone) => <span className="font-semibold text-slate-600 dark:text-slate-400 text-[11px] whitespace-nowrap transition-colors duration-300">{phone || "N/A"}</span>,
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
                    className={status === "ACTIVE" ? "!bg-[#006666]" : "!bg-slate-300 dark:!bg-slate-700"}
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
            render: (date) => <span className="text-slate-500 dark:text-slate-500 font-medium text-[11px] transition-colors duration-300">{timestampToDate(date)}</span>,
        },
        {
            title: "",
            key: "actions",
            align: "right",
            width: 70,
            render: (_, record) => (
                <Dropdown menu={actionMenu(record)} trigger={["click"]} placement="bottomRight">
                    <Button
                        type="text"
                        icon={<EllipsisOutlined className="text-base text-slate-400" />}
                        className="!rounded hover:!bg-slate-300 !flex items-center justify-center !h-4 !w-8"
                    />
                </Dropdown>
            ),
        },
    ], [actionMenu, handleStatus]);

    const activeColumns = React.useMemo(() =>
        allColumns.filter(col => col.key === "actions" || visibleColumns.includes(col.key)),
        [allColumns, visibleColumns]);


    if (!usersList.isLoading && (!usersList.data?.data?.docs || usersList.data?.data?.docs?.length === 0)) {
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
            <div className="place-holder-table modern-table overflow-hidden">
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
