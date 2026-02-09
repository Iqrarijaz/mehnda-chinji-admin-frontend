"use client";

import { GET_POSTS } from "@/app/api/admin/posts";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery, useInfiniteQuery } from "react-query";
import { toast } from "react-toastify";
import { createContext, useState, useContext, useCallback, useMemo } from "react";

export const postsContext = createContext();
export const usePostsContext = () => useContext(postsContext);

function PostsContextProvider({ children }) {
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

    // View mode: 'table' or 'cards'
    const [viewMode, setViewMode] = useState('cards');

    const debFilter = useDebounce(filters, filters?.onChangeSearch ? 1000 : 0);

    // Regular query for table view
    const postsList = useQuery({
        queryKey: ["postsList", JSON.stringify(debFilter)],
        queryFn: async () => {
            return await GET_POSTS(debFilter);
        },
        enabled: viewMode === 'table',
        onError: (error) => {
            console.error("Error fetching posts:", error);
            toast.error("Something went wrong. Please try again later.");
        },
    });

    // Infinite query for card view with lazy loading
    const infinitePostsQuery = useInfiniteQuery({
        queryKey: ["postsListInfinite", JSON.stringify({ ...debFilter, currentPage: undefined })],
        queryFn: async ({ pageParam = 1 }) => {
            const result = await GET_POSTS({ ...debFilter, currentPage: pageParam });
            return {
                ...result,
                currentPage: pageParam,
            };
        },
        getNextPageParam: (lastPage) => {
            const { currentPage, totalPages } = lastPage?.pagination || {};
            if (currentPage < totalPages) {
                return currentPage + 1;
            }
            return undefined;
        },
        enabled: viewMode === 'cards',
        onError: (error) => {
            console.error("Error fetching posts:", error);
            toast.error("Something went wrong. Please try again later.");
        },
    });

    // Flatten infinite query data for card list
    const flattenedPosts = useMemo(() => {
        if (!infinitePostsQuery.data?.pages) return [];
        return infinitePostsQuery.data.pages.flatMap(page => page?.data || []);
    }, [infinitePostsQuery.data?.pages]);

    // Create a unified postsList object for card view
    const unifiedPostsList = useMemo(() => {
        if (viewMode === 'table') {
            return postsList;
        }

        const lastPage = infinitePostsQuery.data?.pages?.[infinitePostsQuery.data.pages.length - 1];
        return {
            status: infinitePostsQuery.status,
            data: {
                data: flattenedPosts,
                pagination: lastPage?.pagination || {},
            },
            isFetchingNextPage: infinitePostsQuery.isFetchingNextPage,
        };
    }, [viewMode, postsList, infinitePostsQuery, flattenedPosts]);

    // Has more pages for infinite scroll
    const hasMore = infinitePostsQuery.hasNextPage;

    // Load more function for infinite scroll
    const loadMore = useCallback(() => {
        if (hasMore && !infinitePostsQuery.isFetchingNextPage) {
            infinitePostsQuery.fetchNextPage();
        }
    }, [hasMore, infinitePostsQuery]);

    function onChange(data) {
        setFilters((old) => ({ ...old, ...data }));
    }

    return (
        <postsContext.Provider
            value={{
                filters,
                postsList: unifiedPostsList,
                setFilters,
                onChange,
                viewMode,
                setViewMode,
                hasMore,
                loadMore,
            }}
        >
            {children}
        </postsContext.Provider>
    );
}

export default PostsContextProvider;
