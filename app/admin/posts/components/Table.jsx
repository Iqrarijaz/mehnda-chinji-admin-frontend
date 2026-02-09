"use client";
import { Modal, Pagination, Table, Tag } from "antd";
import React, { useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import Loading from "@/animations/homePageLoader";
import { Switch } from "antd";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { CustomPopover } from "@/components/popHover";
import { usePostsContext } from "@/context/admin/posts/PostsContext";
import { timestampToDate, timestampToDateWithTime } from "@/utils/date";
import { DELETE_POST, UPDATE_POST_STATUS } from "@/app/api/admin/posts";
import { popoverContent } from "@/components/popHover/popHoverContent";
import ViewModal from "./ViewModal";
import { getTagColor } from "@/utils/tagColor";
import ConfirmModal from "@/components/shared/ConfirmModal";

function PostsTable({ modal, setModal }) {
    const queryClient = useQueryClient();
    const { postsList, onChange, setFilters } = usePostsContext();
    const [viewModal, setViewModal] = useState({ open: false, data: null });
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

    // Status mutation
    const manageStatusMutation = useMutation({
        mutationFn: UPDATE_POST_STATUS,
        onSuccess: (data) => {
            queryClient.invalidateQueries("postsList");
            toast.success(data?.message);
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to update status");
            closeConfirmModal();
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: DELETE_POST,
        onSuccess: (data) => {
            queryClient.invalidateQueries("postsList");
            toast.success(data?.message);
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete post");
            closeConfirmModal();
        },
    });

    const handleStatus = (data) => {
        const isActive = data?.status === "ACTIVE";
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Status Change',
            description: `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this post?`,
            confirmText: 'Yes, Change',
            cancelText: 'No, Keep',
            variant: 'primary',
            onConfirm: () => manageStatusMutation.mutate({
                _id: data._id
            })
        });
    };

    const handleDelete = (data) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: 'Are you sure you want to delete this post? This action cannot be undone.',
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate({
                _id: data._id,
            })
        });
    };

    const handleSorting = (pagination, filters, sorter) => {
        setFilters(prev => ({
            ...prev,
            sortingKey: sorter.field,
            sortOrder: sorter.order === "ascend" ? 1 : -1
        }));
    };

    const actionMenu = [
        {
            heading: "View",
            icon: <FaEye size={16} />,
            handleFunction: (record) => setViewModal({ open: true, data: record }),
        },
        {
            heading: "Edit",
            icon: <FaEdit size={16} />,
            handleFunction: (record) => setModal({
                name: "Update",
                data: record,
                state: true
            }),
        },
        {
            heading: "Delete",
            icon: <FaTrash size={16} />,
            handleFunction: (record) => handleDelete(record),
        },
    ];

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            sorter: (a, b) => a.title?.localeCompare(b.title),
            width: 200,
            render: (title) => (
                <div className="capitalize overflow-hidden whitespace-nowrap text-ellipsis" title={title}>
                    {title}
                </div>
            ),
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            width: 120,
            align: "center",
            render: (type) => (
                <span
                    className="mr-0 text-[10px] px-2 py-1 rounded capitalize font-semibold text-white"
                    style={{ backgroundColor: getTagColor(type) }}
                >
                    {type || "GENERAL"}
                </span>
            ),
        },
        {
            title: "Content",
            dataIndex: "content",
            key: "content",
            width: 250,
            render: (content) => (
                <div className="overflow-hidden whitespace-nowrap text-ellipsis" title={content}>
                    {content?.substring(0, 80)}{content?.length > 80 ? '...' : ''}
                </div>
            ),
        },
        {
            title: "Likes",
            dataIndex: "likesCount",
            key: "likesCount",
            width: 80,
            align: "center",
            sorter: (a, b) => a.likesCount - b.likesCount,
            render: (count) => (
                <div className="font-semibold">
                    {count || 0}
                </div>
            ),
        },
        {
            title: "Comments",
            dataIndex: "commentsCount",
            key: "commentsCount",
            width: 100,
            align: "center",
            sorter: (a, b) => a.commentsCount - b.commentsCount,
            render: (count) => (
                <div className="font-semibold">
                    {count || 0}
                </div>
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
                    className={status === "ACTIVE" ? '' : 'ant-switch-red'}
                />
            ),
        },
        {
            title: "Created At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 170,
            render: (text) => <div className="whitespace-nowrap">{timestampToDateWithTime(text)}</div>,
        },
        {
            title: "Actions",
            key: "actions",
            width: 80,
            align: "center",
            render: (record) => (
                <div className="flex items-center justify-center">
                    <CustomPopover
                        triggerContent={
                            <HiOutlineDotsHorizontal
                                size={28}
                                className="hover:text-secondary cursor-pointer"
                            />
                        }
                        popoverContent={() => popoverContent(actionMenu, record)}
                    />
                </div>
            ),
        }
    ];

    return (
        <>
            <Table
                rowKey="_id"
                className="antd-table-custom rounded"
                size="small"
                tableLayout="fixed"
                bordered
                scroll={{ x: 1200 }}
                loading={{
                    spinning: postsList?.status === "loading",
                    indicator: <Loading />,
                }}
                columns={columns}
                dataSource={postsList?.data?.data}
                pagination={false}
                onChange={handleSorting}
            />

            <Pagination
                className="flex justify-end mt-4"
                pageSize={postsList?.data?.pagination?.itemsPerPage}
                total={postsList?.data?.pagination?.totalItems}
                current={postsList?.data?.pagination?.currentPage}
                onChange={(page) => onChange({ currentPage: Number(page) })}
            />

            {/* View Modal */}
            <ViewModal viewModal={viewModal} setViewModal={setViewModal} />

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
        </>
    );
}

export default PostsTable;
