"use client";

import { GET_ROLES } from "@/app/api/admin/roles";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
const { createContext, useState, useContext } = require("react");

export const RolesContext = createContext();
export const useRolesContext = () => useContext(RolesContext);

function RolesContextProvider({ children }) {
    const [filters, setFilters] = useState({
        itemsPerPage: 10,
        currentPage: 1,
        search: "",
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
    });

    const debFilter = useDebounce(filters, filters?.onChangeSearch ? 500 : 0);

    const rolesList = useQuery({
        queryKey: ["rolesList", JSON.stringify(debFilter)],
        queryFn: async () => {
            return await GET_ROLES(debFilter);
        },
        keepPreviousData: true,
        onError: (error) => {
            console.error("Error fetching data:", error);
            toast.error("Failed to fetch roles.");
        },
    });

    function onChange(data) {
        setFilters((prev) => ({ ...prev, ...data }));
    }

    return (
        <RolesContext.Provider
            value={{ filters, rolesList, setFilters, onChange }}
        >
            {children}
        </RolesContext.Provider>
    );
}

export default RolesContextProvider;
