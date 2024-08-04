"use client";

import { LIST_TENANTS } from "@/app/api/admin/tenants";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "react-query";
import { toast } from "react-toastify";

const { createContext, useState, useContext } = require("react");

export const tenantContext = createContext();
export const useTenantContext = () => useContext(tenantContext);

function TenantContextProvider({ children }) {
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
  const tenantList = useQuery({
    queryKey: ["tenantList", JSON.stringify(debFilter)],
    queryFn: async () => {
      return await LIST_TENANTS(debFilter);
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
    <tenantContext.Provider
      value={{ filters, tenantList, setFilters, onChange }}
    >
      {children}
    </tenantContext.Provider>
  );
}

export default TenantContextProvider;
