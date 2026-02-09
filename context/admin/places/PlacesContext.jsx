"use client";

import { GET_PLACES } from "@/app/api/admin/places";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const { createContext, useState, useContext } = require("react");

export const placesContext = createContext();
export const usePlacesContext = () => useContext(placesContext);

function PlacesContextProvider({ children }) {
    const [filters, setFilters] = useState({
        itemsPerPage: 20,
        currentPage: 1,
        search: null,
        categoryId: null,
        sortOrder: -1,
        sortingKey: "_id",
        onChangeSearch: false,
        advance: null,
    });

    const debFilter = useDebounce(filters, filters?.onChangeSearch ? 1000 : 0);
    const placesList = useQuery({
        queryKey: ["placesList", JSON.stringify(debFilter)],
        queryFn: async () => {
            return await GET_PLACES(debFilter);
        },
        enabled: true,
        onError: (error) => {
            console.error("Error fetching data:", error);
            toast.error("Something went wrong. Please try again later.");
        },
    });

    function onChange(data) {
        setFilters((old) => ({ ...old, ...data }));
    }

    return (
        <placesContext.Provider
            value={{ filters, placesList, setFilters, onChange }}
        >
            {children}
        </placesContext.Provider>
    );
}

export default PlacesContextProvider;
