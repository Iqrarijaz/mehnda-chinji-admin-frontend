"use client";

import { GET_SUPPORT_TICKETS } from "@/app/api/admin/support";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
const { createContext, useState, useContext } = require("react");

export const SupportContext = createContext();
export const useSupportContext = () => useContext(SupportContext);

function SupportContextProvider({ children }) {
    const [filters, setFilters] = useState({
        limit: 20,
        page: 1,
        status: "",
        search: "",
        onChangeSearch: false,
    });

    const debFilter = useDebounce(filters, filters?.onChangeSearch ? 500 : 0);

    const ticketsList = useQuery({
        queryKey: ["ticketsList", JSON.stringify(debFilter)],
        queryFn: async () => {
            return await GET_SUPPORT_TICKETS(debFilter);
        },
        keepPreviousData: true,
        onError: (error) => {
            console.error("Error fetching tickets:", error);
            toast.error("Failed to fetch support tickets.");
        },
    });

    function onChange(data) {
        setFilters((prev) => ({ ...prev, ...data }));
    }

    return (
        <SupportContext.Provider
            value={{ filters, ticketsList, setFilters, onChange }}
        >
            {children}
        </SupportContext.Provider>
    );
}

export default SupportContextProvider;
