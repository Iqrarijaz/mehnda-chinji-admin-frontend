"use client";
import React, { useState } from "react";
import { FaHeart, FaComment, FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaImages } from "react-icons/fa";
import { Switch } from "antd";
import { timestampToDate, timestampToDateWithTime } from "@/utils/date";
import { getTagColor } from "@/utils/tagColor";
import ImageViewer from "@/components/shared/ImageViewer";

function PostCard({
    post,
    onEdit,
    onDelete,
    onStatusChange,
    isExpanded,
    onToggleExpand
}) {
    const isActive = post?.status === "ACTIVE";
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Get all images from media or images array
    const allImages = post?.media?.map(m => m.url) || post?.images || [];
    const hasMultipleImages = allImages.length > 1;

    // Helper to handle potential Unsplash page URLs and convert to direct image links
    const getProxiedImageUrl = (url) => {
        if (!url) return null;
        if (url.includes("unsplash.com/photos/")) {
            const parts = url.split("/");
            const lastPart = parts[parts.length - 1];
            if (lastPart) {
                // If the last part has a slug (hyphenated), the ID is the last segment
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
                <div className="w-full h-40 md:h-48 flex items-center justify-center bg-gray-100 text-gray-400">
                    <span className="text-2xl font-bold">
                        {post?.title?.charAt(0)?.toUpperCase() || "P"}
                    </span>
                </div>
            );
        }

        if (count === 1) {
            return (
                <div
                    className="relative w-full h-48 md:h-56 cursor-pointer overflow-hidden"
                    onClick={(e) => handleImageClick(e, 0)}
                >
                    <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                </div>
            );
        }

        // Multiple images: One large and 2-3 small ones in a row below it or side-by-side
        // Layout: Top (Main), Bottom (Thumbnails) inside the header
        return (
            <div className="relative w-full h-48 md:h-56 flex flex-col gap-1 overflow-hidden">
                {/* Main Large Image */}
                <div
                    className="flex-1 w-full cursor-pointer relative"
                    onClick={(e) => handleImageClick(e, 0)}
                >
                    <img
                        src={imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Small thumbnails row */}
                <div className="flex gap-1 h-[30%] w-full">
                    {safeImages.slice(1, 4).map((img, idx) => (
                        <div
                            key={idx}
                            className="relative flex-1 cursor-pointer overflow-hidden"
                            onClick={(e) => handleImageClick(e, idx + 1)}
                        >
                            <img
                                src={img}
                                className="w-full h-full object-cover border-t border-white/20 hover:opacity-80 transition-opacity"
                            />
                            {idx === 2 && count > 4 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-[10px] font-bold">
                                    +{count - 4}
                                </div>
                            )}
                        </div>
                    ))}
                    {/* If there were only 2 images total, the slice(1,4) will have 1 image. 
                        If we want to fill the width, we can flex it. */}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        const isLongContent = post?.content?.length > 50;
        if (!isLongContent) return <p className="text-gray-700 text-sm py-2 whitespace-pre-wrap">{post?.content}</p>;

        return (
            <div className="py-2">
                <p className="text-gray-700 text-sm whitespace-pre-wrap">
                    {isExpanded ? post?.content : `${post?.content?.substring(0, 50)}...`}
                </p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleExpand();
                    }}
                    className="text-blue-600 text-[10px] font-bold hover:underline mt-1"
                >
                    {isExpanded ? "See Less" : "See More"}
                </button>
            </div>
        );
    };

    // Regular small card - Now flexible for masonry
    return (
        <>
            <div
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border flex flex-col w-full break-inside-avoid mb-6"
            >
                {/* Image Header Section */}
                <div className="relative">
                    {renderImageHeader()}

                    {/* Tag Overlay */}
                    <div className="absolute top-2 left-2 z-10">
                        <span
                            className="text-[10px] px-2 py-0.5 rounded font-semibold text-white shadow-lg bg-black/40 backdrop-blur-sm"
                            style={{ backgroundColor: getTagColor(post?.type) }}
                        >
                            {post?.type || "GENERAL"}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col p-4">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2">
                        {post?.title}
                    </h3>

                    {renderContent()}

                    {/* Stats & Time */}
                    <div className="flex items-center gap-3 mb-4 text-[11px] text-gray-500 pt-3 border-t">
                        <div className="flex items-center gap-1 cursor-default">
                            <FaHeart className="text-red-400" size={12} />
                            <span>{post?.likesCount || 0}</span>
                        </div>
                        <div className="flex items-center gap-1 cursor-pointer hover:text-blue-500 transition-colors">
                            <FaComment className="text-blue-400" size={12} />
                            <span>{post?.commentsCount || 0}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 ml-auto">
                            {timestampToDateWithTime(post?.createdAt)}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t">
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={isActive}
                                onChange={() => onStatusChange(post)}
                                size="small"
                                className={isActive ? '' : 'ant-switch-red'}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onEdit(post)}
                                className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                title="Edit"
                            >
                                <FaEdit size={14} />
                            </button>
                            <button
                                onClick={() => onDelete(post)}
                                className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                title="Delete"
                            >
                                <FaTrash size={14} />
                            </button>
                        </div>
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
