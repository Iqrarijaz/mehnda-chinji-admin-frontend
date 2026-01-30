"use client";

import { CATEGORIES } from "@/app/api/admin/categories";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const { createContext, useState, useContext } = require("react");

export const categoriesContext = createContext();
export const usecategoriesContext = () => useContext(categoriesContext);

function CategoriesContextProvider({ children }) {
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
  const categoriesList = useQuery({
    queryKey: ["categoriesList", JSON.stringify(debFilter)],
    queryFn: async () => {
      return await CATEGORIES(debFilter);
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
    <categoriesContext.Provider
      value={{ filters, categoriesList, setFilters, onChange }}
    >
      {children}
    </categoriesContext.Provider>
  );
}

export default CategoriesContextProvider;
