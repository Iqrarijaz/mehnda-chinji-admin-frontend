"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";
import { usePostsContext } from "@/context/admin/posts/PostsContext";
import { DELETE_POST, UPDATE_POST_STATUS } from "@/app/api/admin/posts";
import PostCard from "./PostCard";
import ConfirmModal from "@/components/shared/ConfirmModal";
import Loading from "@/animations/homePageLoader";

function PostCardList({ modal, setModal }) {
    const queryClient = useQueryClient();
    const { postsList, loadMore, hasMore, setFilters } = usePostsContext();
    const [expandedPostIds, setExpandedPostIds] = useState(new Set());
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        title: "",
        description: "",
        onConfirm: null,
        variant: "primary",
        confirmText: "Confirm",
        cancelText: "Cancel"
    });

    const toggleExpand = (postId) => {
        setExpandedPostIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(postId)) {
                newSet.delete(postId);
            } else {
                newSet.add(postId);
            }
            return newSet;
        });
    };

    const observerRef = useRef(null);
    const loadMoreRef = useRef(null);

    // Infinite scroll observer
    const lastPostRef = useCallback(node => {
        if (postsList?.status === "loading") return;
        if (observerRef.current) observerRef.current.disconnect();

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                loadMore();
            }
        }, { threshold: 0.1 });

        if (node) observerRef.current.observe(node);
    }, [postsList?.status, hasMore, loadMore]);

    const closeConfirmModal = () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
    };

    // Status mutation
    const manageStatusMutation = useMutation({
        mutationFn: UPDATE_POST_STATUS,
        onSuccess: (data) => {
            queryClient.invalidateQueries("postsList");
            queryClient.invalidateQueries("postsListInfinite");
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
            queryClient.invalidateQueries("postsListInfinite");
            toast.success(data?.message);
            closeConfirmModal();
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete post");
            closeConfirmModal();
        },
    });

    const handleEdit = (post) => {
        setModal({
            name: "Update",
            data: post,
            state: true
        });
    };

    const handleStatusChange = (post) => {
        const isActive = post?.status === "ACTIVE";
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Status Change',
            description: `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} this post?`,
            confirmText: 'Yes, Change',
            cancelText: 'No, Keep',
            variant: 'primary',
            onConfirm: () => manageStatusMutation.mutate({ _id: post._id })
        });
    };

    const handleDelete = (post) => {
        setConfirmModal({
            isOpen: true,
            title: 'Confirm Deletion',
            description: 'Are you sure you want to delete this post? This action cannot be undone.',
            confirmText: 'Yes, Delete',
            cancelText: 'Cancel',
            variant: 'danger',
            onConfirm: () => deleteMutation.mutate({ _id: post._id })
        });
    };

    const posts = postsList?.data?.data || [];
    const isLoading = postsList?.status === "loading";
    const isLoadingMore = postsList?.isFetchingNextPage;

    if (isLoading && posts.length === 0) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loading />
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-lg">No posts found</p>
                <p className="text-sm">Try adjusting your filters or add a new post</p>
            </div>
        );
    }

    return (
        <>
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
                {posts.map((post, index) => {
                    const isLastPost = index === posts.length - 1;
                    return (
                        <div
                            key={post._id}
                            ref={isLastPost ? lastPostRef : null}
                            className="break-inside-avoid"
                        >
                            <PostCard
                                post={post}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onStatusChange={handleStatusChange}
                                isExpanded={expandedPostIds.has(post._id)}
                                onToggleExpand={() => toggleExpand(post._id)}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Loading more indicator */}
            {isLoadingMore && (
                <div className="flex items-center justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            )}

            {/* End of list message */}
            {!hasMore && posts.length > 0 && (
                <p className="text-center text-gray-400 text-sm py-6">
                    You've reached the end of the list
                </p>
            )}

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

export default PostCardList;
