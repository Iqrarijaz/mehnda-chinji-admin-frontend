"use client";
import React, { useState } from "react";
import {
    HeartFilled,
    MessageFilled,
    EditOutlined,
    DeleteOutlined,
    ClockCircleOutlined,
    PictureOutlined,
    UserOutlined
} from "@ant-design/icons";
import { Switch, Button, Avatar, Tooltip } from "antd";
import { timestampToDate, timestampToDateWithTime } from "@/utils/date";
import { getTagColor } from "@/utils/tagColor";
import ImageViewer from "@/components/shared/ImageViewer";

function PostCard({
    post,
    onEdit,
    onDelete,
    onStatusChange,
    isExpanded,
    onToggleExpand,
    setLikesModal,
    setCommentsModal
}) {
    const isActive = post?.status === "ACTIVE";
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Get all images from media or images array
    const allImages = post?.media?.map(m => m.url) || post?.images || [];
    const hasMultipleImages = allImages.length > 1;

    const getProxiedImageUrl = (url) => {
        if (!url) return null;
        if (url.includes("unsplash.com/photos/")) {
            const parts = url.split("/");
            const lastPart = parts[parts.length - 1];
            if (lastPart) {
                const subParts = lastPart.split("-");
                const id = subParts[subParts.length - 1];
                return `https://images.unsplash.com/photo-1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80&ixid=${id}`;
            }
        }
        return url;
    };

    const handleImageClick = (e, index = 0) => {
        e.stopPropagation();
        if (allImages.length > 0) {
            setSelectedImageIndex(index);
            setImageViewerOpen(true);
        }
    };

    const renderImageHeader = () => {
        const safeImages = allImages.map(getProxiedImageUrl);
        const count = safeImages.length;
        const imageUrl = safeImages[0];

        if (count === 0) {
            return (
                <div className="w-full h-48 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 text-slate-300 dark:text-slate-600 gap-2 border-b border-slate-100 dark:border-slate-800 transition-colors">
                    <PictureOutlined className="text-4xl" />
                    <span className="text-xs font-medium uppercase tracking-wider">No Media</span>
                </div>
            );
        }

        return (
            <div className="relative group overflow-hidden border-b border-slate-100 dark:border-slate-800 h-56">
                <img
                    src={imageUrl}
                    alt="Post media"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onClick={(e) => handleImageClick(e, 0)}
                />
                {count > 1 && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-white text-[10px] font-bold flex items-center gap-1.5 shadow-lg">
                        <PictureOutlined />
                        {count} Images
                    </div>
                )}
                <div
                    className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                />
            </div>
        );
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-900 rounded overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:shadow-teal-500/5 hover:-translate-y-1 transition-all duration-300 flex flex-col w-full break-inside-avoid mb-6 group/card">
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b border-slate-50 dark:border-slate-800/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <Avatar
                            icon={<UserOutlined />}
                            className="!bg-teal-50 dark:!bg-teal-900/20 !text-teal-600 dark:!text-teal-400 border border-teal-100 dark:border-teal-900/30 transition-colors"
                        />
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover/card:text-[#006666] dark:group-hover/card:text-teal-400 transition-colors line-clamp-1">
                                {post?.authorName || "Anonymous User"}
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                                <ClockCircleOutlined className="text-slate-300" />
                                {timestampToDateWithTime(post?.createdAt)}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <span
                            className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border shadow-sm"
                            style={{
                                backgroundColor: `${getTagColor(post?.type)}15`,
                                color: getTagColor(post?.type),
                                borderColor: `${getTagColor(post?.type)}30`
                            }}
                        >
                            {post?.type || "GENERAL"}
                        </span>
                    </div>
                </div>

                {/* Media */}
                {renderImageHeader()}

                {/* Content */}
                <div className="p-4 flex-1">
                    {post?.title && (
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 leading-snug line-clamp-2 transition-colors">
                            {post.title}
                        </h3>
                    )}
                    <div className="relative">
                        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed transition-colors">
                            {isExpanded ? post?.content : (
                                <>
                                    {post?.content?.substring(0, 120)}
                                    {post?.content?.length > 120 && "..."}
                                </>
                            )}
                        </p>
                        {post?.content?.length > 120 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleExpand();
                                }}
                                className="text-[#006666] text-[10px] font-bold hover:underline mt-2 block transition-all"
                            >
                                {isExpanded ? "Show Less" : "Read More"}
                            </button>
                        )}
                    </div>
                </div>

                {/* Engagement Stats */}
                <div className="px-4 py-3 flex items-center gap-4 border-t border-slate-50 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/20 transition-colors">
                    <Tooltip title="View Likes">
                        <div
                            className="flex items-center gap-1.5 cursor-pointer group/stat"
                            onClick={(e) => {
                                e.stopPropagation();
                                setLikesModal({ open: true, postId: post._id });
                            }}
                        >
                            <div className="w-7 h-7 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover/stat:bg-red-100 dark:group-hover/stat:bg-red-900/40 transition-colors">
                                <HeartFilled className="text-red-500 text-[11px]" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover/stat:text-red-600 dark:group-hover/stat:text-red-400 transition-colors">
                                {post?.likesCount || 0}
                            </span>
                        </div>
                    </Tooltip>
                    <Tooltip title="View Comments">
                        <div
                            className="flex items-center gap-1.5 cursor-pointer group/stat"
                            onClick={(e) => {
                                e.stopPropagation();
                                setCommentsModal({ open: true, postId: post._id });
                            }}
                        >
                            <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover/stat:bg-blue-100 dark:group-hover/stat:bg-blue-900/40 transition-colors">
                                <MessageFilled className="text-[#006666] dark:text-teal-400 text-[11px]" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover/stat:text-[#006666] dark:group-hover/stat:text-teal-400 transition-colors">
                                {post?.commentsCount || 0}
                            </span>
                        </div>
                    </Tooltip>
                </div>

                {/* Footer Actions */}
                <div className="p-4 pt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 transition-colors">
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/40 px-3 py-1.5 rounded border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Status</span>
                        <Switch
                            checked={isActive}
                            onChange={() => onStatusChange(post)}
                            size="small"
                            className={isActive ? '!bg-[#006666]' : '!bg-slate-300'}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Tooltip title="Edit Post">
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => onEdit(post)}
                                className="!rounded !border-slate-100 dark:!border-slate-800 hover:!border-[#006666] dark:hover:!border-teal-400 hover:!text-[#006666] dark:hover:!text-teal-400 !flex items-center justify-center !h-9 !w-9 bg-white dark:bg-slate-900 shadow-sm transition-all"
                            />
                        </Tooltip>
                        <Tooltip title="Delete Post">
                            <Button
                                icon={<DeleteOutlined />}
                                onClick={() => onDelete(post)}
                                danger
                                className="!rounded !border-red-100 dark:!border-red-900/30 hover:!border-red-500 !flex items-center justify-center !h-9 !w-9 bg-white dark:bg-slate-900 shadow-sm transition-all"
                            />
                        </Tooltip>
                    </div>
                </div>
            </div>

            {/* Image Viewer Modal */}
            <ImageViewer
                isOpen={imageViewerOpen}
                onClose={() => setImageViewerOpen(false)}
                images={allImages.map(getProxiedImageUrl)}
                initialIndex={selectedImageIndex}
            />
        </>
    );
}

export default PostCard;
