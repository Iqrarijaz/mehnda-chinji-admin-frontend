"use client";

import { LIST_BUSINESS_CATEGORIES } from "@/app/api/admin/business-categories";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const { createContext, useState, useContext } = require("react");

export const businessCategoriesContext = createContext();
export const useBusinessCategoriesContext = () => useContext(businessCategoriesContext);

function BusinessCategoriesContextProvider({ children }) {
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
  const businessCategoriesList = useQuery({
    queryKey: ["businessCategoriesList", JSON.stringify(debFilter)],
    queryFn: async () => {
      return await LIST_BUSINESS_CATEGORIES(debFilter);
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
    <businessCategoriesContext.Provider
      value={{ filters, businessCategoriesList, setFilters, onChange }}
    >
      {children}
    </businessCategoriesContext.Provider>
  );
}

export default BusinessCategoriesContextProvider;
