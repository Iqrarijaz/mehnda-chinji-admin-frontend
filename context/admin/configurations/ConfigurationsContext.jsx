"use client";

import { CONFIGURATIONS } from "@/app/api/admin/configurations";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { createContext, useState, useContext } from "react";

export const configurationsContext = createContext();
export const useConfigurationsContext = () => useContext(configurationsContext);

function ConfigurationsContextProvider({ children }) {
    const [filters, setFilters] = useState({
        itemsPerPage: 10,
        currentPage: 1,
        type: null, // Show all by default
        search: null,
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
    });

    const debFilter = useDebounce(filters, filters?.onChangeSearch ? 1000 : 0);

    const configurationsList = useQuery({
        queryKey: ["configurationsList", JSON.stringify(debFilter)],
        queryFn: async () => {
            return await CONFIGURATIONS(debFilter);
        },
        enabled: true,
        onError: (error) => {
            console.error("Error fetching configurations:", error);
            toast.error("Something went wrong while fetching configurations.");
        },
    });

    function onChange(data) {
        setFilters((old) => ({ ...old, ...data }));
    }

    return (
        <configurationsContext.Provider
            value={{ filters, configurationsList, setFilters, onChange }}
        >
            {children}
        </configurationsContext.Provider>
    );
}

export default ConfigurationsContextProvider;
