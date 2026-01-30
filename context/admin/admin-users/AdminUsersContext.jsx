"use client";

import { GET_ADMIN_USERS } from "@/app/api/admin/admin-users";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
const { createContext, useState, useContext } = require("react");

export const AdminUsersContext = createContext();
export const useAdminUsersContext = () => useContext(AdminUsersContext);

function AdminUsersContextProvider({ children }) {
    const [filters, setFilters] = useState({
        limit: 10,
        page: 1,
        search: "",
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
    });

    const debFilter = useDebounce(filters, filters?.onChangeSearch ? 500 : 0);

    const adminUsersList = useQuery({
        queryKey: ["adminUsersList", JSON.stringify(debFilter)],
        queryFn: async () => {
            return await GET_ADMIN_USERS(debFilter);
        },
        keepPreviousData: true,
        onError: (error) => {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch admin users.");
        },
    });

    function onChange(data) {
        setFilters((prev) => ({ ...prev, ...data }));
    }

    return (
        <AdminUsersContext.Provider
            value={{ filters, adminUsersList, setFilters, onChange }}
        >
            {children}
        </AdminUsersContext.Provider>
    );
}

export default AdminUsersContextProvider;
