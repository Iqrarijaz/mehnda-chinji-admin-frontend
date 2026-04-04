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
import { HiRefresh } from "react-icons/hi";
import { ADMIN_KEYS } from "@/constants/queryKeys";
import { useAdminData } from "@/hooks/useAdminData";

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

    // 1. Standard Query (Table View)
    const {
        listQuery: postsList,
        isRefreshing: isRefreshingTable,
        handleRefresh: handleRefreshTable
    } = useAdminData({
        listQueryKey: [ADMIN_KEYS.POSTS.LIST, JSON.stringify(debFilter)],
        listQueryFn: () => GET_POSTS(debFilter),
        onListError: "Failed to fetch posts.",
    });

    // 2. Infinite Query (Card View)
    const infinitePostsQuery = useInfiniteQuery({
        queryKey: [ADMIN_KEYS.POSTS.INFINITE, JSON.stringify({ ...debFilter, currentPage: undefined })],
        queryFn: async ({ pageParam = 1 }) => {
            const result = await GET_POSTS({ ...debFilter, currentPage: pageParam });
            return { ...result, currentPage: pageParam };
        },
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage?.pagination || {};
            return currentPage < totalPages ? currentPage + 1 : undefined;
        },
        enabled: viewMode === "cards",
        onError: () => toast.error("Failed to fetch infinite posts."),
    });

    const [isRefreshingInfinite, setIsRefreshingInfinite] = useState(false);

    const handleRefresh = useCallback(async () => {
        if (viewMode === "table") {
            await handleRefreshTable();
        } else {
            setIsRefreshingInfinite(true);
            try {
                await infinitePostsQuery.refetch();
                toast.success("Recent posts synchronized!");
            } catch {
                toast.error("Failed to sync posts.");
            } finally {
                setIsRefreshingInfinite(false);
            }
        }
    }, [viewMode, handleRefreshTable, infinitePostsQuery]);

    const isRefreshing = viewMode === "table" ? isRefreshingTable : isRefreshingInfinite;

    return (
        <InnerPageCard>

            {/* Title row — view mode toggle lives here */}
            {/* Header row with Title and Mobile Controls */}
            <div className="flex flex-col md:flex-row justify-between mb-4 gap-3 items-start md:items-center">
                <div className="flex items-center gap-3">
                    <h1 className="inner-page-title text-2xl md:text-3xl text-black dark:text-slate-100 p-0 font-semibold transition-colors duration-300">Posts</h1>
                    <div className="hidden md:flex items-center bg-gray-100 dark:bg-slate-800 rounded p-1 transition-colors duration-300">
                        <button
                            onClick={() => setViewMode("cards")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${viewMode === "cards" ? "bg-[#006666] text-white shadow-lg shadow-teal-900/10" : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100"}`}
                        >
                            <FaThLarge size={12} /> Cards
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${viewMode === "table" ? "bg-[#006666] text-white shadow-lg shadow-teal-900/10" : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-100"}`}
                        >
                            <FaTable size={12} /> Table
                        </button>
                    </div>
                </div>

                {/* Action Bar (Right) */}
                <div className="flex gap-2 items-center w-full md:w-auto justify-end">
                    {/* Desktop Filters (Hidden on Mobile) */}
                    <div className="hidden md:flex items-center gap-3">
                        <SelectBox placeholder="Type" allowClear handleChange={handleTypeFilter} value={filters?.type} width={160} options={POST_TYPES.map((t) => ({ value: t.value, label: t.label }))} />
                        <SelectBox placeholder="Status" allowClear handleChange={handleStatusFilter} value={filters?.status} width={160} options={STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))} />
                        <SearchInput setFilters={setFilters} pageKey="currentPage" />
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Column Visibility (Desktop/Mobile unified) */}
                        <ColumnVisibilityDropdown
                            options={columnOptions}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        />

                        {/* Refresh Button */}
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            title="Refresh Data"
                            className="flex items-center justify-center !h-[32px] !w-[32px] !border !border-[#006666] dark:!border-teal-900/50 !bg-white dark:!bg-slate-800 !text-[#006666] dark:!text-teal-400 hover:!bg-[#006666] dark:hover:!bg-teal-600 hover:!text-white !rounded shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiRefresh size={16} className={isRefreshing ? "animate-spin" : ""} />
                        </button>

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
                            className="!h-[32px] !rounded !px-4 !text-[10px] font-medium shadow-sm transform hover:scale-[1.02] active:scale-[0.98]"
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
