"use client";
import React, { useState } from "react";
import { FaHeart, FaComment, FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaImages } from "react-icons/fa";
import { Switch } from "antd";
import { timestampToDate, timestampToDateWithTime } from "@/utils/date";
import { getTagColor } from "@/utils/tagColor";
import ImageViewer from "@/components/shared/ImageViewer";

function PostCard({
    post,
    isFeatured = false,
    isExpanded = false,
    onToggleExpand,
    onEdit,
    onDelete,
    onStatusChange
}) {
    const isActive = post?.status === "ACTIVE";
    const [imageViewerOpen, setImageViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Get all images from media or images array
    const allImages = post?.media?.map(m => m.url) || post?.images || [];
    const imageUrl = allImages[0] || null;
    const hasMultipleImages = allImages.length > 1;

    const handleImageClick = (e, index = 0) => {
        e.stopPropagation();
        if (allImages.length > 0) {
            setSelectedImageIndex(index);
            setImageViewerOpen(true);
        }
    };

    if (isFeatured) {
        return (
            <>
                <div
                    className="relative rounded-xl overflow-hidden cursor-pointer group mb-6 shadow-lg"
                    onClick={() => onToggleExpand(post._id)}
                >
                    {/* Featured Image */}
                    <div
                        className="relative h-48 md:h-64 bg-gradient-to-br from-blue-400 to-blue-600"
                        onClick={(e) => imageUrl && handleImageClick(e, 0)}
                    >
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-white/50 text-6xl font-bold">
                                    {post?.title?.charAt(0)?.toUpperCase() || "P"}
                                </span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                        {/* Multiple images indicator */}
                        {hasMultipleImages && (
                            <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-white text-xs">
                                <FaImages size={12} />
                                <span>{allImages.length}</span>
                            </div>
                        )}
                    </div>

                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <span
                                className="text-xs px-2 py-1 rounded font-semibold"
                                style={{ backgroundColor: getTagColor(post?.type) }}
                            >
                                {post?.type || "GENERAL"}
                            </span>
                            <span className="text-xs text-white/80">
                                {timestampToDate(post?.createdAt)}
                            </span>
                        </div>
                        <h2 className="text-lg md:text-xl font-bold line-clamp-2 group-hover:text-blue-200 transition-colors">
                            {post?.title}
                        </h2>
                    </div>

                    {/* Expand indicator */}
                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-2">
                        {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                        <div className="bg-white p-4 border-t" onClick={(e) => e.stopPropagation()}>
                            {/* Image Gallery */}
                            {allImages.length > 0 && (
                                <div className="mb-4">
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {allImages.map((img, index) => (
                                            <div
                                                key={index}
                                                className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                                                onClick={(e) => handleImageClick(e, index)}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`Image ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className="text-gray-700 text-sm mb-4 whitespace-pre-wrap">
                                {post?.content}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <FaHeart className="text-red-400" />
                                    <span>{post?.likesCount || 0} likes</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <FaComment className="text-blue-400" />
                                    <span>{post?.commentsCount || 0} comments</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between border-t pt-4">
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
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <FaEdit size={12} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(post)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                    >
                                        <FaTrash size={12} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Image Viewer Modal */}
                <ImageViewer
                    isOpen={imageViewerOpen}
                    onClose={() => setImageViewerOpen(false)}
                    images={allImages}
                    initialIndex={selectedImageIndex}
                />
            </>
        );
    }

    // Regular small card
    return (
        <>
            <div
                className={`bg-white rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all border ${isExpanded ? 'ring-2 ring-primary' : ''}`}
                onClick={() => onToggleExpand(post._id)}
            >
                <div className="flex">
                    {/* Content */}
                    <div className="flex-1 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span
                                className="text-[10px] px-2 py-0.5 rounded font-semibold text-white"
                                style={{ backgroundColor: getTagColor(post?.type) }}
                            >
                                {post?.type || "GENERAL"}
                            </span>
                            <span className="text-xs text-gray-400">
                                {timestampToDate(post?.createdAt)}
                            </span>
                        </div>
                        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">
                            {post?.title}
                        </h3>
                        {!isExpanded && (
                            <p className="text-xs text-gray-500 line-clamp-2">
                                {post?.content?.substring(0, 80)}...
                            </p>
                        )}
                    </div>

                    {/* Image */}
                    <div
                        className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200"
                        onClick={(e) => imageUrl && handleImageClick(e, 0)}
                    >
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="text-2xl font-bold">
                                    {post?.title?.charAt(0)?.toUpperCase() || "P"}
                                </span>
                            </div>
                        )}

                        {/* Multiple images indicator */}
                        {hasMultipleImages && (
                            <div className="absolute bottom-1 right-1 bg-black/50 backdrop-blur-sm rounded px-1.5 py-0.5 flex items-center gap-1 text-white text-[10px]">
                                <FaImages size={8} />
                                <span>{allImages.length}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                    <div className="border-t p-4" onClick={(e) => e.stopPropagation()}>
                        {/* Image Gallery */}
                        {allImages.length > 0 && (
                            <div className="mb-4">
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {allImages.map((img, index) => (
                                        <div
                                            key={index}
                                            className="relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                                            onClick={(e) => handleImageClick(e, index)}
                                        >
                                            <img
                                                src={img}
                                                alt={`Image ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className="text-gray-700 text-sm mb-4 whitespace-pre-wrap">
                            {post?.content}
                        </p>

                        {/* Stats */}
                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <FaHeart className="text-red-400" />
                                <span>{post?.likesCount || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <FaComment className="text-blue-400" />
                                <span>{post?.commentsCount || 0}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-600">Status:</span>
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
                                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                                >
                                    <FaEdit size={10} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(post)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                >
                                    <FaTrash size={10} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Image Viewer Modal */}
            <ImageViewer
                isOpen={imageViewerOpen}
                onClose={() => setImageViewerOpen(false)}
                images={allImages}
                initialIndex={selectedImageIndex}
            />
        </>
    );
}

export default PostCard;
