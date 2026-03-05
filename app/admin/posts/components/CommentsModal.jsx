"use client";
import React, { useState } from "react";
import { Modal, List, Avatar, Button, Popconfirm, Tooltip } from "antd";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FaTrash, FaCommentDots } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "@/animations/homePageLoader";
import { GET_POST_COMMENTS, DELETE_POST_COMMENT } from "@/app/api/admin/posts";
import { timestampToDateWithTime } from "@/utils/date";

function CommentsModal({ isOpen, onClose, postId }) {
    const queryClient = useQueryClient();
    const { data, isLoading, error } = useQuery({
        queryKey: ["postComments", postId],
        queryFn: () => GET_POST_COMMENTS({ _id: postId }),
        enabled: !!postId && isOpen,
    });

    const deleteMutation = useMutation({
        mutationFn: (commentId) => DELETE_POST_COMMENT({ commentId, postId }),
        onSuccess: (res) => {
            toast.success(res?.message || "Comment deleted");
            queryClient.invalidateQueries(["postComments", postId]);
            queryClient.invalidateQueries("postsList");
            queryClient.invalidateQueries("postsListInfinite");
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Failed to delete comment");
        }
    });

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <FaCommentDots className="text-secondary" />
                    <span>Post Comments</span>
                </div>
            }
            open={isOpen}
            onCancel={onClose}
            footer={null}
            width={650}
            className="!rounded"
            destroyOnClose
        >
            <div className="mt-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoading ? (
                    <div className="py-20 flex justify-center">
                        <Loading />
                    </div>
                ) : error ? (
                    <div className="py-10 text-center text-red-500">
                        Failed to load comments
                    </div>
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={data?.data || []}
                        locale={{ emptyText: "No comments yet" }}
                        renderItem={(item) => (
                            <List.Item
                                className="group hover:bg-gray-50 p-3 rounded-lg transition-colors border-b last:border-0"
                                actions={[
                                    <Popconfirm
                                        key="delete"
                                        title="Delete this comment?"
                                        onConfirm={() => deleteMutation.mutate(item._id)}
                                        okText="Yes"
                                        cancelText="No"
                                        okButtonProps={{ danger: true, loading: deleteMutation.isLoading }}
                                    >
                                        <Tooltip title="Delete Comment">
                                            <Button
                                                type="text"
                                                danger
                                                icon={<FaTrash size={14} />}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            />
                                        </Tooltip>
                                    </Popconfirm>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <Avatar
                                            src={item.user?.profileImage}
                                            size="default"
                                            className="bg-blue-100 text-blue-600"
                                        >
                                            {item.user?.name?.charAt(0)}
                                        </Avatar>
                                    }
                                    title={
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-sm text-gray-800 capitalize">
                                                {item.user?.name || "Anonymous"}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {timestampToDateWithTime(item.createdAt)}
                                            </span>
                                        </div>
                                    }
                                    description={
                                        <div className="mt-1 text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                            {item.text}
                                        </div>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                )}
            </div>
        </Modal>
    );
}

export default CommentsModal;
