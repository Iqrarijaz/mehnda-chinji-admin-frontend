"use client";
import React, { useState, useCallback, useMemo } from "react";
import { useQuery, useInfiniteQuery } from "react-query";
import { toast } from "react-toastify";
import AddButton from "@/components/InnerPage/AddButton";
import SearchInput from "@/components/InnerPage/SearchInput";
import PostsTable from "./components/Table";
import PostCardList from "./components/PostCardList";
import ItemsPerPageDropdown from "@/components/InnerPage/ItemsPerPageDropdown";
import AddPostModal from "./components/AddModal";
import UpdatePostModal from "./components/UpdateModal";
import SelectBox from "@/components/SelectBox";
import FilterModal from "./components/FilterModal";
import { GET_POSTS } from "@/app/api/admin/posts";
import { FaFilter, FaThLarge, FaTable } from "react-icons/fa";
import { useDebounce } from "@/hooks/useDebounce";
import InnerPageCard from "@/components/layout/InnerPageCard";

const POST_TYPES = [
    { value: "GENERAL", label: "General" },
    { value: "DEATH", label: "Death" },
    { value: "EVENT", label: "Event" },
    { value: "ANNOUNCEMENT", label: "Announcement" },
];
const STATUS_OPTIONS = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
];

export default function PostsPage() {
    const [modal, setModal] = useState({ name: null, data: null, state: false });
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

    const debFilter = useDebounce(filters, filters.onChangeSearch ? 1000 : 0);
    const onChange = (data) => setFilters((old) => ({ ...old, ...data }));

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

    const handleTypeFilter = (value) =>
        setFilters((prev) => ({ ...prev, type: value || null, currentPage: 1 }));
    const handleStatusFilter = (value) =>
        setFilters((prev) => ({ ...prev, status: value || null, currentPage: 1 }));

    const hasActiveFilters = filters?.type || filters?.status || filters?.search;

    return (
        <InnerPageCard>

            {/* Title row — view mode toggle lives here */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h1 className="inner-page-title text-2xl md:text-3xl text-black p-0 font-semibold">Posts</h1>
                    <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode("cards")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${viewMode === "cards" ? "bg-[#0F172A] text-white" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            <FaThLarge size={12} /> Cards
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${viewMode === "table" ? "bg-[#0F172A] text-white" : "text-gray-600 hover:text-gray-900"}`}
                        >
                            <FaTable size={12} /> Table
                        </button>
                    </div>
                </div>

                {/* Mobile: filter + view toggle */}
                <div className="flex md:hidden gap-2">
                    <button
                        onClick={() => setFilterModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] text-white rounded-lg hover:bg-[#1e293b] transition-colors relative"
                    >
                        <FaFilter size={14} />
                        {hasActiveFilters && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />}
                    </button>
                    <button
                        onClick={() => setViewMode(viewMode === "cards" ? "table" : "cards")}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        {viewMode === "cards" ? <FaTable size={14} /> : <FaThLarge size={14} />}
                    </button>
                </div>
            </div>

            {/* Controls row */}
            <div className="flex justify-end mb-4 gap-4 items-center">
                <div className="hidden md:flex gap-4 items-center">
                    <SelectBox placeholder="Filter by Type" allowClear handleChange={handleTypeFilter} value={filters?.type} width={160} options={POST_TYPES.map((t) => ({ value: t.value, label: t.label }))} />
                    <SelectBox placeholder="Filter by Status" allowClear handleChange={handleStatusFilter} value={filters?.status} width={160} options={STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))} />
                    <SearchInput setFilters={setFilters} />
                </div>
                {viewMode === "table" && <ItemsPerPageDropdown onChange={onChange} />}
                <AddButton title="Add" icon={false} onClick={() => setModal({ name: "Add", data: null, state: true })} />
            </div>

            <div className="flex flex-col mb-4">
                {viewMode === "cards" ? (
                    <PostCardList modal={modal} setModal={setModal} postsList={unifiedPostsList} loadMore={loadMore} hasMore={hasMore} setFilters={setFilters} />
                ) : (
                    <PostsTable modal={modal} setModal={setModal} postsList={unifiedPostsList} onChange={onChange} setFilters={setFilters} />
                )}
            </div>

            <FilterModal isOpen={filterModalOpen} onClose={() => setFilterModalOpen(false)} filters={filters} setFilters={setFilters} />
            <AddPostModal modal={modal} setModal={setModal} />
            <UpdatePostModal modal={modal} setModal={setModal} />
        </InnerPageCard>
    );
}
