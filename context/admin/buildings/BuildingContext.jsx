"use client";

import { LIST_BUILDINGS } from "@/app/api/admin/buildings";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const { createContext, useState, useContext } = require("react");

export const buildingContext = createContext();
export const useBuildingContext = () => useContext(buildingContext);

function BuildingContextProvider({ children }) {
  const [filters, setFilters] = useState({
    itemsPerPage: 10,
    currentPage: 1,
    keyWord: null,
    sortOrder: -1,
    sortingKey: "_id",
    onChangeSearch: false,
    advance: null,
  });

  const debFilter = useDebounce(filters, filters?.onChangeSearch ? 1000 : 0);
  const buildingsList = useQuery({
    queryKey: ["buildingsList", JSON.stringify(debFilter)],
    queryFn: async () => {
      return await LIST_BUILDINGS(debFilter);
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
    <buildingContext.Provider
      value={{ filters, buildingsList, setFilters, onChange }}
    >
      {children}
    </buildingContext.Provider>
  );
}

export default BuildingContextProvider;
