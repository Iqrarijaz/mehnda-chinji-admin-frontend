"use client";

import { GET_POSTS } from "@/app/api/admin/posts";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const { createContext, useState, useContext } = require("react");

export const postsContext = createContext();
export const usePostsContext = () => useContext(postsContext);

function PostsContextProvider({ children }) {
    const [filters, setFilters] = useState({
        itemsPerPage: 20,
        currentPage: 1,
        search: null,
        type: null,
        status: null,
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
    });

    const debFilter = useDebounce(filters, filters?.onChangeSearch ? 1000 : 0);
    const postsList = useQuery({
        queryKey: ["postsList", JSON.stringify(debFilter)],
        queryFn: async () => {
            return await GET_POSTS(debFilter);
        },
        enabled: true,
        onError: (error) => {
            console.error("Error fetching posts:", error);
            toast.error("Something went wrong. Please try again later.");
        },
    });

    function onChange(data) {
        setFilters((old) => ({ ...old, ...data }));
    }

    return (
        <postsContext.Provider
            value={{ filters, postsList, setFilters, onChange }}
        >
            {children}
        </postsContext.Provider>
    );
}

export default PostsContextProvider;
