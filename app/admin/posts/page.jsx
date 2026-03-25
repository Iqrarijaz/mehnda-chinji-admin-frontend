"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useQuery, useInfiniteQuery } from "react-query";
import { toast } from "react-toastify";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import PostsTable from "./components/Table";
import PostCardList from "./components/PostCardList";
import AddPostModal from "./components/AddModal";
import UpdatePostModal from "./components/UpdateModal";
import SelectBox from "@/components/SelectBox";
import FilterModal from "./components/FilterModal";
import LikesModal from "./components/LikesModal";
import CommentsModal from "./components/CommentsModal";
import { GET_POSTS } from "@/app/api/admin/posts";
import { FaFilter, FaThLarge, FaTable } from "react-icons/fa";
import { useDebounce } from "@/hooks/useDebounce";
import InnerPageCard from "@/components/layout/InnerPageCard";
import ColumnVisibilityDropdown from "@/components/InnerPage/ColumnVisibilityDropdown";
import { FiFilter } from "react-icons/fi";

const POST_TYPES = [
    { value: "GENERAL", label: "General" },
    { value: "DEATH", label: "Death Announcement" },
    { value: "ACCIDENT", label: "Accident" },
    { value: "EVENT", label: "Event" },
    { value: "ANNOUNCEMENT", label: "Announcement" }
];
const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
];

export default function PostsPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
    const [likesModal, setLikesModal] = useState({ open: false, postId: null });
    const [commentsModal, setCommentsModal] = useState({ open: false, postId: null });
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState("cards");
    const [filters, setFilters] = useState({
        itemsPerPage: 10,
        currentPage: 1,
        search: null,
        type: null,
        status: null,
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
    });

    // Column Visibility State
    const [visibleColumns, setVisibleColumns] = useState(["type", "content", "likesCount", "commentsCount", "status", "createdAt", "actions"]);

    const columnOptions = [
        { label: "Type", value: "type" },
        { label: "Content", value: "content" },
        { label: "Likes", value: "likesCount" },
        { label: "Comments", value: "commentsCount" },
        { label: "Status", value: "status" },
        { label: "Created At", value: "createdAt" },
    ];

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
    const onChange = useCallback((data) => setFilters((old) => ({ ...old, ...data })), []);

    // Table view query
    const postsList = useQuery({
        queryKey: ["postsList", JSON.stringify(debFilter)],
        queryFn: () => GET_POSTS(debFilter),
        enabled: viewMode === "table",
        onError: () => toast.error("Something went wrong. Please try again later."),
    });

    // Card view infinite query
    const infinitePostsQuery = useInfiniteQuery({
        queryKey: ["postsListInfinite", JSON.stringify({ ...debFilter, currentPage: undefined })],
        queryFn: async ({ pageParam = 1 }) => {
            const result = await GET_POSTS({ ...debFilter, currentPage: pageParam });
            return { ...result, currentPage: pageParam };
        },
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage?.pagination || {};
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        enabled: viewMode === "cards",
        onError: () => toast.error("Something went wrong. Please try again later."),
    });

    const flattenedPosts = useMemo(() => {
        if (!infinitePostsQuery.data?.pages) return [];
        return infinitePostsQuery.data.pages.flatMap((p) => p?.data || []);
    }, [infinitePostsQuery.data?.pages]);

    const unifiedPostsList = useMemo(() => {
        if (viewMode === "table") return postsList;
        const lastPage = infinitePostsQuery.data?.pages?.[infinitePostsQuery.data.pages.length - 1];
        return {
            status: infinitePostsQuery.status,
            data: { data: flattenedPosts, pagination: lastPage?.pagination || {} },
            isFetchingNextPage: infinitePostsQuery.isFetchingNextPage,
        };
    }, [viewMode, postsList, infinitePostsQuery, flattenedPosts]);

    const hasMore = infinitePostsQuery.hasNextPage;
    const loadMore = useCallback(() => {
        if (hasMore && !infinitePostsQuery.isFetchingNextPage) {
            infinitePostsQuery.fetchNextPage();
        }
    }, [hasMore, infinitePostsQuery]);

    const handleTypeFilter = useCallback((value) =>
        setFilters((prev) => ({ ...prev, type: value || null, currentPage: 1 })), []);
    const handleStatusFilter = useCallback((value) =>
        setFilters((prev) => ({ ...prev, status: value || null, currentPage: 1 })), []);

    const hasActiveFilters = filters?.type || filters?.status || filters?.search;

    return (
        <InnerPageCard>

            {/* Title row — view mode toggle lives here */}
            {/* Header row with Title and Mobile Controls */}
            <div className="flex flex-col md:flex-row justify-between mb-4 gap-3 items-start md:items-center">
                <div className="flex items-center gap-3">
                    <h1 className="inner-page-title text-2xl md:text-3xl text-black p-0 font-semibold">Posts</h1>
                    <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("cards")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${viewMode === "cards" ? "bg-[#006666] text-white shadow-lg shadow-teal-900/10" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            <FaThLarge size={12} /> Cards
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${viewMode === "table" ? "bg-[#006666] text-white shadow-lg shadow-teal-900/10" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            <FaTable size={12} /> Table
                        </button>
                    </div>
                </div>

                {/* Action Bar (Right) */}
                <div className="flex gap-2 items-center w-full md:w-auto justify-end">
                    {/* Desktop Filters (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-3">
                        <SelectBox placeholder="Filter by Type" allowClear handleChange={handleTypeFilter} value={filters?.type} width={160} options={POST_TYPES.map((t) => ({ value: t.value, label: t.label }))} />
                        <SelectBox placeholder="Filter by Status" allowClear handleChange={handleStatusFilter} value={filters?.status} width={160} options={STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))} />
                        <SearchInput setFilters={setFilters} pageKey="currentPage" />
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Column Visibility (Desktop/Mobile unified) */}
                        <ColumnVisibilityDropdown
                            options={columnOptions}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        />

                        {/* View Mode Toggle (Mobile Only) */}
                        <button
                            onClick={() => setViewMode(viewMode === "cards" ? "table" : "cards")}
                            className="mobile-filter-btn md:hidden"
                            title="Switch View"
                        >
                            {viewMode === "cards" ? <FaTable size={16} /> : <FaThLarge size={16} />}
                        </button>

                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setFilterModalOpen(true)}
                            className="mobile-filter-btn md:hidden"
                            title="Filters"
                        >
                            <FiFilter size={18} />
                            {hasActiveFilters && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-white" />
                            )}
                        </button>

                        <AddButton
                            title="Add Post"
                            icon={false}
                            onClick={() => setModal({ name: "Add", state: true, data: null })}
                            className="!h-[36px] !rounded-xl !px-4 !text-[12px] shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
                        />
                    </div>
                </div>
            </div>



            <div className="flex flex-col mb-4">
                {viewMode === "cards" ? (
                    <PostCardList
                        modal={modal}
                        setModal={setModal}
                        postsList={unifiedPostsList}
                        loadMore={loadMore}
                        hasMore={hasMore}
                        setFilters={setFilters}
                        setLikesModal={setLikesModal}
                        setCommentsModal={setCommentsModal}
                    />
                ) : (
                    <PostsTable
                        modal={modal}
                        setModal={setModal}
                        postsList={unifiedPostsList}
                        onChange={onChange}
                        setFilters={setFilters}
                        setLikesModal={setLikesModal}
                        setCommentsModal={setCommentsModal}
                        visibleColumns={visibleColumns}
                    />
                )}
            </div>

            <FilterModal isOpen={filterModalOpen} onClose={() => setFilterModalOpen(false)} filters={filters} setFilters={setFilters} />
            <AddPostModal modal={modal} setModal={setModal} />
            <UpdatePostModal modal={modal} setModal={setModal} />

            <LikesModal
                isOpen={likesModal.open}
                postId={likesModal.postId}
                onClose={() => setLikesModal({ open: false, postId: null })}
            />
            <CommentsModal
                isOpen={commentsModal.open}
                postId={commentsModal.postId}
                onClose={() => setCommentsModal({ open: false, postId: null })}
            />
        </InnerPageCard>
    );
}
