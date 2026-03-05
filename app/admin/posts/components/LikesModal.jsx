"use client";
import React from "react";
import { Modal, Table, Avatar } from "antd";
import { useQuery } from "react-query";
import Loading from "@/animations/homePageLoader";
import { GET_POST_LIKES } from "@/app/api/admin/posts";
import { timestampToDateWithTime } from "@/utils/date";

function LikesModal({ isOpen, onClose, postId }) {
    const { data, isLoading, error } = useQuery({
        queryKey: ["postLikes", postId],
        queryFn: () => GET_POST_LIKES({ _id: postId }),
        enabled: !!postId && isOpen,
    });

    const columns = [
        {
            title: "User",
            key: "user",
            render: (record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={record.user?.profileImage}
                        size="large"
                        className="bg-gray-200"
                    >
                        {record.user?.name?.charAt(0)}
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm capitalize">{record.user?.name || "Unknown User"}</span>
                        <span className="text-xs text-gray-500">{record.user?.phone}</span>
                    </div>
                </div>
            )
        },
        {
            title: "Liked At",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 200,
            render: (date) => (
                <span className="text-xs text-gray-500">
                    {timestampToDateWithTime(date)}
                </span>
            )
        }
    ];

    return (
        <Modal
            title="Post Likes"
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={500}
            className="!rounded"
            destroyOnClose
        >
            <div className="mt-4">
                {isLoading ? (
                    <div className="py-10 flex justify-center">
                        <Loading />
                    </div>
                ) : error ? (
                    <div className="py-10 text-center text-red-500">
                        Failed to fetch likes
                    </div>
                ) : (
                    <Table
                        dataSource={data?.data || []}
                        columns={columns}
                        rowKey="_id"
                        size="small"
                        pagination={{ pageSize: 5 }}
                        className="antd-table-custom"
                    />
                )}
            </div>
        </Modal>
    );
}

export default LikesModal;
