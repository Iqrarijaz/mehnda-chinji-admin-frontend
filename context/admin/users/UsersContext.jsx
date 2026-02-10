"use client";

import { GET_USERS } from "@/app/api/admin/users";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
const { createContext, useState, useContext } = require("react");

export const UsersContext = createContext();
export const useUsersContext = () => useContext(UsersContext);

function UsersContextProvider({ children }) {
    const [filters, setFilters] = useState({
        limit: 20,
        page: 1,
        search: "",
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
    });

    const debFilter = useDebounce(filters, filters?.onChangeSearch ? 500 : 0);

    const usersList = useQuery({
        queryKey: ["usersList", JSON.stringify(debFilter)],
        queryFn: async () => {
            return await GET_USERS(debFilter);
        },
        keepPreviousData: true,
        onError: (error) => {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch users.");
        },
    });

    function onChange(data) {
        setFilters((prev) => ({ ...prev, ...data }));
    }

    return (
        <UsersContext.Provider
            value={{ filters, usersList, setFilters, onChange }}
        >
            {children}
        </UsersContext.Provider>
    );
}

export default UsersContextProvider;
