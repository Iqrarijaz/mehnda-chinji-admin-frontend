"use client";
import React from "react";
import { Table, Tag, Button, Dropdown } from "antd";
import { EditOutlined, DeleteOutlined, EllipsisOutlined } from "@ant-design/icons";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import ConfirmModal from "@/components/shared/ConfirmModal";
import { DELETE_ANNOUNCEMENT } from "@/app/api/admin/announcements";
import { timestampToDate } from "@/utils/date";
import { ADMIN_KEYS } from "@/constants/queryKeys";

const AnnouncementsTable = React.memo(({ announcementsList, setModal, onChange, visibleColumns = [] }) => {
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

    const handleDelete = useMutation({
        mutationKey: ["deleteAnnouncement"],
        mutationFn: (id) => DELETE_ANNOUNCEMENT({ announcementId: id, hardDelete: "true" }),
        onSuccess: (data) => {
            toast.success(data?.message || "Announcement deleted successfully");
            queryClient.invalidateQueries([ADMIN_KEYS.ANNOUNCEMENTS.LIST]);
            setConfirmModal({ state: false, onConfirm: null, title: "", content: "" });
        },
        onError: (error) => {
            toast.error(error.errorMessage || "Something went wrong");
        },
    });

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
                type: "divider",
                className: "!my-1",
            },
            {
                key: "delete",
                label: <span className="font-medium text-red-600 dark:text-red-500">Delete Announcement</span>,
                icon: <DeleteOutlined className="text-red-500 dark:text-red-400" />,
                onClick: () => setConfirmModal({
                    state: true,
                    title: "Delete Announcement",
                    content: "Are you sure you want to delete this announcement? This action cannot be undone.",
                    onConfirm: () => handleDelete.mutate(record._id)
                }),
                className: "!rounded hover:!bg-red-50 dark:hover:!bg-red-900/20 transition-colors",
            },
        ],
        className: "!rounded !p-2 !min-w-[160px] shadow-xl border border-slate-100 dark:border-slate-800 dark:bg-slate-900 transition-colors",
    }), [setModal, handleDelete]);

    const columns = React.useMemo(() => [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (text) => (
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {text}
                </span>
            )
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            render: (type) => {
                let bg, text, border, dot;
                if (type === "emergency") {
                    bg = "bg-rose-50 dark:bg-rose-950/20";
                    text = "text-rose-700 dark:text-rose-400";
                    border = "border-rose-200/60 dark:border-rose-900/30";
                    dot = "bg-rose-500";
                } else if (type === "health") {
                    bg = "bg-emerald-50 dark:bg-emerald-950/20";
                    text = "text-emerald-700 dark:text-emerald-400";
                    border = "border-emerald-200/60 dark:border-emerald-900/30";
                    dot = "bg-emerald-500";
                } else if (type === "education") {
                    bg = "bg-purple-50 dark:bg-purple-950/20";
                    text = "text-purple-700 dark:text-purple-400";
                    border = "border-purple-200/60 dark:border-purple-900/30";
                    dot = "bg-purple-500";
                } else {
                    bg = "bg-sky-50 dark:bg-sky-950/20";
                    text = "text-sky-700 dark:text-sky-400";
                    border = "border-sky-200/60 dark:border-sky-900/30";
                    dot = "bg-sky-500";
                }
                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${bg} ${text} ${border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                        {type}
                    </span>
                );
            }
        },
        {
            title: "Author",
            dataIndex: ["authorId", "name"],
            key: "author",
            render: (text, record) => record.authorId?.name || "System"
        },
        {
            title: "Essential Place",
            dataIndex: ["essentialId", "name"],
            key: "essential",
            render: (text, record) => record.essentialId?.name || "Public Announcement"
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date) => timestampToDate(date)
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
            )
        }
    ], [actionMenu]);

    const activeColumns = React.useMemo(() =>
        columns.filter(col => col.key === "actions" || visibleColumns.includes(col.key)),
        [columns, visibleColumns]);

    const { docs = [], totalDocs = 0, limit = 10, page = 1 } = announcementsList || {};

    return (
        <>
            <Table
                dataSource={docs}
                columns={activeColumns}
                rowKey="_id"
                onChange={handleSorting}
                pagination={{
                    total: totalDocs,
                    pageSize: limit,
                    current: page,
                    showSizeChanger: true,
                    pageSizeOptions: ["10", "20", "50", "100"]
                }}
            />
            <ConfirmModal
                isOpen={confirmModal.state}
                onClose={() => setConfirmModal({ state: false, onConfirm: null, title: "", content: "" })}
                title={confirmModal.title}
                description={confirmModal.content}
                onConfirm={confirmModal.onConfirm}
                variant="danger"
            />
        </>
    );
});

AnnouncementsTable.displayName = "AnnouncementsTable";

export default AnnouncementsTable;
