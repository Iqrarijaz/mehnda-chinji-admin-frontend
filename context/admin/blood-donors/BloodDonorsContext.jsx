"use client";

import { GET_BLOOD_DONORS } from "@/app/api/admin/blood-donors";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
const { createContext, useState, useContext } = require("react");

export const BloodDonorsContext = createContext();
export const useBloodDonorsContext = () => useContext(BloodDonorsContext);

function BloodDonorsContextProvider({ children }) {
    const [filters, setFilters] = useState({
        limit: 10,
        page: 1,
        search: "",
        bloodGroup: "",
        city: "",
        available: ""
    });

    const debouncedSearch = useDebounce(filters.search, 500);

    const bloodDonorsList = useQuery({
        queryKey: ["bloodDonorsList", { ...filters, search: debouncedSearch }],
        queryFn: () => GET_BLOOD_DONORS({ ...filters, search: debouncedSearch }),
        keepPreviousData: true,
    });

    const onChange = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    return (
        <BloodDonorsContext.Provider
            value={{
                bloodDonorsList,
                filters,
                setFilters,
                onChange,
            }}
        >
            {children}
        </BloodDonorsContext.Provider>
    );
}

export default BloodDonorsContextProvider;
