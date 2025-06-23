"use client";

import { LIST_LOCATIONS } from "@/app/api/admin/locations";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const { createContext, useState, useContext } = require("react");

export const locationsContext = createContext();
export const useLocationsContext = () => useContext(locationsContext);

function LocationsContextProvider({ children }) {
  const [filters, setFilters] = useState({
    itemsPerPage: 20,
    currentPage: 1,
    search: null,
    sortOrder: -1,
    sortingKey: "_id",
    onChangeSearch: false,
    advance: null,
  });

  const debFilter = useDebounce(filters, filters?.onChangeSearch ? 1000 : 0);
  const locationsList = useQuery({
    queryKey: ["locationsList", JSON.stringify(debFilter)],
    queryFn: async () => {
      return await LIST_LOCATIONS(debFilter);
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
    <locationsContext.Provider
      value={{ filters, locationsList, setFilters, onChange }}
    >
      {children}
    </locationsContext.Provider>
  );
}

export default LocationsContextProvider;
